import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface SearchInputProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

const LocationInput = ({ onLocationSelect }: SearchInputProps) => {
  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    console.log(lat, lng, address);
  };
  return (
    <>
      <GooglePlacesAutocomplete
        placeholder="위치를 검색하세요"
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY,
          language: "ko", // 한국어 지원
          components: "country:kr", // 한국 내 검색 제한 (선택 사항)
        }}
        onPress={(data, details = null) => {
          console.log(data);
          if (details) {
            const { lat, lng } = details.geometry.location;
            onLocationSelect(lat, lng, data.description);
          }
        }}
        styles={{
          textInput: styles.input,
          container: { flex: 1 },
          listView: { backgroundColor: "white" },
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: "#E2E2E2",
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 4,
    gap: 8,
    borderRadius: 999,
    flex: 1,
  },
  input: {
    color: "#737373",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Open Sans",
    flex: 1,
    height: "100%",
  },
});

export default LocationInput;
