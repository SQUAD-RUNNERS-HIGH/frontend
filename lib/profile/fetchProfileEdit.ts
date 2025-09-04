import { apiClient } from "@/api/apiClient";
import { useAlertStore } from "@/store/useAlertStore";
import { profileSchema } from "./profileSchema";
import z from "zod";

interface ProfileEditType {
  physical: {
    gender: "MALE" | "FEMALE";
    age: number;
    height: number;
    weight: number;
  },
  userLocation: {
    latitude: number;
    longitude: number;
    specificLocation: string;
  }
}
// FormData 요청 시 별도 설정
export async function fetchProfileEdit(data: ProfileEditType) {
  try {
    const response = await apiClient.patch("/user", data);
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
