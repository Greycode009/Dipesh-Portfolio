import { createCrudRouter } from '@/shared/crud/createCrudRouter';
import { Expertise } from './expertise.model';
import {
  createExpertiseSchema,
  updateExpertiseSchema,
} from './expertise.validation';

export const expertiseRouter = createCrudRouter({
  model: Expertise,
  resourceName: 'Expertise card',
  createSchema: createExpertiseSchema,
  updateSchema: updateExpertiseSchema,
});
