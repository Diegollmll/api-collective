import { Request, Response, NextFunction } from "express";
import { ContactService } from "../services/contact.service";

// Crear un contacto
export const createContact = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await ContactService.createContact(req.body);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// Obtener todos los contactos
export const getContacts = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await ContactService.getContacts();
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Obtener un contacto por ID
export const getContactById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await ContactService.getContactById(id);
        if (!result.success) {
            res.status(404).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Actualizar un contacto
export const updateContact = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await ContactService.updateContact(id, req.body);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Eliminar un contacto
export const deleteContact = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await ContactService.deleteContact(id);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};