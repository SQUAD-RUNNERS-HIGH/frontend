import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCrewApplyGrant } from "../../lib/crew/detail/fetchCrewApplyGrant";
import { Alert } from "react-native";
import { useAlertStore } from "@/store/useAlertStore";

export function useCrewApplyGrant() {
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((s) => s.showAlert);

  const mutation = useMutation({
    mutationFn: ({ id, applicantId }: { id: number; applicantId: number }) =>
      fetchCrewApplyGrant(id, applicantId),
    onSuccess: (_, variables) => {
      const { id } = variables;
      showAlert({title: '크루 요청 승인',description: "크루 요청을 승인했습니다!"});
      queryClient.invalidateQueries({ queryKey: ["crewDetail", id] });
      queryClient.invalidateQueries({ queryKey: ["crewParticipants", id] });
      queryClient.invalidateQueries({ queryKey: ["crewApplicant", id] });
    },
    onError: (error) => {
      console.error("Grant mutation failed:", error);
      // 에러는 fetchCrewApplyGrant 안에서도 처리하고 있으니 여기선 심플하게
    },
  });

  return mutation;
}
