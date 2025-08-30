import { z } from "zod";

export const userLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  specificLocation: z.string(),
});

export const profileSchema = z.object({
  age: z.coerce
    .number({
      required_error: "나이를 입력해주세요.",
      invalid_type_error: "숫자만 입력 가능합니다.",
    })
    .positive("양수만 입력 가능합니다.")
    .int("정수만 입력 가능합니다."), // 문자열을 숫자로 변환,
  gender: z.enum(["MALE", "FEMALE"]),
  weight: z.coerce
    .number({
      required_error: "몸무게를 입력해주세요.",
      invalid_type_error: "숫자만 입력 가능합니다.",
    })
    .positive("양수만 입력 가능합니다.")
    .int("정수만 입력 가능합니다."), // 문자열을 숫자로 변환,
  height: z.coerce
    .number({
      required_error: "키를 입력해주세요.",
      invalid_type_error: "숫자만 입력 가능합니다.",
    })
    .positive("양수만 입력 가능합니다.")
    .int("정수만 입력 가능합니다."), // 문자열을 숫자로 변환,

  userLocation: userLocationSchema
});