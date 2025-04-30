import axios from "axios";
import { Alert } from "react-native";
import { CreateCrewApi, userSignupType } from "@/app/_types";
import { z } from "zod";
import { crewSchema } from "./crewSchema";
import { apiClient } from "@/api/apiClient";

export async function fetchCrewCreate(data: z.infer<typeof crewSchema>) {
  try {
    const {image, ...rest} = data;
    const response = await apiClient.post(`/crew`, rest);
    return response;
  } catch (error) {
    if (error?.response) {
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
}