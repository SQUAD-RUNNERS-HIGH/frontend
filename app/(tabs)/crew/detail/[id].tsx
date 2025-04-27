import Button from "@/app/_component/Button";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Image } from "react-native";

const CrewDetail = () => {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.crewTitleContainer}>
        <Image
          style={styles.crewImage}
          source={require("@/assets/images/camera.png")}
        />
        <View>
          <Text style={[styles.crewTitle, { fontSize: 20 }]}>러닝 메이트</Text>
          <Text style={styles.crewSecondary}>멤버 24명</Text>
        </View>
      </View>
      <View style={styles.crewDescriptionContainer}>
        <View style={styles.crewDescriptionTitle}>
          <Text style={styles.crewTitle}>크루 소개</Text>
          <Button
            style={{ paddingHorizontal: 12, paddingVertical: 5 }}
            onPress={() => {}}
            theme="secondary"
          >
            가입신청
          </Button>
        </View>
        <Text style={[styles.crewSecondary, { color: "#485563" }]}>
          함께 달리며 건강한 습관을 만들어가는 러닝 크루입니다. 초보자부터
          마라톤 완주자까지 다양한 멤버들이 함께하고 있습니다
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
              3위
            </Text>
          </View>
          <View style={styles.crewInfo}>
            <Text style={styles.crewSecondary}>크루 인원</Text>
            <Text
              style={[styles.crewTitle, { fontSize: 20, fontWeight: "bold" }]}
            >
              30 / 50
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.crewDescriptionContainer, { marginTop: 10 }]}>
        <Text style={styles.crewTitle}>크루원</Text>
        <View style={styles.crewInfoContainer}>
          <View style={styles.crewMember}>
            <Image style={styles.crewMemberImage} source={require('@/assets/images/logo.png')}/>
            <Text style={[styles.crewSecondary, { color: "#000000" }]}>김리더</Text>
          </View>
          <View style={styles.crewMember}>
            <Image style={styles.crewMemberImage} />
            <Text style={[styles.crewSecondary, { color: "#000000" }]}>김리더</Text>
          </View>
          <View style={styles.crewMember}>
            <Image style={styles.crewMemberImage} />
            <Text style={[styles.crewSecondary, { color: "#000000" }]}>김리더</Text>
          </View>
          <View style={styles.crewMember}>
            <View style={styles.moreCrewIcon}><Text style = {[styles.crewSecondary,{color:'#000000'}]}>+20</Text></View>
            <Text style={[styles.crewSecondary, { color: "#000000" }]}>더보기</Text>
          </View>
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
    gap:16,
    width: "100%",
    justifyContent: 'space-between'
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
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  crewMemberImage: {
    borderRadius: 999,
    width: 56,
    height: 56,
  },
  moreCrewIcon:{
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
export default CrewDetail;
