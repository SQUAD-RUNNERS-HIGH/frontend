import Button from "@/app/_component/Button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { fetchCrewRanking } from "../_lib/fetchCrewRanking";
import { useRouter } from "expo-router";

function CrewRaking() {
  const { data: crewRanking, } =
      useQuery({
        queryKey: ["crewRanking"],
        queryFn: fetchCrewRanking,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
      });
      const router = useRouter();
      return (
    <View style={styles.container}>
      {crewRanking?.data?.crewRankResponses.map((crew,index) => (
        <Pressable onPress = {() => {router.push(`/crew/detail/${crew.crewId}`);}} key={crew.crewId} style={styles.crewContainer}>
          <View style = {styles.crewLeftContainer}>
            <View style = {styles.rankingContainer}>
              <Text style = {styles.ranking}>{index+1}</Text>
            </View>
            <Image source = {{uri: crew.image}} style = {styles.profile} />
            <Text>{crew.crewName}</Text>
          </View>
          <Text style= {styles.crewRightContainer}>
            총 {crew.score}m
          </Text>
        </Pressable>
      ))}
      {crewRanking?.data?.crewRankResponses.length===0 && (<View
                style={styles.noCrewContainer}
              >
                <Text>크루가 없습니다.</Text>
              </View>)}
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
  },
  noCrewContainer:{
    width: "100%",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  }
});
export default CrewRaking;
