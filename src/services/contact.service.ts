import { contactSchema, contactUpdateSchema } from "../schemas/contact.schema";
import prisma from "../utils/prisma";
import { ContactForm } from "@prisma/client";
import { ZodError } from "zod";

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

export const ContactService = {
    // Crear un contacto
    createContact: async (data: typeof contactSchema._input): Promise<ApiResponse<ContactForm>> => {
        try {
            const parsedData = contactSchema.parse(data);

            const contact = await prisma.contactForm.create({
                data: {
                    name: parsedData.name,
                    email: parsedData.email,
                    phone: parsedData.phone || "",
                    country: parsedData.country || ""
                }
            });

            return {
                success: true,
                data: contact,
                message: "Contacto creado exitosamente"
            };
        } catch (error) {
            console.error('Error en createContact:', error);
            if (error instanceof ZodError) {
                return {
                    success: false,
                    error: "Datos inválidos: " + error.errors.map(err => err.message).join(", ")
                };
            }
            return {
                success: false,
                error: "Error al crear el contacto"
            };
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
            
            const updateData = {
                name: parsedData.name,
                email: parsedData.email,
                phone: parsedData.phone ?? undefined,
                country: parsedData.country ?? undefined
            };

            const updatedContact = await prisma.contactForm.update({
                where: { id },
                data: updateData
            });

            return { success: true, data: updatedContact, message: "Contact updated successfully." };
        } catch (error) {
            if (error instanceof ZodError) {
                return {
                    success: false,
                    error: "Datos inválidos: " + error.errors.map(err => err.message).join(", ")
                };
            }
            return { success: false, error: "Error updating contact" };
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