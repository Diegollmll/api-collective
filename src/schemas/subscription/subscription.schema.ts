import { z } from "zod";

export const subscriptionSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  projectId: z.number().optional(),
  type: z.enum(["PROJECT", "GENERAL"]),
});

export const subscriptionUpdateSchema = subscriptionSchema.partial();
