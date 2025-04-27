import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCrewApplyGrant } from "../_lib/fetchCrewApplyGrant "; // fetchCrewApplyGrant 경로 맞춰줘!
import { Alert } from "react-native";

export function useCrewApplyGrant() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, applicantId }: { id: string; applicantId: number }) =>
      fetchCrewApplyGrant(id, applicantId),
    onSuccess: (_, variables) => {
      const { id } = variables;
      Alert.alert('크루 요청이 승인되었습니다!')
      queryClient.invalidateQueries({ queryKey: ["crewDetail", id] });
      queryClient.invalidateQueries({ queryKey: ["crewParticipants", id] });
    },
    onError: (error) => {
      console.error("Grant mutation failed:", error);
      // 에러는 fetchCrewApplyGrant 안에서도 처리하고 있으니 여기선 심플하게
    },
  });

  return mutation;
}
