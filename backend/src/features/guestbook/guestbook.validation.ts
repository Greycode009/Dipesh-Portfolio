import { z } from 'zod';

export const createGuestbookEntrySchema = z.object({
  name: z.string().trim().min(1).max(60),
  message: z.string().trim().min(1).max(280),
});

export const moderateGuestbookEntrySchema = z.object({
  approved: z.boolean(),
});
