import { z } from 'zod';

export const createSocialSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  icon: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const updateSocialSchema = createSocialSchema.partial();
