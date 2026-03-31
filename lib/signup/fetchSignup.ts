import axios from "axios";
import { userSignupType } from "@/types";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchSignup(data: userSignupType) {
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/register`, data);
    return response;
  } catch (error) {
    handleApiError(error);
  }
}
