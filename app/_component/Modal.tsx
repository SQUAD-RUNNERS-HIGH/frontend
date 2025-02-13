import { StyleSheet, View, Text } from "react-native";
import Button from "./Button";
import { SetStateAction } from "react";
import { InfoModal } from "./Modal/InfoModal";
import { SelectedModal } from "./Modal/SelectedModal";

export function Modal({
  selectedCourse,
  setSelectedCourse,
}: {
  selectedCourse: number;
  setSelectedCourse: React.Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
      {selectedCourse !== -1 && (
        <View style={styles.rootContainer}>
          {/* <InfoModal /> */}
          <SelectedModal />
        </View>
      )}
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
    zIndex: 3,
    position: "absolute",
    bottom: 0,
    borderRadius: "12px 12px 0px 0px",
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
