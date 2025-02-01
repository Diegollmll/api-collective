import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { userSchema, userUpdateSchema } from "../schemas/user.scheme";
import { User } from "@prisma/client";

interface CreateUserData {
    username: string;
    email: string;
    password: string;
    roleId?: number;
}

export const createUserService = async (data: CreateUserData): Promise<User> => {
    const parsedData = userSchema.parse(data);
    const roleId = parsedData.roleId || 1;
    const passwordEncrypt = await bcrypt.hash(parsedData.password, 10);

    return prisma.user.create({
        data: {
            ...parsedData,
            password: passwordEncrypt,
            roleId
        }
    });
};

// Obtener todos los usuarios
export const getUsersService = async () => {
    return prisma.user.findMany({
        include: { role: true }
    });
};

// Obtener usuario por ID
export const getUserByIdService = async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
};

// Obtener usuarios por rol
export const getUsersByRoleService = async (roleId: number) => {
    return prisma.user.findMany({ where: { roleId } });
};

// Actualizar usuario
export const updateUserService = async (id: string, data: Partial<CreateUserData>) => {
    const parsedData = userUpdateSchema.parse(data);
    return prisma.user.update({
        where: { id },
        data: parsedData
    });
};

// Eliminar usuario
export const deleteUserService = async (id: string) => {
    return prisma.user.delete({ where: { id } });
};
