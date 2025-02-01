import { z } from "zod"

export const roleSchema = z.object({
    name: z.string().min(1, "El nombre del rol es obligatorio"),
});