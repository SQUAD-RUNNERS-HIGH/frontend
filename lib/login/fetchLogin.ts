import { userLoginType } from "@/types";
import axios from "axios";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchLogin(data: userLoginType) {
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
      data
    );
    return response;
  } catch (error) {
    handleApiError(error);
  }
}
