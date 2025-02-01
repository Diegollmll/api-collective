import prisma from "../utils/prisma";
import {
  subscriptionSchema,
  subscriptionUpdateSchema,
} from "../schemas/subscription.schema";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export const SubscriptionService = {
  // Crear una suscripción
  async createSubscription(data: typeof subscriptionSchema._input): Promise<ApiResponse<typeof subscriptionSchema._output>> {
    try {
      const parsedData = subscriptionSchema.parse({
        ...data,
        projectId: data.projectId !== null ? Number(data.projectId) : undefined,
      });

      const subscription = await prisma.subscription.create({
        data: parsedData,
      });
      return { success: true, data: { ...subscription, projectId: subscription.projectId ?? undefined } };
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Obtener todas las suscripciones
  async getSubscriptions(): Promise<ApiResponse<typeof subscriptionSchema._output[]>> {
    try {
      const subscriptions = await prisma.subscription.findMany();
      const formattedSubscriptions = subscriptions.map(subscription => ({
        ...subscription,
        projectId: subscription.projectId ?? undefined,
      }));
      return { success: true, data: formattedSubscriptions };
    } catch {
      return { success: false, error: "Error al obtener las suscripciones" };
    }
  },

  // Obtener una suscripción por ID
  async getSubscriptionById(id: number): Promise<ApiResponse<typeof subscriptionSchema._output>> {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id },
      });
      if (!subscription) {
        return { success: false, error: "Subscription not found" };
      }
      return { success: true, data: { ...subscription, projectId: subscription.projectId ?? undefined } };
    } catch {
      return { success: false, error: "Error al obtener la suscripción" };
    }
  },

  // Actualizar una suscripción
  async updateSubscription(
    id: number,
    data: typeof subscriptionUpdateSchema._input
  ): Promise<ApiResponse<typeof subscriptionUpdateSchema._output>> {
    try {
      // Verificar que la suscripción exista
      const findSubscription = await prisma.subscription.findUnique({
        where: { id },
      });

      // Si no se encuentra la suscripción, devolver un error
      if (!findSubscription) {
        return { success: false, error: "Subscription not found" };
      }

      const parsedData = subscriptionUpdateSchema.parse({
        ...data,
        projectId: data.projectId ? Number(data.projectId) : undefined,
      });

      const subscription = await prisma.subscription.update({
        where: { id },
        data: parsedData,
      });
      return { success: true, data: { ...subscription, projectId: subscription.projectId ?? undefined } };
    } catch (error: unknown) {
      const err = error as Error & { code?: string; errors?: { message: string }[] };
      if (err.name === "ZodError") {
        return {
          success: false,
          error:
            "Datos inválidos: " +
            (err.errors ? err.errors.map((e: { message: string }) => e.message).join(", ") : "Unknown error"),
        };
      } else if (err.code === "P2025") {
        return { success: false, error: "Subscription not found to update" };
      } else {
        return {
          success: false,
          error: "Error al actualizar la suscripción: " + err.message,
        };
      }
    }
  },

  // Eliminar una suscripción
  async deleteSubscription(id: number): Promise<ApiResponse<null>> {
    try {
      await prisma.subscription.delete({
        where: { id },
      });
      return { success: true, message: "Subscription successfully deleted" };
    } catch (error: unknown) {
      const err = error as Error & { code?: string };
      if (err.code === "P2025") {
        return { success: false, error: "Subscription not found to delete" };
      } else {
        return {
          success: false,
          error: "Error deleting the Subscription: " + (error as Error).message,
        };
      }
    }
  },
};