import { createHash } from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';
import { AppError } from '@/shared/errors/AppError';
import { asyncHandler } from '@/shared/middleware/asyncHandler';
import {
  authenticate,
  optionalAuthenticate,
} from '@/shared/middleware/authenticate';
import { validateBody } from '@/shared/middleware/validate';
import { GuestbookEntry } from './guestbookEntry.model';
import {
  createGuestbookEntrySchema,
  moderateGuestbookEntrySchema,
} from './guestbook.validation';

/** Anyone can sign, but not repeatedly. */
const signLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'You have already signed recently. Try again later.' },
});

/** Identifies a repeat poster without storing their address. */
const hashAuthor = (ip: string) =>
  createHash('sha256').update(`${ip}:${env.jwtSecret}`).digest('hex');

export const guestbookRouter = Router();

guestbookRouter.get(
  '/',
  optionalAuthenticate,
  asyncHandler(async (req, res) => {
    res.json(
      await GuestbookEntry.findAll({
        where: req.admin ? undefined : { approved: true },
        order: [['createdAt', 'DESC']],
        limit: 100,
      }),
    );
  }),
);

guestbookRouter.post(
  '/',
  signLimiter,
  validateBody(createGuestbookEntrySchema),
  asyncHandler(async (req, res) => {
    const entry = await GuestbookEntry.create({
      name: req.body.name,
      message: req.body.message,
      approved: false,
      authorHash: hashAuthor(req.ip ?? 'unknown'),
    });

    // Never echo an unapproved message back as if it were live.
    res.status(201).json({
      ok: true,
      id: entry.id,
      message: 'Thanks for signing! Your message will appear once approved.',
    });
  }),
);

guestbookRouter.patch(
  '/:id',
  authenticate,
  validateBody(moderateGuestbookEntrySchema),
  asyncHandler(async (req, res) => {
    const entry = await GuestbookEntry.findByPk(req.params.id);
    if (!entry) throw AppError.notFound('Guestbook entry not found');
    res.json(await entry.update({ approved: req.body.approved }));
  }),
);

guestbookRouter.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const entry = await GuestbookEntry.findByPk(req.params.id);
    if (!entry) throw AppError.notFound('Guestbook entry not found');
    await entry.destroy();
    res.status(204).end();
  }),
);
