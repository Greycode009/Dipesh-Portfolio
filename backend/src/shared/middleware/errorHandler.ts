import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ValidationError as SequelizeValidationError } from 'sequelize';
import { AppError } from '@/shared/errors/AppError';
import { env } from '@/config/env';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  // Express identifies error handlers by arity, so `next` must stay.
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ error: error.message, details: error.details });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (error instanceof SequelizeValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors.map((item) => ({
        path: item.path,
        message: item.message,
      })),
    });
  }

  console.error('Unhandled error:', error);
  return res.status(500).json({
    error: 'Internal server error',
    ...(env.isProduction
      ? {}
      : { details: error instanceof Error ? error.message : String(error) }),
  });
}
