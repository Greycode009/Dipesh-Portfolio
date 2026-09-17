import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AppError } from '@/shared/errors/AppError';
import { asyncHandler } from '@/shared/middleware/asyncHandler';
import { authenticate } from '@/shared/middleware/authenticate';
import { validateBody } from '@/shared/middleware/validate';
import { changePasswordSchema, loginSchema } from './auth.validation';
import * as authService from './auth.service';

/** Slows down credential stuffing against the single admin account. */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
});

export const authRouter = Router();

authRouter.post(
  '/login',
  loginLimiter,
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    res.json(await authService.login(email, password));
  }),
);

authRouter.get('/me', authenticate, (req, res) => {
  res.json({ admin: req.admin });
});

authRouter.post(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  asyncHandler(async (req, res) => {
    if (!req.admin) throw AppError.unauthorized();
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(
      req.admin.sub,
      currentPassword,
      newPassword,
    );
    res.json({ ok: true });
  }),
);
