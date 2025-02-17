import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().nullable().optional(),
  country: z.string().nullable().optional()
});

export const contactUpdateSchema = contactSchema.partial();
