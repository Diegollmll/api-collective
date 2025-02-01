import { z } from "zod";

export const projectSchema = z.object({
    title: z.string().min(1, "El título es obligatorio"),
    description: z.string().optional(),
    leaderId: z.string(),
    slug: z.string().optional(),
    logo: z.string().optional(),
    image: z.string().optional(),
    website: z.string().optional(),
    requirements: z.string().optional(),
    progress: z.string().optional(),
});

export const getMembersSchema = z.object({
    role: z.string().default("member"),
});


export const projectUpdateSchema = projectSchema.partial();
