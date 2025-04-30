import Button from "@/app/_component/Button";
import { useQuery } from "@tanstack/react-query";
import React, { SetStateAction } from "react";
import { Modal, Pressable, View, StyleSheet, Text, Image } from "react-native";
import { fetchCrewApplicants } from "../_lib/fetchCrewApplicants";
import { useCrewApplyGrant } from "../_hooks/useCrewApplyGrant";
import { useCrewApplyDecline } from "../_hooks/useCrewApplyDecline";

export const CrewApplyModal = ({
  id,
  applyModal,
  setApplyModal,
}: {
  id: string;
  applyModal: boolean;
  setApplyModal: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { data } = useQuery({
    queryKey: ["crewApplicant", id],
    queryFn: () => fetchCrewApplicants(id),
    staleTime:0,
  });
  const { mutate: grantCrewApply } = useCrewApplyGrant();
  const { mutate: declineCrewApply } = useCrewApplyDecline();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={applyModal}
      onRequestClose={() => {
        setApplyModal(false);
      }}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => {
          setApplyModal(false);
        }}
      ></Pressable>
      <View style={styles.modalPosition}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>크루 가입 신청</Text>
          <View style={styles.crewContainer}>
            {data?.applicantResponse.map((applicant) => {
              console.log(applicant);
              return (
              <View style={styles.crew} key={applicant.id}>
                <View style={styles.crewInfo}>
                  <Image
                    style={styles.crewImage}
                    source={require("@/assets/images/crewMember1.png")}
                  />
                  <View>
                    <Text>{applicant?.username}</Text>
                    <Text>{applicant?.applicationDate}</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    onPress={() => {
                      grantCrewApply({ id: Number(id), applicantId: Number(applicant?.id) });
                    }}
                    style={{ paddingHorizontal: 11 }}
                  >
                    승인
                  </Button>
                  <Button
                    onPress={() => {
                      declineCrewApply({  id: Number(id), applicantId: Number(applicant?.id) });
                    }}
                    style={{ paddingHorizontal: 11 }}
                    theme="secondary"
                  >
                    거절
                  </Button>
                </View>
              </View>
            )})}
            {
              data?.applicantResponse.length===0 && (
                <View style = {{paddingHorizontal:24}}>
                <Text>크루에 지원한 사람이 없습니다!</Text>
                </View>
              )
            }
          </View>
        </View>
      </View>
    </Modal>
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
    padding: 16,
    paddingHorizontal: 16,
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
  modalDepscription: {
    fontWeight: 500,
    fontSize: 20,
    lineHeight: 28,
    color: "#000000",
  },
  modalDepscription2: {
    fontWeight: 300,
    fontSize: 16,
    lineHeight: 28,
    color: "#000000",
  },
  crewContainer: {
    gap: 24,
    marginBottom: 24,
  },
  crew: {
    flexDirection: "row",
    gap: 40,
  },
  crewImage: {
    width: 40,
    height: 40,
  },
  crewInfo: {
    gap: 12,
    flexDirection: "row",
  },
  buttonContainer: {
    gap: 8,
    flexDirection: "row",
  },
});
