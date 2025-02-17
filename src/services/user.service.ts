import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { userSchema, userUpdateSchema } from "../schemas/user.scheme";
import { ZodError } from "zod";
import { processFile } from "../utils/s3Utils";

// Interfaz para usuario sin contraseña
interface UserWithoutPassword {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    emailVerified: Date | null;
    createdAt: Date;
    updatedAt: Date;
    roleId: number;
    role?: {
        id: number;
        name: string;
    };
}

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

interface CreateUserData {
    name: string;
    email: string;
    password: string;
    roleId?: number;
    avatar?: Express.Multer.File;
    file?: Express.Multer.File;
}

interface UpdateUserInput {
    file?: Express.Multer.File;
    body?: {
        name?: string;
        email?: string;
        roleId?: string | number;
    };
}

export const createUserService = async (data: CreateUserData): Promise<ApiResponse<UserWithoutPassword>> => {
    try {
        const avatar = data.avatar || data.file;
        console.log('Avatar recibido:', avatar);
        
        let avatarUrl;
        if (avatar) {
            try {
                avatarUrl = await processFile(avatar, 'user-avatars');
                console.log('Avatar URL generada:', avatarUrl); // Debug
            } catch (error) {
                console.error('Error procesando avatar:', error);
            }
        }

        const parsedData = userSchema.parse({
            ...data,
            avatar: avatarUrl
        });
        
        const roleId = Number(parsedData.roleId) || 1;
        console.log('Role ID:', roleId);
        const passwordEncrypt = await bcrypt.hash(parsedData.password, 10);

        const user = await prisma.user.create({
            data: {
                ...parsedData,
                password: passwordEncrypt,
                roleId,
                avatar: avatarUrl // Asegurarnos de que se guarde la URL
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                roleId: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return { 
            success: true, 
            data: user as UserWithoutPassword,
            message: "Usuario creado exitosamente" 
        };
    } catch (error) {
        console.error('Error completo:', error);
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map(err => {
                switch (err.path[0]) {
                    case 'name':
                        return 'El nombre es requerido';
                    case 'email':
                        return 'El email es requerido y debe ser válido';
                    case 'password':
                        return 'La contraseña es requerida';
                    default:
                        return err.message;
                }
            }).join(', ');
            return { 
                success: false, 
                error: errorMessages 
            };
        }
        
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return { 
                    success: false, 
                    error: "El email ya está registrado" 
                };
            }
        }
        
        return { 
            success: false, 
            error: "Error al crear el usuario" 
        };
    }
};

// Obtener todos los usuarios
export const getUsersService = async (): Promise<ApiResponse<UserWithoutPassword[]>> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                roleId: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return { success: true, data: users as UserWithoutPassword[] };
    } catch (error: unknown) {
        console.error('Error al obtener usuarios:', error);
        return { success: false, error: "Error al obtener usuarios" };
    }
};

// Obtener usuario por ID
export const getUserByIdService = async (id: string): Promise<ApiResponse<UserWithoutPassword | null>> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                roleId: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (!user) {
            return { success: false, error: "Usuario no encontrado" };
        }
        return { success: true, data: user as UserWithoutPassword };
    } catch (error: unknown) {
        console.error('Error al obtener usuario:', error);
        return { success: false, error: "Error al obtener usuario" };
    }
};

// Obtener usuarios por rol
export const getUsersByRoleService = async (roleId: number) => {
    return prisma.user.findMany({ where: { roleId } });
};

// Actualizar usuario
export const updateUserService = async (
    id: string, 
    data: UpdateUserInput
): Promise<ApiResponse<UserWithoutPassword>> => {
    try {
        // Obtener el archivo del campo 'avatar'
        const avatar = data.file;
        console.log('Avatar recibido en actualización:', avatar);
        
        let avatarUrl;
        if (avatar) {
            try {
                avatarUrl = await processFile(avatar, 'user-avatars');
                console.log('Avatar URL generada:', avatarUrl);
            } catch (error) {
                console.error('Error procesando avatar:', error);
            }
        }
        console.log('roleId:', data.body);
        // Preparar los datos para actualizar
        const updateData = {
            name: data.body?.name,
            email: data.body?.email,
            roleId: data.body?.roleId ? parseInt(data.body.roleId.toString()) : undefined,
            avatar: avatarUrl
        };
        console.log('roleId:', updateData.roleId);
        // Validar con Zod después de limpiar undefined
        const cleanedData = Object.fromEntries(
            Object.entries(updateData).filter(([, value]) => value !== undefined)
        );

        const validatedData = userUpdateSchema.parse(cleanedData);

        const user = await prisma.user.update({
            where: { id },
            data: validatedData,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                roleId: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return { 
            success: true, 
            data: user as UserWithoutPassword,
            message: "Usuario actualizado exitosamente" 
        };
    } catch (error) {
        console.error('Error completo:', error);
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map(err => {
                switch (err.path[0]) {
                    case 'name':
                        return 'El nombre es requerido';
                    case 'email':
                        return 'El email debe ser válido';
                    case 'roleId':
                        return 'El rol debe ser un número válido';
                    default:
                        return err.message;
                }
            }).join(', ');
            return { success: false, error: errorMessages };
        }
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return { success: false, error: "El email ya está registrado" };
            }
            return { success: false, error: error.message };
        }
        return { success: false, error: "Error al actualizar usuario" };
    }
};

// Eliminar usuario
export const deleteUserService = async (id: string): Promise<ApiResponse<null>> => {
    try {
        await prisma.user.delete({ where: { id } });
        return { success: true, message: "Usuario eliminado exitosamente" };
    } catch (error: unknown) {
        console.error('Error al eliminar usuario:', error);
        return { success: false, error: "Error al eliminar usuario" };
    }
};
