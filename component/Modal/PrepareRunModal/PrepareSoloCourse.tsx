import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/store/useCourseStore";
import Button from "@/component/Button";
import { useState } from "react";
const PrepareSoloCourse = () => {
  const { setRunningStatus, targetPace, setTargetPace } = useRunningStore(
    useShallow((state) => ({
      targetPace: state.targetPace,
      setRunningStatus: state.setRunningStatus,
      setTargetPace: state.setTargetPace
    }))
  );
  const [avaragePace, setAveragePace] = useState("5'30\"");
  const handlePreset = (preset: string) => {
    setTargetPace(preset);
  };
  return (
    <>
      <Text style={styles.title}>목표 페이스 설정</Text>
      <Text style={styles.subtitle}>경쟁자 평균 페이스: {avaragePace}/km</Text>

      <View style={styles.buttonRow}>
        {["5'00\"", "5'30\"", "6'00\""].map((preset, idx) => (
          <Button
            style={[styles.presetButton]}
            theme={`${targetPace === preset ? "default" : "secondary"}`}
            onPress={() => handlePreset(preset)}
          >
            {preset}
          </Button>
        ))}
      </View>

      <TextInput
        style={styles.input}
        value={targetPace}
        onChangeText={setTargetPace}
        keyboardType="default"
        placeholder="페이스 입력"
      />

      <Button style={styles.runButton} onPress={() => {setRunningStatus('countdown')}}>
        러닝 시작하기
      </Button>
    </>
  );
};
export default PrepareSoloCourse;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  presetButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  presetButtonActive: {
    backgroundColor: "#6200EE",
  },
  presetButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  presetButtonTextActive: {
    color: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  runButton: {
    width: "100%",
    backgroundColor: "#6200EE",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  runButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
