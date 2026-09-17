import { Router } from 'express';
import type { Model, ModelStatic, Order, WhereOptions } from 'sequelize';
import type { ZodSchema } from 'zod';
import { z } from 'zod';
import { AppError } from '@/shared/errors/AppError';
import { asyncHandler } from '@/shared/middleware/asyncHandler';
import {
  authenticate,
  optionalAuthenticate,
} from '@/shared/middleware/authenticate';
import { validateBody } from '@/shared/middleware/validate';

export interface CrudOptions<M extends Model> {
  model: ModelStatic<M>;
  /** Used in error messages, e.g. "Project not found". */
  resourceName: string;
  createSchema: ZodSchema;
  updateSchema: ZodSchema;
  order?: Order;
  /**
   * Restricts what anonymous callers see — drafts stay hidden until an admin
   * token is presented.
   */
  publicWhere?: WhereOptions;
}

const reorderSchema = z.object({ ids: z.array(z.number().int()).min(1) });

/**
 * Standard REST surface for a content model: public reads, authenticated
 * writes, plus a reorder endpoint that rewrites sortOrder in one transaction.
 */
export function createCrudRouter<M extends Model>({
  model,
  resourceName,
  createSchema,
  updateSchema,
  order = [['sortOrder', 'ASC']],
  publicWhere,
}: CrudOptions<M>): Router {
  const router = Router();

  const findOrFail = async (id: string) => {
    const record = await model.findByPk(id);
    if (!record) throw AppError.notFound(`${resourceName} not found`);
    return record;
  };

  router.get(
    '/',
    optionalAuthenticate,
    asyncHandler(async (req, res) => {
      const where = req.admin ? undefined : publicWhere;
      res.json(await model.findAll({ where, order }));
    }),
  );

  router.get(
    '/:id',
    optionalAuthenticate,
    asyncHandler(async (req, res) => {
      const record = await findOrFail(req.params.id);
      res.json(record);
    }),
  );

  router.post(
    '/',
    authenticate,
    validateBody(createSchema),
    asyncHandler(async (req, res) => {
      res.status(201).json(await model.create(req.body));
    }),
  );

  router.patch(
    '/:id',
    authenticate,
    validateBody(updateSchema),
    asyncHandler(async (req, res) => {
      const record = await findOrFail(req.params.id);
      res.json(await record.update(req.body));
    }),
  );

  router.delete(
    '/:id',
    authenticate,
    asyncHandler(async (req, res) => {
      const record = await findOrFail(req.params.id);
      await record.destroy();
      res.status(204).end();
    }),
  );

  router.post(
    '/reorder',
    authenticate,
    validateBody(reorderSchema),
    asyncHandler(async (req, res) => {
      const { ids } = req.body as { ids: number[] };
      await model.sequelize!.transaction(async (transaction) => {
        await Promise.all(
          ids.map((id, index) =>
            model.update({ sortOrder: index + 1 } as never, {
              where: { id } as WhereOptions,
              transaction,
            }),
          ),
        );
      });
      res.json({ ok: true, reordered: ids.length });
    }),
  );

  return router;
}
