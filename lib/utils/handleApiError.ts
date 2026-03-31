import { useAlertStore } from "@/store/useAlertStore";

export function handleApiError(
  error: unknown,
  title = "문제가 발생했어요",
  description = "잠시 후 다시 시도해주세요."
) {
  const err = error as { response?: { data?: { serverErrorMessage?: string } } };
  const message = err?.response?.data?.serverErrorMessage ?? description;
  useAlertStore.getState().showError({ title, description: message });
}
