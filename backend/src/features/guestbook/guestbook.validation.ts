import { z } from 'zod';

/**
 * Links are the entire payload of guestbook spam, and a portfolio guestbook has
 * no legitimate need for them, so they are refused outright rather than
 * silently stripped.
 *
 * The bare-domain branch requires a word boundary on both sides, so ordinary
 * prose like "Node.js" or "co-op" is not mistaken for a link.
 */
const LINK =
  /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ru|xyz|top|io|co|shop|click)\b)/i;

export const createGuestbookEntrySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Add a name')
    .max(40, 'Keep the name under 40 characters')
    .refine((value) => !LINK.test(value), 'Names cannot contain links'),
  message: z
    .string()
    .trim()
    .min(2, 'Say a little more')
    .max(280, 'Keep it under 280 characters')
    .refine((value) => !LINK.test(value), 'Messages cannot contain links'),
});

export const moderateGuestbookEntrySchema = z.object({
  approved: z.boolean(),
});
