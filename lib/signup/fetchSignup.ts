import axios from "axios";
import { Alert } from "react-native";
import { userSignupType } from "@/types";
import { signUpSchema } from "./signUpSchema";
import { useAlertStore } from "@/store/useAlertStore";

export async function fetchSignup(data: userSignupType) {
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/register`, data);
    return response;
  } catch (error) {
    if (error?.response) {
      useAlertStore.getState().showError({title: '문제가 발생했어요', description: error.response.data.serverErrorMessage});
    }
  }
}
