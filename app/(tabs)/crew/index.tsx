import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MyCrew from "./_component/MyCrew";
import Button from "@/app/_component/Button";

export function CrewHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>크루</Text>
      <View style={styles.innerContainer}>
        <View style={styles.innerTitleContainer}>
          <Text style={styles.innerTitle}>내 크루</Text>
          <Button
            fontSize={14}
            style={{ paddingHorizontal: 14, paddingVertical: 8 }}
            onPress={() => {}}
          >
            크루 만들기
          </Button>
        </View>
        <View style={styles.innerContentContainer}>
          <MyCrew />
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    padding: 16,
    gap: 32,
  },
  innerTitleContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  innerTitle: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 28,
    letterSpacing: 0,
  },
  title: {
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
    letterSpacing: 0,
    color: "#000000",
    marginBottom: -16,
  },
  innerContainer: {
    display: "flex", // React Native에서는 기본적으로 flex 사용
    flexDirection: "column",
    padding: 16,
    flexWrap: "wrap",
    alignContent: "flex-start",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    gap: 16,
    shadowRadius: 2,
    elevation: 1, // Android 그림자 효과
    borderRadius: 12,
  },
  innerContentContainer: {
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
});
export default CrewHome;
