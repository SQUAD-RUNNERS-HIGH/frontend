import { z } from "zod";

export const loginSchema = z.object({
  loginId: z.string().min(2, "아이디는 최소 2글자여야 합니다."),
  password: z.string().min(8, "비밀번호는 최소 8글자여야합니다"),
});