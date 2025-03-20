import Button from "@/app/_component/Button";
import { View, StyleSheet, Text } from "react-native";

function Crew({
  id,
  name,
  description,
  userCount,
}: {
  id: number;
  name: string;
  description: string;
  userCount: number;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.crewInfo}>
          <View>
            <Text style={styles.crewTitle}>{name}</Text>
            <Text style={styles.crewMember}>멤버 {userCount}명</Text>
          </View>
        </View>
        <Button
          onPress={() => {}}
          theme="secondary"
          style={{
            paddingVertical: 5,
            paddingHorizontal: 12,
            backgroundColor: "white",
          }}
        >
          가입신청
        </Button>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    opacity: 1,
    flexDirection: "column",
    padding: 16,
    fontFamily: "Roboto",
    flexWrap: "wrap",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "100%",
    gap: 12,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
  description: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20,
    letterSpacing: 0,
  },
});
export default Crew;
