import React, { SetStateAction } from "react";
import { View, TextInput, StyleSheet, Image } from "react-native";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<SetStateAction<string>>;
}
const SearchInput = ({ searchQuery, setSearchQuery }: SearchInputProps) => {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.searchContainer}>
        <Image
          style={{ width: 20, height: 20 }}
          source={require("../../assets/images/search.png")}
        />
        <TextInput
          onChangeText={setSearchQuery}
          value={searchQuery} // 숫자일 경우 문자열로 변환
          placeholder="위치를 검색하세요"
          placeholderTextColor="#737373"
          // onFocus={handleFocus}
          // onBlur={handleBlur}
          style={styles.input}
        />
      </View>
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
    paddingVertical: 6,
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
    fontWeight: 400,
    lineHeight: 20,
    flex: 1,
    fontFamily: "Open Sans",
  },
});

export default SearchInput;
