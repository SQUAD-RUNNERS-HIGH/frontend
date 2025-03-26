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
import { usePlacesSearch } from "../_hooks/usePlacesSearch";

function Header() {
  const {
    searchQuery,
    selectedQuery,
    setSearchQuery,
    setSelectedQuery,
    fetchPlaces,
    results,
    isDropdownVisible,
    setIsDropdownVisible,
  } = usePlacesSearch();
  const [show, setShow] = useState<boolean>(false);
  const segments = useSegments();
  const [type, setType] = useState<"crew" | "map" | "chat">("map");
  useEffect(() => {
    const timer = setTimeout(() => {
      if (segments.includes("map") && selectedQuery !== searchQuery) {
        fetchPlaces(searchQuery);
      }
      if (segments.includes("crew") && selectedQuery !== searchQuery) {
        // 크루검색
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
      setIsDropdownVisible(false);
      setSearchQuery("");
      setSelectedQuery("");
      if (segments.includes("crew")) {
        setType("crew");
      } else if (segments.includes("chat")) {
        setType("chat");
      } else {
        setType("map");
      }
    } else {
      setShow(false);
      setIsDropdownVisible(false);
    }
  }, [segments]);

  return (
    <TouchableWithoutFeedback>
      <View style={[styles.rootContainer, !show && styles.hide]}>
        <View style={styles.container}>
          <Pressable>
            <Image source={require("../../assets/images/header_logo.png")} />
          </Pressable>
          <SearchInput
            type={type}
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
