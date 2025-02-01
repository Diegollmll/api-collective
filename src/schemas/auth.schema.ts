import { object, string, z } from "zod"

export const loginSchema = object({
    email: string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
    password: string({ required_error: 'password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
})

export const userSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("El correo electrónico no es válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    roleId: z.number().min(1, 'El ID del rol debe tener al menos un numero')
});
