import React, { SetStateAction, useEffect } from "react";
import { Text, StyleSheet, FlatList, View, Pressable } from "react-native";
import { Place } from "../_types";
import { useLocation } from "../_hooks/useLocation";

interface SearchInputProps {
  results: Place[];
  setSelectedQuery: React.Dispatch<SetStateAction<string>>;
  setIsDropdownVisible: React.Dispatch<SetStateAction<boolean>>;
}
const SearchDropdown = ({
  results,
  setSelectedQuery,
  setIsDropdownVisible,
}: SearchInputProps) => {
  const {searchedLocation,setSearchedLocation} = useLocation();
  useEffect(() => {
    setIsDropdownVisible(false);
  }, [searchedLocation]);
  return (
    <FlatList
      data={results}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}: {item: Place}) => {
        return (
          <Pressable
            style={styles.resultItem}
            onPress={() => {
              const latitudeDelta = item.geometry.viewport.northeast.lat - item.geometry.viewport.southwest.lat;
              const longitudeDelta = item.geometry.viewport.northeast.lng - item.geometry.viewport.southwest.lng;
              const location = {latitude: item.geometry.location.lat,longitude: item.geometry.location.lng,latitudeDelta,longitudeDelta};
              setSelectedQuery(item.formatted_address);
              setSearchedLocation(location);
            }}
          >
            <View style={styles.resultIcon}></View>
            <Text style={styles.resultText}>{item.formatted_address}</Text>
          </Pressable>
        );
      }}
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
    paddingVertical: 12,
  },

  notFirst: {
    borderTopWidth: 1, // border-top: 1px
    borderTopColor: "#2D2D32", // border-top의 색상
  },
  resultText: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "Open Sans",
    fontWeight: 600,
    verticalAlign: "middle",
  },
});

export default SearchDropdown;
