import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Button from "../Button";
import { SetStateAction, useEffect, useState } from "react";
import { CourseDetail } from "@/app/_types";
import { fetchCourseDetail } from "@/app/(tabs)/map/_lib/fetchCourseDetail";

export function InfoModal({
  setTheme,
  selectedId,
}: {
  setTheme: React.Dispatch<SetStateAction<string>>;
  selectedId: string;
}) {
  const [detail, setDetail] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  async function updateDetail() {
    setLoading(true);
    const detail = await fetchCourseDetail(selectedId);
    setDetail(detail);
    setLoading(false);
  }
  useEffect(() => {
    if (selectedId !== "") {
      updateDetail();
    }
  }, [selectedId]);
  return (
    <>
      {loading ? (
        <View style = {styles.spinnerContainer}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Text style={styles.info}>고도</Text>
              <View style={styles.background}>
                <Text>{detail?.courseElevations[0].elevation}</Text>
              </View>
            </View>
            <View style={styles.textContainer}>
              <View style={styles.infoContainer}>
                <Text style={styles.info}>코스 이름</Text>
                <Text style={styles.value}>{detail?.courseName}</Text>
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
            <Button
              style={{ flex: 1 }}
              onPress={() => {
                setTheme("select");
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
    width: '100%',
    height:222,
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
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
    marginTop: 12,
  },
});
