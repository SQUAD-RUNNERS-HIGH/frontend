import { apiClient } from "@/api/apiClient";
import { z } from "zod";
import { crewSchema } from "./crewSchema";
import { Alert } from "react-native";

export async function fetchCrewCreate(data: z.infer<typeof crewSchema>) {
  try {
    const formData = new FormData();

    // crewCreateRequest 객체를 만들기 위해 필요한 필드 모음
    const crewCreateRequest: any = {};

    Object.entries(data).forEach(([key, value]) => {
      if (key === "crewLocation" && typeof value === "object" && value !== null) {
        crewCreateRequest[key] = value;
      } else if (key === "image" && typeof value === "string") {
        const uri = value;
        const filename = uri.split('/').pop() ?? 'photo.jpg';

        formData.append('image', {
          uri,
          name: filename,
          type: 'image/jpeg', // 무조건 image/jpeg로 고정
        } as any);
        
      } else {
        crewCreateRequest[key] = value;
      }
    });
    console.log(formData);
    // crewCreateRequest 부분 추가
    formData.append('crewCreateRequest', JSON.stringify(crewCreateRequest));

    const response = await apiClient.post(`/crew`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error: any) {
    if (error?.response) {
      Alert.alert(error.response.data.serverErrorMessage || "에러 발생");
    }
  }
}
