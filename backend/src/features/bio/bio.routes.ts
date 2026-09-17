import { Router } from 'express';
import { AppError } from '@/shared/errors/AppError';
import { asyncHandler } from '@/shared/middleware/asyncHandler';
import { authenticate } from '@/shared/middleware/authenticate';
import { validateBody } from '@/shared/middleware/validate';
import { Bio } from './bio.model';
import { updateBioSchema } from './bio.validation';

export const bioRouter = Router();

/** Bio is a singleton, so it has no id in its routes. */
async function getBioOrFail(): Promise<Bio> {
  const bio = await Bio.findByPk(1);
  if (!bio) throw AppError.notFound('Bio has not been seeded yet');
  return bio;
}

bioRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json(await getBioOrFail());
  }),
);

bioRouter.patch(
  '/',
  authenticate,
  validateBody(updateBioSchema),
  asyncHandler(async (req, res) => {
    const bio = await getBioOrFail();
    res.json(await bio.update(req.body));
  }),
);
