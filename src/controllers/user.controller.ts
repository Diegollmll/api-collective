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
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Combinar el body con el archivo
        const userData = {
            ...req.body,
            file: req.file  // Multer pone el archivo en req.file
        };
        
        console.log('Datos recibidos:', {
            body: req.body,
            file: req.file
        });

        const result = await createUserService(userData);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// Obtener todos los usuarios
export const getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await getUsersService();
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Obtener usuario por ID
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await getUserByIdService(id);
        if (!result.success) {
            res.status(404).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Obtener usuarios por rol
export const getUsersByRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const roleId = parseInt(req.params.roleId);
        const users = await getUsersByRoleService(roleId);
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

// Actualizar usuario
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const userData = {
            ...req.body,
            file: req.file
        };
        
        console.log('Datos de actualización:', {
            id,
            body: req.body,
            file: req.file
        });

        const result = await updateUserService(id, userData);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Eliminar usuario
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        await deleteUserService(id);
        res.status(200).json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};
