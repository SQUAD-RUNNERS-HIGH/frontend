import { apiClient } from "@/api/apiClient";
import { useAlertStore } from "@/store/useAlertStore";
import { profileSchema } from "./profileSchema";
import z from "zod";

// FormData 요청 시 별도 설정
export async function fetchProfileEdit(formData:z.infer<typeof profileSchema>) {
  try {
    const response = await apiClient.patch("/user", formData);
    console.log(response);
    return response;
  } catch (error) {
    console.error("에러 발생:", error);
    if (error?.response) {
      useAlertStore.getState().showError({title: '문제가 발생했어요', description: error.response.data.serverErrorMessage});
    }
    throw error;
  }
}
