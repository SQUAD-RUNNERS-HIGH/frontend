import { apiClient } from "@/api/apiClient";
import { useAlertStore } from "@/store/useAlertStore";

// FormData 요청 시 별도 설정
export async function fetchCrewCreate(formData) {
  try {
    const response = await apiClient.post("/crew", formData, {
      headers: {
        "Content-Type": 'multipart/form-data; boundary="boundary"',
      },
    });
    return response;
  } catch (error) {
    console.error("에러 발생:", error);
    if (error?.response) {
      useAlertStore.getState().showError({title: '문제가 발생했어요', description: error.response.data.serverErrorMessage});
    }
    throw error;
  }
}
