import type { NextFunction, Request, RequestHandler, Response } from 'express';

/** Forwards rejected promises to the error handler; Express 4 does not. */
export const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
