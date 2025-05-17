import { fetchCourseDetail } from "@/lib/map/fetchCourseDetail";
import { useQuery } from "@tanstack/react-query";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Button from "../../Button";
import Checkbox from "expo-checkbox";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/store/useCourseStore";
import { useStompStore } from "@/store/useStompStore";

export const PrepareCrew = ({ totalDistance }: { totalDistance: number }) => {
  const selectedCourse = useCourseStore(state => state.selectedCourse);
  const client = useStompStore(state => state.client);
  const { myLocation, stompLocation } = useLocationStore(
    useShallow((state) => ({
      myLocation: state.myLocation,
      stompLocation: state.stompLocation,
    }))
  );
  const { runningInfo, setIsRunning, setPreRunning } = useRunningStore(
    useShallow((state) => ({
      runningInfo: state.runningInfo,
      setIsRunning: state.setIsRunning,
      setPreRunning: state.setPreRunning,
    }))
  );
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseDetail", selectedCourse],
    queryFn: () => {
      return fetchCourseDetail(selectedCourse);
    },
    enabled: !!(
      selectedCourse &&
      selectedCourse !== "solo" &&
      runningInfo !== "solo"
    ), // selectedCourse가 있을 때만 실행,
    staleTime: 100000,
  });
  // const { connected, sendLocation } = useStomp();

  // useEffect(() => {
  //   if (client.current && myLocation && connected) {
  //     sendLocation(myLocation);
  //   }
  // }, [myLocation, connected]); // ✅

  return (
    <>
      <Text style={styles.modalTitle}>주변 크루원</Text>
      <View style={styles.crewContainer}>
        <View style = {styles.crew}>
          <Text>
            김서연{`[`}크루명{`]`}
          </Text>
          <View style={styles.checkBoxContainer}>
            <Text>준비</Text>
            <Checkbox style={styles.checkBox} />
          </View>
        </View>
        <View style = {styles.crew}>
          <Text>
            김서연{`[`}크루명{`]`}
          </Text>
          <View style={styles.checkBoxContainer}>
            <Text>준비</Text>
            <Checkbox style={styles.checkBox} />
          </View>
          
        </View>
        <View style = {styles.crew}>
          <Text>
            김서연{`[`}크루명{`]`}
          </Text>
          <View style={styles.checkBoxContainer}>
            <Text>준비</Text>
            <Checkbox style={styles.checkBox} />
          </View>
          
        </View>
        <View style = {styles.crew}>
          <Text>
            김서연{`[`}크루명{`]`}
          </Text>
          <View style={styles.checkBoxContainer}>
            <Text>준비</Text>
            <Checkbox style={styles.checkBox} />
          </View>
          
        </View>
      </View>
      <View style = {styles.buttonContainer}>
        <Text style = {styles.description}>함께할 크루원은 30m 이내로 가까이 모여주세요</Text>
        <Button onPress={() => {}} style = {styles.button}>준비하기</Button>
      </View>
      {/* {connected ? (
        <>
          {runningLocation?.runningStatus === "ONGOING" ? (
            <>
              <Text style={[styles.modalDepscription2, { fontWeight: 700 }]}>
                =러닝을 시작합니다.
              </Text>

              <Button
                style={{ marginTop: 6, width: "100%" }}
                onPress={() => {
                  setPreRunning(true);
                  setIsRunning(true);
                }}
              >
                러닝 시작!
              </Button>
            </>
          ) : (
            <Text style={styles.courseText}>
              현재 위치가 코스에서 떨어져있습니다.
            </Text>
          )}
        </>
      ) : (
        <Text>서버와 연결하는 중...</Text>
      )} */}
    </>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalPosition: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "white",
    zIndex: 20,
    maxHeight: 616,
    borderRadius: 12,
  },
  modalContainer: {
    padding: 24,
    paddingHorizontal: 40,
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    zIndex: 20,
    gap: 10,
  },
  modalTitle: {
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 28,
    color: "#000000",
    marginBottom: 24,
  },
  crewContainer: {
    gap: 12,
  },
  crew:{
    flexDirection:'row',
    gap:100,
    padding:12,
    backgroundColor:'#F9FAFB',
    borderRadius: 8,
    alignItems:'center'
  },
  crewName: {
    minWidth: 100,
  },
  checkBox: {
    padding: 0,
    width: 20,
    height: 20,
  },
  checkBoxContainer: {
    flexDirection:'row',
    gap:16
  }, 
  buttonContainer: {
    width: '100%',
    marginTop:42,
    gap:32,
    alignItems: 'center'
  },
  description: {
    color: '#4B5563'
  },
  button: {
    width: '100%',
  }
  
});
