import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '@/shared/middleware/asyncHandler';
import { authenticate } from '@/shared/middleware/authenticate';
import { validateBody } from '@/shared/middleware/validate';
import { previewRepoSchema } from './github.validation';
import { previewProjectFromRepo, syncRepoStats } from './github.service';

/** GitHub's own rate limit is the real constraint; this protects our budget. */
const githubLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Slow down — too many GitHub lookups.' },
});

export const githubRouter = Router();

githubRouter.post(
  '/preview',
  authenticate,
  githubLimiter,
  validateBody(previewRepoSchema),
  asyncHandler(async (req, res) => {
    res.json(await previewProjectFromRepo(req.body.repo));
  }),
);

githubRouter.post(
  '/sync-stats',
  authenticate,
  githubLimiter,
  asyncHandler(async (_req, res) => {
    res.json({ results: await syncRepoStats() });
  }),
);
