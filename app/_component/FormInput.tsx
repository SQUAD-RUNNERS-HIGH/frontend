import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { Controller, Control, FieldErrors } from "react-hook-form";
import Input from "./Input";

interface FormInputProps {
  control: Control<any>; // React Hook Form의 Control 객체 타입
  errorMessage?: string;
  name: string; // 컨트롤러에서 사용할 필드 이름
  label: string; // 폼 제목
  type?: string;
  isRadio?: boolean;
  placeholder: string;
  hideError?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  control,
  errorMessage,
  name,
  label,
  type = "text",
  placeholder,
  isRadio,
  hideError
}) => {
  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>
        <Text>{label}</Text>
        <Text style={styles.TitleRed}>*</Text>
      </Text>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          if (isRadio) {
            return (
              <RadioButton.Group
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <View style={styles.group}>
                  <View style={styles.option}>
                    <RadioButton value="male" />
                    <Text style={styles.optionText}>남성</Text>
                  </View>
                  <View style={styles.option}>
                    <RadioButton value="female" />
                    <Text style={styles.optionText}>여성</Text>
                  </View>
                </View>
              </RadioButton.Group>
            );
          }
          return (
            <>
              <Input
                type={type}
                placeholder={placeholder}
                isImg
                value={field.value} // 빈 문자열로 초기화
                onChange={field.onChange}
                
              />
              {!hideError && <Text style={styles.error}>{errorMessage}</Text>}
            </>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 6,
    width: "100%",
    minWidth: 320,
    maxWidth: 360,
  },
  formTitle: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500",
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
});

export default FormInput;
