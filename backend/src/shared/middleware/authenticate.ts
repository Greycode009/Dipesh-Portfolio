import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { AppError } from '@/shared/errors/AppError';

export interface AdminTokenPayload {
  sub: number;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

/** Rejects the request unless it carries a valid admin bearer token. */
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(AppError.unauthorized());
  }

  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret);
    if (typeof payload === 'string') throw new Error('Unexpected token shape');
    req.admin = { sub: Number(payload.sub), email: String(payload.email) };
    next();
  } catch {
    next(AppError.unauthorized('Invalid or expired token'));
  }
};

/** Attaches req.admin when a valid token is present, but never rejects. */
export const optionalAuthenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();

  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret);
    if (typeof payload !== 'string') {
      req.admin = { sub: Number(payload.sub), email: String(payload.email) };
    }
  } catch {
    // An invalid token on a public route is simply an anonymous caller.
  }
  next();
};
