import { View, Text, StyleSheet, Image } from "react-native";
import { fetchCrewParticipants } from "../_lib/fetchCrewParticipants";

const CrewMember = ({id}: {id: string}) => {
   const { data: participants, isLoading:isParticipantsLoading, erro } = useQuery({
        queryKey: ["crewParticipants", id],
        queryFn: () => fetchCrewParticipants(id),
        enabled: !!id,
        staleTime: 100000,
      });
  return (
    <View style={[styles.crewDescriptionContainer, { marginTop: 10 }]}>
            <Text style={styles.crewTitle}>크루원</Text>
            <View style={styles.crewInfoContainer}>
              {/* {
                participants?.
              } */}
              <View style={styles.crewMember}>
                <View style={styles.moreCrewIcon}><Text style = {[styles.crewSecondary,{color:'#000000'}]}>+20</Text></View>
                <Text style={[styles.crewSecondary, { color: "#000000" }]}>더보기</Text>
              </View>
            </View>
          </View>
  )
}
const styles = StyleSheet.create({
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
  crewInfoContainer: {
    flexDirection: "row",
    gap:16,
    width: "100%",
    justifyContent: 'flex-start'
  },
  crewMember: {
    gap: 4,
    width: 74,
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