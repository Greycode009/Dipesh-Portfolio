import { z } from 'zod';

const LINK =
  /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ru|xyz|top|io|co|shop|click)\b)/i;

export const postMessageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, 'Say something')
    .max(240, 'Keep it under 240 characters')
    .refine((value) => !LINK.test(value), 'Links are not allowed in chat'),
});
