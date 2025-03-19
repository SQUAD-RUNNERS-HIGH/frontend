import { View, StyleSheet, Text } from "react-native";

function Mycrew() {
  return (
    <>
      <View style={styles.crewInfo}>
        <View style={styles.image}></View>
        <View>
          <Text style={styles.crewTitle}>러닝 메이트</Text>
          <Text style={styles.crewMember}>멤버 24명</Text>
        </View>
      </View>
      <Text style={styles.role}>리더</Text>
    </>
  );
}
const styles = StyleSheet.create({
  crewInfo: {
    gap: 12,
    flexDirection: "row",
  },
  crewTitle: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 21,
  },
  crewMember: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20,
    color: "#6B7280",
  },
  image: {
    width: 40,
    height: 40,
    backgroundColor: "blue",
    borderRadius: "100%",
  },
  role: {
    color: "#6500A8",
  },
});
export default Mycrew;