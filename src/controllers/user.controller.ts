import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { userSchema, userUpdateSchema } from "../schemas/user/user.scheme";

// Crear usuario
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = userSchema.parse(req.body);
        const roleId = parsedData.roleId || 1;
        const passwordEncrypt = await bcrypt.hash(parsedData.password, 10);

        const user = await prisma.user.create({
            data: {
                ...parsedData,
                password: passwordEncrypt,
                roleId
            }
        });

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error); // Pasar error al middleware global
    }
};

// Obtener todos los usuarios
export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            include: { role: true }
        });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

// Obtener usuario por ID
// export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const user = await prisma.user.findUnique({ where: { id } });

//         if (!user) return res.status(404).json({ success: false, error: "Usuario no encontrado" });

//         res.status(200).json({ success: true, data: user });
//     } catch (error) {
//         next(error);
//     }
// };

// Obtener usuarios por rol
export const getUsersByRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roleId = parseInt(req.params.roleId);
        const users = await prisma.user.findMany({ where: { roleId } });

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

// Actualizar usuario
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const parsedData = userUpdateSchema.parse(req.body);

        const user = await prisma.user.update({
            where: { id },
            data: parsedData
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Eliminar usuario
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });

        res.status(200).json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};
