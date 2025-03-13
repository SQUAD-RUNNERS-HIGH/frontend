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
import LocationInput from "./LocationInput";

function Header() {
  const [searchQuery, setSearchQuery] = useState(""); // 입력된 검색어
  const [results, setResults] = useState<string[]>([]); // 검색 결과 리스트
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const segments = useSegments();
  const [headerHeight, setHeaderHeight] = useState(0);

  const fetchPlaces = async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&language=ko&region=kr&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACE_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        const places = data.results.map(
          (place: any) => place.formatted_address
        );
        setResults(places);
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
      fetchPlaces(searchQuery);
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
      <View
        style={[styles.rootContainer, !show && styles.hide]}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setHeaderHeight(height);
        }}
      >
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
            setIsDropdownVisible={setIsDropdownVisible}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    width: "100%",
    position: "absolute",
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
