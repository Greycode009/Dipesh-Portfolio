import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  proficiency: z.number().int().min(1).max(5).default(3),
  itemSprite: z.string().default('item-default'),
  sortOrder: z.number().int().default(0),
});

export const updateSkillSchema = createSkillSchema.partial();
