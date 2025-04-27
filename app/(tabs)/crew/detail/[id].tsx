import Button from "@/app/_component/Button";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { fetchCrewDetail } from "./_lib/fetchCrewDetail";
import { useQuery } from "@tanstack/react-query";

import { fetchCrewApply } from "./_lib/fetchCrewApply";
import { CrewMember } from "./_components/CrewMember";

const CrewDetail = () => {
  const { id } = useLocalSearchParams();
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["crewDetail", id],
    queryFn: () => fetchCrewDetail(id),
    enabled: !!id,
    staleTime: 100000,
  });

  return (
    <View style={styles.container}>
      <View style={styles.crewTitleContainer}>
        <Image
          style={styles.crewImage}
          source={require("@/assets/images/camera.png")}
        />
        <View>
          <Text style={[styles.crewTitle, { fontSize: 20 }]}>
            {detail?.name}
          </Text>
          <Text style={styles.crewSecondary}>멤버 {detail?.userCount}명</Text>
        </View>
      </View>
      <View style={styles.crewDescriptionContainer}>
        <View style={styles.crewDescriptionTitle}>
          <Text style={styles.crewTitle}>크루 소개</Text>
          <Button
            style={{ paddingHorizontal: 12, paddingVertical: 5 }}
            onPress={async () => {
              const confirmApply = () => {
                return new Promise((resolve) => {
                  Alert.alert(
                    "크루 지원", // 제목
                    `${detail?.name} 크루에 지원하시겠습니까?`, // 메시지
                    [
                      {
                        text: "아니요",
                        style: "cancel",
                        onPress: () => resolve(false),
                      }, // 취소 버튼
                      { text: "예", onPress: () => resolve(true) }, // 종료 버튼
                    ]
                  );
                });
              };
              const permit = await confirmApply();
              if(permit) {
              fetchCrewApply(id);
              }
            }}
            theme="secondary"
          >
            가입신청
          </Button>
        </View>
        <Text style={[styles.crewSecondary, { color: "#485563" }]}>
          {detail?.description}
        </Text>
      </View>
      <View style={styles.crewDescriptionContainer}>
        <Text style={styles.crewTitle}>활동 정보</Text>
        <View style={styles.crewInfoContainer}>
          <View style={styles.crewInfo}>
            <Text style={styles.crewSecondary}>이번 달 거리</Text>
            <Text
              style={[styles.crewTitle, { fontSize: 20, fontWeight: "bold" }]}
            >
              767km
            </Text>
          </View>
          <View style={styles.crewInfo}>
            <Text style={styles.crewSecondary}>크루 랭킹</Text>
            <Text
              style={[styles.crewTitle, { fontSize: 20, fontWeight: "bold" }]}
            >
              {detail?.crewRank}위
            </Text>
          </View>
          <View style={styles.crewInfo}>
            <Text style={styles.crewSecondary}>크루 인원</Text>
            <Text
              style={[styles.crewTitle, { fontSize: 20, fontWeight: "bold" }]}
            >
              {detail?.userCount} / {detail?.maxCapacity}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.crewDescriptionContainer, { marginTop: 10 }]}>
        <View style={styles.crewInfoContainer}>
          <CrewMember id = {id}/>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff",
    height: "100%",
    gap: 24,
  },
  crewImage: {
    width: 80,
    height: 80,
    borderRadius: 999,
    objectFit: "contain",
  },
  crewTitleContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  crewTitle: {
    fontWeight: 600,
    fontSize: 18,
    lineHeight: 28,
  },
  crewSecondary: {
    fontWeight: "normal",
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
  },
  crewDescriptionContainer: {
    gap: 15,
    width: "100%",
  },
  crewDescriptionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  crewInfoContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    justifyContent: "space-between",
  },
  crewInfo: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 4,
    borderRadius: 8,
  },
  crewMember: {
    gap: 4,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  crewMemberImage: {
    borderRadius: 999,
    width: 56,
    height: 56,
  },
  moreCrewIcon: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default CrewDetail;
