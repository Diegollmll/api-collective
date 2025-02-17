import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service";
import { processFile } from "../utils/s3Utils";

// Crear un comentario
export const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Datos recibidos:', {
            body: req.body,
            filesInfo: req.files ? (req.files as Express.Multer.File[]).map(f => ({
                name: f.originalname,
                size: f.size,
                type: f.mimetype
            })) : [],
            isParentComment: !req.body.parentId,
            parentId: req.body.parentId
        });
        
        // Procesar archivos si existen
        const files = req.files as Express.Multer.File[];
        const fileUrls: string[] = [];
        
        if (files && files.length > 0) {
            console.log(`Procesando ${files.length} archivos...`);
            for (const file of files) {
                try {
                    console.log(`Procesando archivo: ${file.originalname} (${file.mimetype})`);
                    const fileUrl = await processFile(file, 'comment-files');
                    console.log(`URL generada: ${fileUrl}`);
                    fileUrls.push(fileUrl);
                } catch (error) {
                    console.error(`Error procesando archivo ${file.originalname}:`, error);
                }
            }
        }

        // Transformar los datos
        const commentData = {
            content: req.body.content,
            userId: req.body.userId,
            projectId: Number(req.body.projectId),
            parentId: req.body.parentId ? Number(req.body.parentId) : null,
            fileUrls: fileUrls
        };

        console.log('Datos procesados:', {
            ...commentData,
            isParentComment: !commentData.parentId,
            filesCount: fileUrls.length
        });
        
        const result = await CommentService.createComment(commentData);
        console.log('Resultado:', result);
        
        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
            success: false,
            error: "Error al crear el comentario"
        });
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
export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = Number(req.params.id);
        console.log('Actualizando comentario:', {
            commentId,
            body: req.body,
            files: req.files ? (req.files as Express.Multer.File[]).map(f => ({
                name: f.originalname,
                size: f.size,
                type: f.mimetype
            })) : []
        });

        // Procesar archivos nuevos si existen
        const files = req.files as Express.Multer.File[];
        const newFileUrls: string[] = [];
        
        if (files && files.length > 0) {
            for (const file of files) {
                try {
                    const fileUrl = await processFile(file, 'comment-files');
                    newFileUrls.push(fileUrl);
                } catch (error) {
                    console.error(`Error procesando archivo ${file.originalname}:`, error);
                }
            }
        }

        const updateData = {
            content: req.body.content,
            fileUrls: [...(req.body.existingFiles || []), ...newFileUrls]
        };

        const result = await CommentService.updateComment(commentId, updateData);
        
        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error actualizando comentario:', error);
        res.status(500).json({
            success: false,
            error: "Error al actualizar el comentario"
        });
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

export const getCommentsByProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId = parseInt(req.params.projectId, 10);
        const result = await CommentService.getCommentsByProject(projectId);
        
        if (!result.success) {
            res.status(400).json(result);
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: "Error al obtener los comentarios"
        });
    }
};