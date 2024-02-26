import { z } from "zod";

export const TodoValidator = z.object({
    title: z.string().max(120),
    id: z.number().optional() || z.string().optional(),
    isCompleted: z.boolean().optional()
})

export type TodoRequest = z.infer<typeof TodoValidator>