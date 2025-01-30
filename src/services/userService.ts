import { userSchema } from "../schemas/user/user.scheme";
import prisma from "../utils/prisma";
import bcrypt from 'bcrypt';
import { ApiResponse } from "../types/response.types";
import { z } from "zod";

type CreateUserData = z.infer<typeof userSchema>;

export const createUser = async (data: CreateUserData): Promise<ApiResponse<{ id: string; email: string }>> => {
    try {
        const parsedData = userSchema.parse(data); // Validación con Zod
        const roleId = parsedData.roleId || 1;
        const passwordEncrypt = await bcrypt.hash(parsedData.password, 10);

        const user = await prisma.user.create({
            data: {
                ...parsedData,
                password: passwordEncrypt,
                roleId,
            },
        });

        return {
            success: true,
            data: { id: user.id, email: user.email },
            message: "User created successfully",
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error";
        return { success: false, error: errorMessage };
    }
};
