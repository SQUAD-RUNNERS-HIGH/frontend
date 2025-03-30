import { useSegments } from "expo-router";
import React, { SetStateAction, useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Image } from "react-native";
import Input from "./Input";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<SetStateAction<string>>;
  type: "crew" | "location" | "chat";
  nonHeader?: boolean;
}
const SearchInput = ({
  searchQuery,
  setSearchQuery,
  type,
  nonHeader = false,
}: SearchInputProps) => {
  const [placeholder, setPlaceHolder] = useState<string>("");

  useEffect(() => {
    if (type === "crew") setPlaceHolder("크루를 검색하세요");
    if (type === "location") setPlaceHolder("위치를 검색하세요");
    if (type === "chat") setPlaceHolder("채팅 방, 채팅 내역을 검색하세요.");
  }, [type]);

  return (
    <View style={styles.rootContainer}>
      {nonHeader ? (
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={setSearchQuery}
        />
      ) : (
        <View style={[styles.searchContainer]}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../../assets/images/search.png")}
          />
          <TextInput
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder={placeholder}
            placeholderTextColor="#737373"
            style={styles.input}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
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
    alignItems: "center",
    fontFamily: "Open Sans",
    flex: 1,
    height: "100%",
    overflow: "hidden",
    maxHeight: 40,
  },
});

export default SearchInput;
