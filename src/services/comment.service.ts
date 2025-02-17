import { commentSchema, commentUpdateSchema } from "../schemas/comment.schema";
import prisma from "../utils/prisma";
import { Comment } from "@prisma/client";
import { ZodError } from "zod";

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

export const CommentService = {
    // Crear un comentario
    async createComment(data: typeof commentSchema._input): Promise<ApiResponse<Comment>> {
        try {
            console.log('Creando comentario:', {
                ...data,
                isReply: !!data.parentId,
                hasFiles: data.fileUrls && data.fileUrls.length > 0
            });

            const parsedData = commentSchema.parse(data);

            const comment = await prisma.comment.create({
                data: {
                    content: parsedData.content,
                    userId: parsedData.userId,
                    projectId: parsedData.projectId,
                    parentId: parsedData.parentId,
                    fileUrls: parsedData.fileUrls || []
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    },
                    parent: true // Incluir información del comentario padre si existe
                }
            });

            return {
                success: true,
                data: comment,
                message: `Comentario ${parsedData.parentId ? 'respuesta' : 'principal'} creado exitosamente`
            };
        } catch (error) {
            console.error('Error en createComment:', error);
            if (error instanceof ZodError) {
                return {
                    success: false,
                    error: "Datos inválidos: " + error.errors.map(err => err.message).join(", ")
                };
            }
            return {
                success: false,
                error: "Error al crear el comentario"
            };
        }
    },

    // Obtener todos los comentarios
    async getComments(): Promise<ApiResponse<Comment[]>> {
        try {
            const comments = await prisma.comment.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            return { success: true, data: comments, message: "Comments retrieved successfully." };
        } catch (error: unknown) {
            return { success: false, error: "Error obtaining comments: " + (error as Error).message };
        }
    },

    // Obtener un comentario por ID
    async getCommentById(id: number): Promise<ApiResponse<Comment>> {
        try {
            const comment = await prisma.comment.findUnique({
                where: { id },
            });
            if (!comment) {
                return { success: false, error: "Comment not found" };
            }
            return { success: true, data: comment, message: "Comment retrieved successfully." };
        } catch (error: unknown) {
            return { success: false, error: "Error obtaining comment: " + (error as Error).message };
        }
    },

    // Actualizar un comentario
    async updateComment(
        id: number,
        data: typeof commentUpdateSchema._input
    ): Promise<ApiResponse<typeof commentUpdateSchema._output>> {
        try {
            const parsedData = commentUpdateSchema.parse(data);
            const comment = await prisma.comment.update({
                where: { id },
                data: parsedData,
            });
            return { success: true, data: comment, message: "Comment updated successfully." };
        } catch (error: unknown) {
            const err = error as Error & { code?: string; errors?: { message: string }[] };
            if (err.name === "ZodError") {
                return {
                    success: false,
                    error: "Invalid data: " + (err.errors ? err.errors.map((e) => e.message).join(", ") : "Unknown error"),
                };
            } else if (err.code === "P2025") {
                return { success: false, error: "Comment not found for update." };
            } else {
                return { success: false, error: "Error updating comment: " + err.message };
            }
        }
    },

    // Eliminar un comentario
    async deleteComment(id: number): Promise<ApiResponse<null>> {
        try {
            await prisma.comment.delete({
                where: { id },
            });
            return { success: true, message: "Comment deleted successfully." };
        } catch (error: unknown) {
            const err = error as Error & { code?: string };
            if (err.code === "P2025") {
                return { success: false, error: "Comment not found for deletion." };
            } else {
                return { success: false, error: "Error deleting comment: " + err.message };
            }
        }
    },

    getCommentsByProject: async (projectId: number): Promise<ApiResponse<Comment[]>> => {
        try {
            const comments = await prisma.comment.findMany({
                where: { projectId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            return {
                success: true,
                data: comments
            };
        } catch (error) {
            console.error('Error obteniendo comentarios:', error);
            return {
                success: false,
                error: "Error al obtener los comentarios"
            };
        }
    }
};