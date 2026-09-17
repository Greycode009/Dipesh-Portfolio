import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

/** Replaces req.body with the parsed result, so handlers get typed, stripped data. */
export const validateBody =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return next(result.error);
    req.body = result.data;
    next();
  };
