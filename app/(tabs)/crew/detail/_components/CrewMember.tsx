import { View, Text, StyleSheet, Image } from "react-native";
import { fetchCrewParticipants } from "../_lib/fetchCrewParticipants";
import { useQuery } from "@tanstack/react-query";
const crewImages = [
  require("@/assets/images/crewMember1.png"),
  require("@/assets/images/crewMember2.png"),
  require("@/assets/images/crewMember3.png"),
  // 필요한 만큼 추가
];

export const CrewMember = ({ id }: { id: string }) => {
  const { data: participants, isLoading: isParticipantsLoading } = useQuery({
    queryKey: ["crewParticipants", id],
    queryFn: () => fetchCrewParticipants(id),
    enabled: !!id,
    staleTime:0,
  });
  return (
    <View style={[styles.crewDescriptionContainer, { marginTop: 10 }]}>
      <Text style={styles.crewTitle}>크루원</Text>
      <View style={styles.crewInfoContainer}>
        {participants?.slice(0, 3)?.map((pariticipant, index) => (
          <View key={index} style={styles.crewMember}>
            <Image style={styles.crewMemberImage} source={crewImages[index]} />
            <Text style={[styles.crewSecondary, { color: "#000000" }]}>
              {pariticipant?.username}
            </Text>
          </View>
        ))}
        {participants?.length >= 4 && (
          <View style={styles.crewMember}>
            <View style={styles.moreCrewIcon}>
              <Text style={[styles.crewSecondary, { color: "#000000" }]}>
                +{participants.length - 3}
              </Text>
            </View>
            <Text style={[styles.crewSecondary, { color: "#000000" }]}>
              더보기
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
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
    gap: 16,
    width: "100%",
    justifyContent: "flex-start",
  },
  crewMember: {
    gap: 4,
    width: 74,
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
