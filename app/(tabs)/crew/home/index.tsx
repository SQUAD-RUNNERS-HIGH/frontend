import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import MyCrew from "../../../../component/crew/home/MyCrew";
import Button from "@/component/Button";
import SurroundCrews from "../../../../component/crew/home/SurroundCrews";
import CrewRaking from "../../../../component/crew/home/CrewRanking";
import { CreateCrewModal } from "../../../../component/crew/home/CreateCrewModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyCrew } from "../../../../lib/crew/home/fetchMyCrew";

export function CrewHome() {
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: myCrewResponse,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["myCrew"],
    queryFn: fetchMyCrew,
  });
  // 렌더링 될 때마다 함수 생성 방지(최적화)
  const onRefresh = useCallback(async () => {
  try {
    setRefreshing(true);

    // 각각의 쿼리 refetch
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ['surroundCrews']}),
      queryClient.refetchQueries({ queryKey: ['crewRanking']}),
      queryClient.refetchQueries({ queryKey: ['myCrew'] }),
    ]);
  } finally {
    setRefreshing(false);
  }
}, []);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>크루</Text>
        <View style={styles.innerContainer}>
          <View style={styles.innerTitleContainer}>
            <Text style={styles.innerTitle}>내 크루</Text>
            <Button
              fontSize={14}
              style={{ paddingHorizontal: 14, paddingVertical: 8 }}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              크루 만들기
            </Button>
          </View>
          {myCrewResponse?.myCrews?.map((crew) => (
            <MyCrew
              key={crew?.crewId}
              id={crew?.crewId}
              crewName={crew?.crewName}
              numberOfParticipants={crew?.numberOfParticipants}
              crewRole={crew?.crewUserRole ? crew.crewUserRole : "LEADER"}
            />
          ))}
          {
            myCrewResponse?.myCrews?.length === 0 && (
              <View style = {styles.noCrews}>
              <Text>아직 내 크루가 없습니다!</Text>
              </View>
            )
          }
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.innerTitleContainer}>
            <Text style={styles.innerTitle}>주변 크루</Text>
          </View>
          <SurroundCrews />
        </View>
        <View style={styles.innerContainer}>
          <View style={[styles.innerTitleContainer, { flexDirection: "row" }]}>
            <Text style={styles.innerTitle}>크루 랭킹</Text>
            {/* <Button
              theme="secondary"
              style={{ paddingVertical: 5, paddingHorizontal: 12 }}
              onPress={() => {}}
            >
              랭킹 전체보기
            </Button> */}
          </View>
          <CrewRaking />
        </View>
      </View>
      <CreateCrewModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </ScrollView>
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
    color: "#000000",
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
    flexDirection: "column",
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
  noCrews: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  }
});
export default CrewHome;
