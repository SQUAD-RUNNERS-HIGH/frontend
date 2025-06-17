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
import { useEffect, useState } from "react";
import Input from "@/component/Input";
import { useStomp } from "@/hooks/running/useStomp";
import useInterval from "@/hooks/running/useInterval";
import { useLocationStore } from "@/store/useLocationStore";
const PrepareSoloCourse = () => {
  const { setRunningStatus, targetPace, setTargetPace } = useRunningStore(
    useShallow((state) => ({
      targetPace: state.targetPace,
      setRunningStatus: state.setRunningStatus,
      setTargetPace: state.setTargetPace,

    }))
  );
  const myLocation = useLocationStore(state => state.myLocation);
    const stompLocation = useLocationStore(state => state.stompLocation);
  const [avaragePace, setAveragePace] = useState("5'30\"");
  const [minute, setMinute] = useState("0");
  const [second, setSecond] = useState("0");
  const { sendLocation } = useStomp();

  const handlePreset = (preset: string) => {
    setTargetPace(preset);
    const [min, sec] = preset.split(/['"]/).map(String);
    setMinute(min);
    setSecond(sec);
  };
 useInterval(
    () => {
      sendLocation(myLocation);
    },
    myLocation ? 1000 : null
  );
  const handleSecondChange = (text: string) => {
  // 숫자만 필터링
  const onlyNumbers = text.replace(/[^0-9]/g, '');

  if (onlyNumbers.length > 2) return;

  setSecond(onlyNumbers);

  if (onlyNumbers.length === 2) {
    const num = parseInt(onlyNumbers, 10);
    if (num > 59) {
      setSecond('59'); // 자동으로 59로 고정
    }
  }
};

  useEffect(() => {
    setTargetPace(`${minute}'${second}"`);
  }, [minute, second]);
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
            key={idx}
          >
            {preset}
          </Button>
        ))}
      </View>

      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <TextInput
          style={[styles.input, { width: 50, textAlign: "center" }]}
          value={minute}
          onChangeText={setMinute}
          keyboardType="numeric"
          maxLength={2}
          placeholder="분"
        />
        <Text style={{ marginHorizontal: 4 }}>'</Text>
        <TextInput
          style={[styles.input, { width: 50, textAlign: "center" }]}
          value={second}
          onChangeText={handleSecondChange}
          keyboardType="numeric"
          maxLength={2}
          placeholder="초"
        />
        <Text style={{ marginLeft: 4 }}>''</Text>
      </View>
        {stompLocation?.runningStatus === 'ONGOING' ?
      (<Button
        style={styles.runButton}
        onPress={() => {
          setRunningStatus("countdown");
        }}
      >
        러닝 시작하기
      </Button>): (<Text style = {{color:'red', marginBottom:4, fontSize: 18}}>코스에서 벗어났습니다</Text>)}
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
    paddingHorizontal: 12,
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
