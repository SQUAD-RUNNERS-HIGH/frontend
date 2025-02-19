import {
  Image,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import { debounce } from "lodash";
import SearchDropdown from "./SearchDropdown";
import { useSegments } from "expo-router";

function Header() {
  const [searchQuery, setSearchQuery] = useState(""); // 입력된 검색어
  const [results, setResults] = useState<string[]>([]); // 검색 결과 리스트
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const segments = useSegments();

  const sampleData = [
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Grape",
    "Mango",
    "Orange",
    "Peach",
  ];
  useEffect(() => {
    if (
      segments.length !== 1 &&
      segments[segments.length - 1] !== "login" &&
      segments[segments.length - 1] !== "signup"
    ) {
      setShow(true);
    }
  }, []);
  useEffect(() => {
    if (results.length > 0) {
      setIsDropdownVisible(true);
    }
  }, [results]);
  useEffect(() => {
    setSearchQuery(selectedQuery);
  }, [selectedQuery]);
  const handleSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        const filtered = sampleData.filter((item) =>
          item.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
    }, 300),
    []
  );
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  return (
    <TouchableWithoutFeedback>
      <View style={[styles.rootContainer,!show && styles.hide]}>
        <View style={styles.container}>
          <Pressable>
            <Image source={require("../../assets/images/header_logo.png")} />
          </Pressable>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Image source={require("../../assets/images/notification.png")} />
        </View>
        {isDropdownVisible && (
          <SearchDropdown
            setSelectedQuery={setSelectedQuery}
            setIsDropdownVisible={setIsDropdownVisible}
            results={results}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    width: "100%",
    position: "sticky",
    top: 0,
  },
  hide: {
    display: 'none',
  },
  container: {
    paddingVertical: 10,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 16,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    width: "100%",
  },
});
export default Header;
