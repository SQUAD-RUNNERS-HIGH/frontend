import { View, StyleSheet, Text } from "react-native";
import { fetchMyCrew } from "../_lib/fetchMyCrew";
import { useQuery } from "@tanstack/react-query";

interface MyCrewType {
  crewName: string;
  numberOfParticipants: number;
}
function Mycrew({crewName, numberOfParticipants}: MyCrewType) {
  
  return (
    <View style = {styles.container}>
      <View style={styles.crewInfo}>
        <View style={styles.image}></View>
        <View>
          <Text style={styles.crewTitle}>{crewName}</Text>
          <Text style={styles.crewMember}>멤버 {numberOfParticipants}명</Text>
        </View>
      </View>
      <Text style={styles.role}>리더</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    opacity: 1,
    flexDirection: "row",
    padding: 16,
    fontFamily: "Roboto",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "100%",
    gap: 12,
  },
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