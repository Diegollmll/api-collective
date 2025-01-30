import express from 'express';
import cors from './config/cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors);
app.use(express.json());

// Rutas
app.get('/', (_req, res) => {
    res.status(200).send('¡Bienvenido a la API de Collective!');
});
app.use('/api/users', userRoutes);
app.get("/health", (_req, res) => {
    res.status(200).json({ message: "Server is healthy!" });
});
export default app;
