import { Text, StyleSheet, View } from "react-native";
import Button from "../../Button";
import { useLocation } from "@/app/_hooks/useLocation";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/store/useCourseStore";
const PrepareSolo = () => {
  const { selectedCourse, setSelectedCourse } = useCourseStore(
    useShallow((state) => ({
      selectedCourse: state.selectedCourse,
      setSelectedCourse: state.setSelectedCourse,
    }))
  );  const { setPreRunning, setIsRunning, setRunningInfo } = useRunningStore(
    useShallow((state) => ({
      setPreRunning: state.setPreRunning,
      setIsRunning: state.setIsRunning,
      setRunningInfo: state.setRunningInfo,
    }))
  );  return (
    <>
      <Text style={styles.modalDepscription2}>
        현재 위치를 기준으로 러닝을 시작합니다.
      </Text>
      <Text style={styles.modalDepscription}>러닝을 시작하시겠어요?</Text>
      <View style = {styles.buttonContainer}>
      <Button
        onPress={() => {
          setPreRunning(true);
          setIsRunning(true);
        }}
        style = {styles.button}
      >
        러닝 시작!
      </Button>
      <Button
        onPress={() => {
          setRunningInfo('');
          if(selectedCourse === 'solo'){
            setSelectedCourse('');
          }
        }}
        style = {styles.button}
      >
        취소
      </Button>
      </View>
    </>
  );
};
export default PrepareSolo;
const styles = StyleSheet.create({
  modalDepscription: {
    fontWeight: 500,
    fontSize: 20,
    lineHeight: 28,
    color: "#000000",
  },
  modalDepscription2: {
    fontWeight: 300,
    fontSize: 16,
    lineHeight: 28,
    color: "#000000",
  },
  buttonContainer: {
    width:'100%',
    gap:12,
    paddingHorizontal:48,
    marginTop:24
  },
  button: {
    flex:1,
  }
});
