import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service";

// Crear un comentario
export const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await CommentService.createComment(req.body);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// Obtener todos los comentarios
export const getComments = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await CommentService.getComments();
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Obtener un comentario por ID
export const getCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await CommentService.getCommentById(id);
        if (!result.success) {
            res.status(404).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Actualizar un comentario
export const updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await CommentService.updateComment(id, req.body);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Eliminar un comentario
export const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await CommentService.deleteComment(id);
        if (!result.success) {
            res.status(400).json(result);
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};