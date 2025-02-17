import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "El contenido es obligatorio"),
  userId: z.string().min(1, "El ID del usuario es obligatorio"),
  projectId: z.number().min(1, "El ID del proyecto es obligatorio"),
  parentId: z.number().nullable().optional(),
  fileUrls: z.array(z.string()).optional(),
});

export const commentUpdateSchema = commentSchema.partial();
