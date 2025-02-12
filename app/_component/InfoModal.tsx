import { StyleSheet, View, Text } from "react-native";
import Button from "./Button";
import { SetStateAction } from "react";
import Modal from "react-native-modal";

export function InfoModal({
  selectedCourse,
  setSelectedCourse,
}: {
  selectedCourse: number;
  setSelectedCourse: React.Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
    {
      (selectedCourse !== -1) && (
      <View style={styles.rootContainer}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Text style={styles.info}>고도</Text>
            <View style={styles.background}></View>
          </View>
          <View style={styles.textContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.info}>코스 이름</Text>
              <Text style={styles.value}>경복궁 둘레</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.info}>예상 소모 칼로리</Text>
              <Text style={styles.value}>354Kcal</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.info}>거리</Text>
              <Text style={styles.value}>2.13 km</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button style={{ flex: 1 }} onPress={() => {}}>
            같이 뛰기
          </Button>
          <Button style={{ flex: 1 }} onPress={() => {}}>
            코스 자세히
          </Button>
          <Button style={{ flex: 1 }} onPress={() => {}}>
            혼자 뛰기
          </Button>
        </View>
      </View>
      )
    }
    </>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    gap: 16,
    width: "100%",
    position: "absolute",
    bottom: 0,
    maxHeight: 250,
    zIndex:3,
    borderRadius: '12px 12px 0px 0px',
  },
  container: {
    flexDirection: "row",
    gap: 20,
  },
  imageContainer: {
    flex: 1,
    gap: 12,
  },
  info: {
    color: "#6B7280",
  },
  value: {
    color: "#000000",
    fontWeight: 600,
  },
  background: {
    width: "100%",
    flex: 1,
    backgroundColor: "#D8D8D8",
  },
  textContainer: {
    flex: 1,
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 28,
  },
});
