import { PrismaClient } from "@prisma/client";
import { projectSchema, projectUpdateSchema } from "../schemas/project.schema";
import { processFile } from "../utils/s3Utils";

interface ProjectFormData {
    image?: Express.Multer.File;
    logo?: Express.Multer.File;
    title: string;
    description?: string;
    leaderId: string;
    requirements?: string;
    progress?: string;
    website?: string;
    slug?: string;
}

const prisma = new PrismaClient();

export const ProjectService = {
    async createProject(data: ProjectFormData) {
        try {
            const { image, logo, ...restData } = data;
            
            console.log('Procesando imagen:', image?.originalname);
            const imageUrl = image ? await processFile(image, 'project-images') : undefined;
            console.log('URL de imagen generada:', imageUrl);
            
            console.log('Procesando logo:', logo?.originalname);
            const logoUrl = logo ? await processFile(logo, 'project-logos') : undefined;
            console.log('URL de logo generada:', logoUrl);
            
            const projectData = {
                ...restData,
                image: imageUrl,
                logo: logoUrl
            };
            
            const parsedData = projectSchema.parse(projectData);
            
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
        } catch (error) {
            console.error('Error en createProject:', error);
            throw error;
        }
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

    async updateProject(id: number, data: Partial<ProjectFormData>) {
        const { image, logo, ...restData } = data;
        
        // Procesar las imágenes solo si se proporcionan nuevas
        const imageUrl = image ? await processFile(image, 'project-images') : undefined;
        const logoUrl = logo ? await processFile(logo, 'project-logos') : undefined;
        
        const projectData = {
            ...restData,
            ...(imageUrl && { image: imageUrl }),
            ...(logoUrl && { logo: logoUrl })
        };
        
        const parsedData = projectUpdateSchema.parse(projectData);
        
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