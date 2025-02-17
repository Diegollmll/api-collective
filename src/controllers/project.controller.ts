import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/project.service";

// Crear proyecto
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const projectData = {
            ...req.body,
            image: files?.image?.[0] || null,
            logo: files?.logo?.[0] || null,
        };
        
        const project = await ProjectService.createProject(projectData);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

// Obtener todos los proyectos
export const getProjects = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const projects = await ProjectService.getProjects();
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        next(error);
    }
};

// Obtener proyecto por ID
export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const project = await ProjectService.getProjectById(id);
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

// Actualizar proyecto
export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const projectData = {
            ...req.body,
            image: files?.image?.[0] || null,
            logo: files?.logo?.[0] || null,
        };
        
        const project = await ProjectService.updateProject(id, projectData);
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

// Eliminar proyecto
export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        await ProjectService.deleteProject(id);
        res.status(200).json({ success: true, message: "Proyecto eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};

// Obtener miembros
export const getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { role } = req.query as { role: string };
        const members = await ProjectService.getMembers(role);
        res.status(200).json({ success: true, data: members });
    } catch (error) {
        next(error);
    }
};