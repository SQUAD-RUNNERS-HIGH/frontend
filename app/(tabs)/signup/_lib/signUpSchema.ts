import { z } from "zod";

export const signUpSchema = z.object({
  loginId: z.string().min(2, "아이디는 최소 2글자여야 합니다."),
  password: z.string().min(8, "비밀번호는 최소 8글자여야합니다"),
  username: z
    .string()
    .min(2, "닉네임은 최소 2글자 여야 합니다.")
    .max(10, "닉네임은 10글자를 넘을 수 없습니다."),
  age: z.coerce
    .number({
      required_error: "나이를 입력해주세요.",
      invalid_type_error: "숫자만 입력 가능합니다.",
    })
    .positive("양수만 입력 가능합니다.")
    .int("정수만 입력 가능합니다."), // 문자열을 숫자로 변환,
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
  gender: z.enum(["MALE", "FEMALE"]),
  place: z.object({
      latitude: z.number(),
      longitude: z.number(),
      latitudeDelta: z.number(),
      longitudeDelta: z.number(),
    })
});