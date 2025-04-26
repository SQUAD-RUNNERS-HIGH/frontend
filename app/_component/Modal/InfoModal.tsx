import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Button from "../Button";
import { SetStateAction, useEffect, useState } from "react";
import { CourseDetail } from "@/app/_types";
import { fetchCourseDetail } from "@/app/(tabs)/map/_lib/fetchCourseDetail";
import { LineChart } from "react-native-chart-kit";
import { useLocation } from "@/app/_hooks/useLocation";
import { useQuery } from "@tanstack/react-query";

export function InfoModal({
  setTheme,
}: {
  setTheme: React.Dispatch<SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(true);
  const [parentStyle, setParentStyle] = useState({ width: 0, height: 0 });
  const {selectedCourse, setRunningInfo, setIsRunning} = useLocation();
  const { data: detail, isLoading, error } = useQuery({
    queryKey: ["courseDetail", selectedCourse],
    queryFn: () => fetchCourseDetail(selectedCourse),
    enabled: !!selectedCourse, // selectedCourse가 있을 때만 실행,
    staleTime: 100000,
  });
  return (
    <>
      {isLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Text style={styles.info}>고도</Text>
              <View
                style={styles.background}
                onLayout={(event) => {
                  const { width, height } = event.nativeEvent.layout;
                  setParentStyle({ width, height }); // 부모 View 크기 저장
                }}
              >
                {detail?.courseElevations && (
                  <LineChart
                    data={{
                      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                      datasets: [
                        {
                          data: detail?.courseElevations.map((elevation) => {
                            return elevation.elevation;
                          }),
                        },
                      ],
                    }}
                    width={parentStyle.width+10} // 전체 너비
                    
                    height={Math.floor(parentStyle.height)} // 높이
                    chartConfig={{
                      backgroundColor: "#4169E1",
                      backgroundGradientFrom: "#8A2BE2",
                      backgroundGradientTo: "#4169E1",
                      
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(255, 255, 255, ${opacity})`,
                      strokeWidth:2,
                    }}
                    bezier // 부드러운 곡선
                    style={{
                      marginLeft: -10,
                      marginRight: 0,
                      borderRadius: 16,
                      width: "100%",
                      minHeight: "100%",
                    }}
                  />
                )}
              </View>
            </View>
            <View style={styles.textContainer}>
              <View style={styles.infoContainer}>
                <Text style={styles.info}>코스 이름</Text>
                <Text style={styles.value}>{(detail?.courseName)? detail?.courseName: 'Untitled'}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.info}>예상 소모 칼로리</Text>
                <Text style={styles.value}>
                  {detail?.minCalorie.toFixed(2)} ~{" "}
                  {detail?.maxCalorie.toFixed(2)} Kcal
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.info}>거리</Text>
                <Text style={styles.value}>
                  {detail?.perimeter.toFixed(2)} km
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button style={{ flex: 1 }} onPress={() => {}}>
              같이 뛰기
            </Button>
            <Button style={{ flex: 1 }} onPress={() => {
                setTheme("select");
              }}>
              경쟁자와 뛰기
            </Button>
            <Button
              style={{ flex: 1 }}
              onPress={() => {
                setRunningInfo('solo');
              }}
            >
              혼자 뛰기
            </Button>
          </View>
        </>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    width: "100%",
    gap: 16,
  },
  spinnerContainer: {
    width: "100%",
    height: 222,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    overflow:'hidden',
    borderRadius:16,
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
    marginTop: 12,
  },
});
