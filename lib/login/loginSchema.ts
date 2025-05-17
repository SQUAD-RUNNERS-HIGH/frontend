import { z } from "zod";

export const loginSchema = z.object({
  loginId: z.string().nonempty(),
  password: z.string().nonempty(),
});