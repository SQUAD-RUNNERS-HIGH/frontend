import { apiClient } from "@/api/apiClient";

export async function fetchPersonRanks(courseId:string) {
  try {
    const response = await apiClient.get(
      `${process.env.EXPO_PUBLIC_API_URL}/personal-ranks/courses/${courseId}`,
      {
        params: {
          page: 0,
          size: 6,
        }
      }
    );
    return response?.data.data;
  } catch (error) {
    console.error(error);
  }
}
