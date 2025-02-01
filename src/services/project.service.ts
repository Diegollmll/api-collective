import { PrismaClient } from "@prisma/client";
import { projectSchema, projectUpdateSchema } from "../schemas/project.schema";

const prisma = new PrismaClient();

export const ProjectService = {
    async createProject(data: typeof projectSchema._input) {
        const parsedData = projectSchema.parse(data);
        
        const existingProject = await prisma.project.findUnique({
            where: { slug: parsedData.slug },
        });
        
        if (existingProject) {
            throw new Error("El enlace con este slug ya existe.");
        }
        
        return await prisma.project.create({
            data: parsedData,
            include: { leader: true }
        });
    },

    async getProjects() {
        return await prisma.project.findMany({
            include: { leader: true, members: true }
        });
    },

    async getProjectById(id: number) {
        const project = await prisma.project.findUnique({
            where: { id },
            include: { leader: true }
        });
        
        if (!project) {
            throw new Error("Proyecto no encontrado");
        }
        
        return project;
    },

    async updateProject(id: number, data: typeof projectUpdateSchema._input) {
        const parsedData = projectUpdateSchema.parse(data);
        
        return await prisma.project.update({
            where: { id },
            data: parsedData,
        });
    },

    async deleteProject(id: number) {
        await prisma.project.delete({ where: { id } });
    },

    async getMembers(role: string) {
        const members = await prisma.user.findMany({
            where: {
                role: {
                    name: role,
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return members.map((member) => ({
            id: member.id,
            name: member.name ?? "",
            email: member.email,
        }));
    }
};