import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log al inicio de la petición
  console.log('\n-------------------');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Params:', req.params);
  console.log('Query:', req.query);
  console.log('Headers:', req.headers);
  
  // Mejor manejo del logging del body
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    console.log('Body: FormData contents:', req.body);
    if (req.files) console.log('Files:', req.files);
  } else {
    console.log('Body:', req.body);
  }

  // Interceptar la finalización de la petición
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`Response: ${res.statusCode} - ${duration}ms`);
    console.log('-------------------\n');
  });

  next();
}; 