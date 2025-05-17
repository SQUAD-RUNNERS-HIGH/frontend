import axios from "axios";
import { Alert } from "react-native";
import { userSignupType } from "@/types";
import { signUpSchema } from "./signUpSchema";

export async function fetchSignup(data: userSignupType) {
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/register`, data);
    return response;
  } catch (error) {
    if (error?.response) {
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
}
