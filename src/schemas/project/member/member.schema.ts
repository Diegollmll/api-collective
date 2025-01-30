import { z } from "zod";

export const getMembersSchema = z.object({
  role: z.string().default("member"), // Por defecto se filtra por "member"
});
