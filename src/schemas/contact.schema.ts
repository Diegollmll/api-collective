import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("El correo electrónico no es válido"), 
  phone: z.string().min(1, "El teléfono es obligatorio"),
  country: z.string().min(1, "El país es obligatorio"),
});

export const contactUpdateSchema = contactSchema.partial();
