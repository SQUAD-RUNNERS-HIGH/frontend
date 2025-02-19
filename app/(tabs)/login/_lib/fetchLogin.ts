import { userLoginType } from "@/app/_types";
import axios from "axios";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export async function fetchLogin(data: userLoginType) {
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
      data
    );
    return response;
  } catch (error) {
    if (error?.response) {
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
}
