import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { Controller, Control, useController } from "react-hook-form";
import { StringInput } from "./StringInput";
import ImageUpload from "./ImageUpload";
import SearchInput from "../SearchInput";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import SearchDropdown from "../SearchDropdown";

interface FormInputProps {
  control: Control<any>; // React Hook Form의 Control 객체 타입
  errorMessage?: string;
  name: string; // 컨트롤러에서 사용할 필드 이름
  label: string; // 폼 제목
  type?: string;
  isRadio?: boolean;
  isLocationInput?: boolean;
  isImage?: boolean;
  placeholder: string;
  hideError?: boolean;
}

const FormInput = ({
  control,
  errorMessage,
  name,
  label,
  type = "text",
  placeholder,
  isRadio,
  hideError,
  isImage,
  isLocationInput,
}: FormInputProps) => {
const { field } = useController({
    name,
    control,
  });

  const {
    searchQuery,
    selectedQuery,
    setSearchQuery,
    setSelectedQuery,
    fetchPlaces,
    results,
    isDropdownVisible,
  } = usePlacesSearch();

  const [dropdownHeight, setDropdownHeight] = useState<number>(0);
  const [inputHeight, setInputHeight] = useState<number>(0);
  
  // 이전 값을 추적하여 무한 렌더링 방지
  const prevLocationNameRef = useRef<string | null>(null);

  // field.value 변화를 안전하게 추적
  const currentLocationName = useMemo(() => {
    return field.value?.specificLocation || null;
  }, [field.value?.specificLocation]);

  // locationName이 실제로 변경된 경우에만 동기화
  useEffect(() => {
    if (!isLocationInput) return;

    if (currentLocationName && currentLocationName !== prevLocationNameRef.current) {
      setSearchQuery(currentLocationName);
      setSelectedQuery(currentLocationName);
      prevLocationNameRef.current = currentLocationName;
    }
  }, [currentLocationName, isLocationInput, setSearchQuery, setSelectedQuery]);

  // 디바운싱을 위한 안전한 useEffect
  useEffect(() => {
    if (!isLocationInput || !searchQuery) return;

    const timer = setTimeout(() => {
      if (selectedQuery !== searchQuery) {
        fetchPlaces(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedQuery, fetchPlaces, isLocationInput]);

  // 드롭다운 높이 리셋
  useEffect(() => {
    if (!isDropdownVisible) {
      setDropdownHeight(0);
    }
  }, [isDropdownVisible]);

  // 각 input 타입별 렌더링 함수들
  const renderRadioInput = useCallback(() => (
    <RadioButton.Group
      onValueChange={field.onChange}
      value={field.value}
    >
      <View style={styles.group}>
        <View style={styles.option}>
          <RadioButton value="MALE" />
          <Text style={styles.optionText}>남성</Text>
        </View>
        <View style={styles.option}>
          <RadioButton value="FEMALE" />
          <Text style={styles.optionText}>여성</Text>
        </View>
      </View>
    </RadioButton.Group>
  ), [field.onChange, field.value]);

  const renderImageInput = useCallback(() => (
    <ImageUpload
      field={field}
      errorMessage={errorMessage}
      type={type}
      placeholder={placeholder}
      hideError={hideError}
    />
  ), [field, errorMessage, type, placeholder, hideError]);

  const renderLocationInput = useCallback(() => (
    <View
      style={[
        inputHeight !== 0 && { minHeight: inputHeight + dropdownHeight },
        { position: "relative" },
      ]}
    >
      <SearchInput
        type="location"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setInputHeight={setInputHeight}
        nonHeader
      />
      {isDropdownVisible && (
        <SearchDropdown
          results={results}
          setSelectedQuery={setSelectedQuery}
          setSearchedLocation={field.onChange}
          inputHeight={inputHeight}
          setDropdownHeight={setDropdownHeight}
          form
        />
      )}
    </View>
  ), [
    inputHeight,
    dropdownHeight,
    searchQuery,
    setSearchQuery,
    isDropdownVisible,
    results,
    setSelectedQuery,
    field.onChange,
  ]);

  const renderStringInput = useCallback(() => (
    <StringInput
      field={field}
      errorMessage={errorMessage}
      type={type}
      placeholder={placeholder}
      hideError={hideError}
    />
  ), [field, errorMessage, type, placeholder, hideError]);

  // 조건부 렌더링 로직 개선
  const renderInputContent = () => {
    if (isRadio) return renderRadioInput();
    if (isImage) return renderImageInput();
    if (isLocationInput) return renderLocationInput();
    return renderStringInput();
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>
        <Text>{label}</Text>
        <Text style={styles.TitleRed}>*</Text>
      </Text>
      {renderInputContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 6,
    width: "100%",
  },
  formTitle: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500", // fontWeight는 문자열이어야 합니다.
    lineHeight: 20,
  },
  TitleRed: {
    color: "#EF4444",
    marginLeft: 4,
  },
  group: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
  },
  option: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 21,
    color: "#374151",
  },
  error: {
    fontSize: 14,
    color: "#EF4444",
  },
  dropdownContainer: {
    position: 'absolute',
    bottom: 0,
  }
});

export default FormInput;