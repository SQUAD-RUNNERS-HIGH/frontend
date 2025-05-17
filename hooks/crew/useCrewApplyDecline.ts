import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCrewApplyDecline } from "../../lib/crew/detail/fetchCrewApplyDecline"; // 경로 맞춰줘!

export function useCrewApplyDecline() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, applicantId }: { id: number; applicantId: number }) =>
      fetchCrewApplyDecline(id, applicantId),
    onSuccess: (_, variables) => {
      const { id } = variables;

      queryClient.invalidateQueries({ queryKey: ["crewDetail", id] });
      queryClient.invalidateQueries({ queryKey: ["crewParticipants", id] });
      queryClient.invalidateQueries({ queryKey: ["crewApplicant", id] });
    },
    onError: (error) => {
      console.error("Decline mutation failed:", error);
      // 에러는 내부 Alert로 처리 중이니 여기선 심플하게
    },
  });

  return mutation;
}
