import React, { SetStateAction } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Pressable,
} from "react-native";

interface SearchInputProps {
  results: string[];
  setSelectedQuery: React.Dispatch<SetStateAction<string>>;
  setIsDropdownVisible: React.Dispatch<SetStateAction<boolean>>;
}
const SearchDropdown = ({ results, setSelectedQuery, setIsDropdownVisible }: SearchInputProps) => {
  return (
    <FlatList
      data={results}
      keyExtractor={(index) => index.toString()}
      renderItem={({ item,index }) => (
        <Pressable
          style={styles.resultItem}
          onPress={() => {
            setSelectedQuery(item);
            setIsDropdownVisible(false);
          }}
        >
          <View style={styles.resultIcon}></View>
            <Text style={styles.resultText}>{item}</Text>
       </Pressable>
      )}
      style={styles.dropdown}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    width: "100%",
    top: "100%",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    maxHeight: 200, // 드롭다운 최대 높이 설정
    paddingVertical: 4,
  },
  resultIcon: {
    width: 20,
    height: 20,
    borderRadius: "100%",
    backgroundColor: "#ACACAC",

  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical:12,
  },

  notFirst: {
    borderTopWidth: 1, // border-top: 1px
    borderTopColor: "#2D2D32", // border-top의 색상
  
  },
  resultText: {
    fontSize: 16,
    color: "#000000",
    fontFamily:'Open Sans',
    fontWeight: 600,
    verticalAlign:'middle'
  },
});

export default SearchDropdown;
