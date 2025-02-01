import { Request, Response, NextFunction } from "express";
import {
    createUserService,
    getUsersService,
    getUserByIdService,
    getUsersByRoleService,
    updateUserService,
    deleteUserService
} from "../services/user.service";

// Crear usuario
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await createUserService(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Obtener todos los usuarios
export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getUsersService();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

// Obtener usuario por ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdService(id);

        if (!user) {
            res.status(404).json({ success: false, error: "Usuario no encontrado" });
            return;
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Obtener usuarios por rol
export const getUsersByRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roleId = parseInt(req.params.roleId);
        const users = await getUsersByRoleService(roleId);
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

// Actualizar usuario
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await updateUserService(id, req.body);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Eliminar usuario
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await deleteUserService(id);
        res.status(200).json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};
