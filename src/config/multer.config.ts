import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from 'express';

// Lista de tipos MIME permitidos
const ALLOWED_MIME_TYPES = [
    // Imágenes
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documentos
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    // Texto
    'text/plain',
    'text/csv',
    // Comprimidos
    'application/zip',
    'application/x-rar-compressed'
];

export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Tipo de archivo no permitido. Tipos permitidos: ${ALLOWED_MIME_TYPES.join(', ')}`));
        }
    },
    limits: {
        fileSize: 25 * 1024 * 1024, // 25MB máximo
    }
});

// Middleware para manejar errores de Multer
export const handleMulterError: ErrorRequestHandler = (
    err: Error | multer.MulterError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({
            success: false,
            error: `Error al subir archivo: ${err.message}`
        });
    } else if (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    } else {
        next();
    }
}; 