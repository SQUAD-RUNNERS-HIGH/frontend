import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

interface ProfileEditType {
  physical: {
    gender: "MALE" | "FEMALE";
    age: number;
    height: number;
    weight: number;
  };
  userLocation: {
    latitude: number;
    longitude: number;
    specificLocation: string;
  };
}

export async function fetchProfileEdit(data: ProfileEditType) {
  try {
    const response = await apiClient.patch("/user", data);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
