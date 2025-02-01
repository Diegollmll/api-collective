import express from 'express';
import cors from './config/cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import subscriptionRoutes from './routes/subscription.routes';
import roleRoutes from './routes/role.routes';
import contactRoutes from './routes/contact.routes';
import commentRoutes from './routes/comment.routes';
import authRoutes from './routes/auth.routes';
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
app.use('/api/projects', projectRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

app.get("/health", (_req, res) => {
    res.status(200).json({ message: "Server is healthy!" });
});
export default app;
