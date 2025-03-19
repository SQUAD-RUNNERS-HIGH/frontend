import {
  Image,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import SearchDropdown from "./SearchDropdown";
import { useSegments } from "expo-router";
import { Place } from "../_types";
import { useLocation } from "../_hooks/useLocation";

function Header() {
  const [searchQuery, setSearchQuery] = useState(""); // 입력된 검색어
  const [results, setResults] = useState<Place[]>([]); // 검색 결과 리스트
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const segments = useSegments();
  const { isDropdownVisible, setIsDropdownVisible } = useLocation();
  const fetchPlaces = async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&language=ko&region=kr&key=${
      process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY
    }`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        setResults(data.results);
        setIsDropdownVisible(true);
      } else {
        setResults([]);
        setIsDropdownVisible(false);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      setResults([]);
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedQuery !== searchQuery) {
        fetchPlaces(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (
      segments.length !== 1 &&
      segments[segments.length - 1] !== "login" &&
      segments[segments.length - 1] !== "signup"
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [segments]);
  useEffect(() => {
    if (results.length > 0) {
      setIsDropdownVisible(true);
    }
  }, [results]);
  useEffect(() => {
    setSearchQuery(selectedQuery);
  }, [selectedQuery]);

  return (
    <TouchableWithoutFeedback>
      <View style={[styles.rootContainer, !show && styles.hide]}>
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
            results={results}
            setSelectedQuery={setSelectedQuery}
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
    zIndex: 100,
    top: 0,
  },
  hide: {
    display: "none",
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
