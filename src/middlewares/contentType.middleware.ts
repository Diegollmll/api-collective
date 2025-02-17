import { Request, Response, NextFunction } from 'express';

export const validateContentType = (allowedTypes: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const contentType = req.headers['content-type']?.toLowerCase() || '';

    // Si es una petición GET o DELETE, no necesitamos validar el content-type
    if (['GET', 'DELETE'].includes(req.method)) {
      return next();
    }

    // Para FormData, el content-type incluirá un boundary
    const isFormData = contentType.includes('multipart/form-data');
    const isValidContentType = isFormData || allowedTypes.some(type => contentType.includes(type));

    if (!isValidContentType) {
      res.status(415).json({
        success: false,
        error: `Content-Type no soportado. Tipos permitidos: ${allowedTypes.join(', ')}`
      });
      return;
    }

    // Para FormData no validamos el body vacío ya que se procesa diferente
    if (!isFormData && ['POST', 'PUT', 'PATCH'].includes(req.method) && Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        error: 'El body de la petición no puede estar vacío'
      });
      return;
    }

    next();
  };
}; 