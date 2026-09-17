import { z } from 'zod';

export const createProjectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens'),
  title: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()).default([]),
  // Empty strings from the admin form mean "there isn't one", not "invalid".
  image: z
    .union([z.string().url(), z.literal('')])
    .nullish()
    .transform((value) => value || null),
  githubUrl: z.string().url(),
  liveUrl: z
    .union([z.string().url(), z.literal('')])
    .nullish()
    .transform((value) => value || null),
  type: z
    .enum(['frontend', 'backend', 'fullstack', 'mobile', 'other'])
    .default('frontend'),
  featured: z.boolean().default(false),
  category: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD'),
  sortOrder: z.number().int().default(0),
  status: z.enum(['draft', 'published']).default('draft'),
  worldX: z.number().int().default(0),
  worldY: z.number().int().default(0),
  sprite: z.string().default('cabinet-default'),
});

export const updateProjectSchema = createProjectSchema.partial();
