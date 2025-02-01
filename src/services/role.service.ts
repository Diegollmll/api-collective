import { roleSchema } from "../schemas/role.schema";
import prisma from "../utils/prisma";

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

export const RoleService = {
    // Crear un rol
    async createRole(data: typeof roleSchema._input): Promise<ApiResponse<typeof roleSchema._output>> {
        try {
            const parsedData = roleSchema.parse(data);

            const role = await prisma.role.create({
                data: parsedData,
            });
            return { success: true, data: role, message: "Role created successfully." };
        } catch (error: unknown) {
            const err = error as Error & { errors?: { message: string }[] };
            if (err.name === "ZodError") {
                return {
                    success: false,
                    error: "Invalid data: " + (err.errors ? err.errors.map((e) => e.message).join(", ") : "Unknown error"),
                };
            }
            return { success: false, error: "Error creating role: " + err.message };
        }
    },

    // Obtener todos los roles
    async getRoles(): Promise<ApiResponse<typeof roleSchema._output[]>> {
        try {
            const roles = await prisma.role.findMany();
            return { success: true, data: roles, message: "Roles retrieved successfully." };
        } catch (error: unknown) {
            return { success: false, error: "Error obtaining roles: " + (error as Error).message };
        }
    },

    // Obtener un rol por ID
    async getRoleById(id: number): Promise<ApiResponse<typeof roleSchema._output>> {
        try {
            const role = await prisma.role.findUnique({
                where: { id },
            });
            if (!role) {
                return { success: false, error: "Role not found" };
            }
            return { success: true, data: role, message: "Role retrieved successfully." };
        } catch (error: unknown) {
            return { success: false, error: "Error obtaining role: " + (error as Error).message };
        }
    },

    // Actualizar un rol
    async updateRole(id: number, data: typeof roleSchema._input): Promise<ApiResponse<typeof roleSchema._output>> {
        try {
            const parsedData = roleSchema.parse(data);
            const role = await prisma.role.update({
                where: { id },
                data: parsedData,
            });
            return { success: true, data: role, message: "Role updated successfully." };
        } catch (error: unknown) {
            const err = error as Error & { code?: string; errors?: { message: string }[] };
            if (err.name === "ZodError") {
                return {
                    success: false,
                    error: "Invalid data: " + (err.errors ? err.errors.map((e) => e.message).join(", ") : "Unknown error"),
                };
            } else if (err.code === "P2025") {
                return { success: false, error: "Role not found for update." };
            } else {
                return { success: false, error: "Error updating role: " + err.message };
            }
        }
    },

    // Eliminar un rol
    async deleteRole(id: number): Promise<ApiResponse<null>> {
        try {
            await prisma.role.delete({
                where: { id },
            });
            return { success: true, message: "Role deleted successfully." };
        } catch (error: unknown) {
            const err = error as Error & { code?: string };
            if (err.code === "P2025") {
                return { success: false, error: "Role not found for deletion." };
            } else {
                return { success: false, error: "Error deleting role: " + err.message };
            }
        }
    },
};