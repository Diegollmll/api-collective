import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "El contenido es obligatorio"),
  authorId: z.string().min(1, "El ID del autor es obligatorio"),
  projectId: z.number().min(1, "El ID del proyecto es obligatorio"),
  parentId: z.number().optional(),
  fileUrls: z.array(z.string()).optional(),
});

export const commentUpdateSchema = commentSchema.partial();
