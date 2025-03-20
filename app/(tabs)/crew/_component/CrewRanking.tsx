import Button from "@/app/_component/Button";
import { View, StyleSheet, Text } from "react-native";

function CrewRaking() {
  const crewRanking = [
    {
      id: 1,
      rank: 1,
      name: "마라톤 마스터즈",
      km: 1234,
    },
    {
      id: 2,
      name: "런데이 러너스",
      km: 1156,
      rank: 2,
    },
    {
      id: 3,
      name: "러닝 메이트",
      km: 987,
      rank: 3,
    },
  ];
  return (
    <View style={styles.container}>
      {crewRanking.map((crew) => (
        <View key={crew.id} style={styles.crewContainer}>
          <View style = {styles.crewLeftContainer}>
            <View style = {styles.rankingContainer}>
              <Text style = {styles.ranking}>{crew.rank}</Text>
            </View>
            <View style = {styles.profile}></View>
            <Text>{crew.name}</Text>
          </View>
          <Text style= {styles.crewRightContainer}>
            총 {crew.km}km
          </Text>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: "100%",
  },
  crewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: 'Roboto',
    alignItems: 'center',
  },
  crewLeftContainer: {
    gap:12,
    flexDirection:'row',
    alignItems: 'center',
  },
  crewRightContainer: {
    fontFamily: 'Roboto',  // Android 기본 지원, iOS는 추가 설정 필요
    fontSize: 14,
    fontWeight: 'normal', // '400'도 가능
    lineHeight: 20,
    color: '#6B7280',
  },
  rankingContainer: {
    width:24,
    height:21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ranking: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 21
  },
  profile: {
    width:32,
    height:32,
    borderRadius:999,
    backgroundColor: 'blue',
  }
});
export default CrewRaking;
