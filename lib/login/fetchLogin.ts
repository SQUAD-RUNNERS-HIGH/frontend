import { useAlertStore } from "@/store/useAlertStore";
import { userLoginType } from "@/types";
import axios from "axios";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export async function fetchLogin(data: userLoginType) {
  try {
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`);
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
      data
    );
    return response;
  } catch (error) {
    console.error(error);
    if (error?.response) {
      useAlertStore.getState().showError({title: '문제가 발생했어요', description: error.response.data.serverErrorMessage});
    }
  }
}
