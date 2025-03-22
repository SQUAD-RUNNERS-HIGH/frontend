import { z } from "zod";

export const crewSchema = z.object({
  name: z.string().min(2, "크루의 이름은 최소 2글자여야 합니다."),
  description: z.string(),
  maxCapacity: z
    .number()
    .min(2, "크루 최대인원은 최소 2명은 되어야한다.")
    .max(20,"크루 최대인원은 최대 20명 까지 가능합니다."),
  image: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});