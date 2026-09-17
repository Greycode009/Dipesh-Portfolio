import { z } from 'zod';

export const createTimelineEntrySchema = z.object({
  year: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  highlight: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateTimelineEntrySchema = createTimelineEntrySchema.partial();
