import { createCrudRouter } from '@/shared/crud/createCrudRouter';
import { Social } from './social.model';
import { createSocialSchema, updateSocialSchema } from './socials.validation';

export const socialsRouter = createCrudRouter({
  model: Social,
  resourceName: 'Social link',
  createSchema: createSocialSchema,
  updateSchema: updateSocialSchema,
});
