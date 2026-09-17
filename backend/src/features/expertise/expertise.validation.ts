import { z } from 'zod';

export const createExpertiseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  technologies: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
});

export const updateExpertiseSchema = createExpertiseSchema.partial();
