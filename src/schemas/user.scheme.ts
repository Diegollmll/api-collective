import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    roleId: z.number().optional(),
    avatar: z.string().optional()
});

export const userUpdateSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").optional(),
    email: z.string().email("Email inválido").optional(),
    roleId: z.number().min(1, "El rol debe ser un número válido").optional(),
    avatar: z.string().optional(),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional()
});