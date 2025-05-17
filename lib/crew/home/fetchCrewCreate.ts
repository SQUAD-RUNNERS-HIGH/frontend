import { apiClient } from "@/api/apiClient";

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
      Alert.alert(error.response.data.serverErrorMessage);
    }
    throw error;
  }
}
