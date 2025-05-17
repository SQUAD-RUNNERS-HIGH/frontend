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
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
}
