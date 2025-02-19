import { z } from "zod";

export const loginSchema = z.object({
  loginId: z.string(),
  password: z.string(),
});