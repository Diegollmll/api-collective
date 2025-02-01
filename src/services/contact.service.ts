import { contactSchema, contactUpdateSchema } from "../schemas/contact.schema";
import prisma from "../utils/prisma";

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

export const ContactService = {
    // Crear un contacto
    async createContact(data: typeof contactSchema._input): Promise<ApiResponse<typeof contactSchema._output>> {
        try {
            const parsedData = contactSchema.parse(data);
            const contact = await prisma.contactForm.create({
                data: parsedData,
            });
            return { success: true, data: contact, message: "Contact created successfully." };
        } catch (error: unknown) {
            const err = error as Error & { errors?: { message: string }[] };
            if (err.name === "ZodError") {
                return {
                    success: false,
                    error: "Invalid data: " + (err.errors ? err.errors.map((e) => e.message).join(", ") : "Unknown error"),
                };
            }
            return { success: false, error: "Error creating contact: " + err.message };
        }
    },

    // Obtener todos los contactos
    async getContacts(): Promise<ApiResponse<typeof contactSchema._output[]>> {
        try {
            const contacts = await prisma.contactForm.findMany();
            return { success: true, data: contacts, message: "Contacts retrieved successfully." };
        } catch (error: unknown) {
            return { success: false, error: "Error obtaining contacts: " + (error as Error).message };
        }
    },

    // Obtener un contacto por ID
    async getContactById(id: number): Promise<ApiResponse<typeof contactSchema._output>> {
        try {
            const contact = await prisma.contactForm.findUnique({
                where: { id },
            });
            if (!contact) {
                return { success: false, error: "Contact not found" };
            }
            return { success: true, data: contact, message: "Contact retrieved successfully." };
        } catch (error: unknown) {
            return { success: false, error: "Error obtaining contact: " + (error as Error).message };
        }
    },

    // Actualizar un contacto
    async updateContact(
        id: number,
        data: typeof contactUpdateSchema._input
    ): Promise<ApiResponse<typeof contactUpdateSchema._output>> {
        try {
            const parsedData = contactUpdateSchema.parse(data);
            const contact = await prisma.contactForm.findUnique({
                where: { id },
            });
            if (!contact) {
                return { success: false, error: "Contact not found" };
            }
            const updatedContact = await prisma.contactForm.update({
                where: { id },
                data: parsedData,
            });
            return { success: true, data: updatedContact, message: "Contact updated successfully." };
        } catch (error: unknown) {
            const err = error as Error & { code?: string; errors?: { message: string }[] };
            if (err.name === "ZodError") {
                return {
                    success: false,
                    error: "Invalid data: " + (err.errors ? err.errors.map((e) => e.message).join(", ") : "Unknown error"),
                };
            } else if (err.code === "P2025") {
                return { success: false, error: "Contact not found for update." };
            } else {
                return { success: false, error: "Error updating contact: " + err.message };
            }
        }
    },

    // Eliminar un contacto
    async deleteContact(id: number): Promise<ApiResponse<null>> {
        try {
            await prisma.contactForm.delete({
                where: { id },
            });
            return { success: true, message: "Contact deleted successfully." };
        } catch (error: unknown) {
            const err = error as Error & { code?: string };
            if (err.code === "P2025") {
                return { success: false, error: "Contact not found for deletion." };
            } else {
                return { success: false, error: "Error deleting contact: " + err.message };
            }
        }
    },
};