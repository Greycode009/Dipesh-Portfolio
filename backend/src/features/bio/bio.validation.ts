import { z } from 'zod';

export const updateBioSchema = z
  .object({
    name: z.string().min(1),
    headline: z.string().min(1),
    roles: z.array(z.string()),
    story: z.array(z.string()),
    quote: z.string(),
    avatarUrl: z.string().url(),
    portraitUrl: z.string().url(),
    homeIntro: z.string(),
    heroStatValue: z.string().min(1).max(12),
    heroStatLabel: z.string().min(1).max(60),
    location: z.string(),
    email: z.string().email(),
    phone: z.string(),
    availableForWork: z.boolean(),
  })
  .partial();
