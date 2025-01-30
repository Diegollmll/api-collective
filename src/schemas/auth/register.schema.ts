import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("El correo electrónico no es válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    roleId: z.number().min(1, 'El ID del rol debe tener al menos un numero')
});
