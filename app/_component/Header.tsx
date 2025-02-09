import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useCallback, useState } from "react";
import SearchInput from "./SearchInput";
import { debounce } from "lodash";

function Header() {
  const [searchQuery, setSearchQuery] = useState(""); // 입력된 검색어

  return (
    <View style={styles.container}>
      <Pressable>
        <Image source={require("../../assets/images/header_logo.png")} />
      </Pressable>
      <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Image source={require("../../assets/images/notification.png")} />
    </View>
  );
}
const styles = StyleSheet.create({
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
    fontWeight:400,
    lineHeight: 20,
    flex: 1,
    fontFamily: "Open Sans",
  },
});
export default Header;
