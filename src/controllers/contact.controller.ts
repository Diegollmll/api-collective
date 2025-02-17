import { Request, Response, NextFunction } from "express";
import { ContactService } from "../services/contact.service";

// Crear un contacto
export const createContact = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        const data = req.is('multipart/form-data') 
            ? {
                name: req.body.name?.toString(),
                email: req.body.email?.toString(),
                phone: req.body.phone?.toString(),
                country: req.body.country?.toString()
              }
            : req.body;

        console.log('Datos procesados:', data);

        const result = await ContactService.createContact(data);
        
        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            success: false,
            error: "Error al crear el contacto"
        });
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
        
        console.log('Update Data:', {
            id,
            body: req.body,
            params: req.params
        });

        const result = await ContactService.updateContact(id, req.body);
        
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error en updateContact:', error);
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