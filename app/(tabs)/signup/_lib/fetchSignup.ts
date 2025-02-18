import axios from "axios";
import { Alert } from "react-native";
import { userSignupType } from "@/app/_types";

export async function fetchSignup(data: userSignupType) {
  try {
    const response = await axios.post(`${process.env.API_URL}/user/register`, data);
    return response;
  } catch (error) {
    Alert.alert("회원가입에 실패했습니다.");
  }
}
