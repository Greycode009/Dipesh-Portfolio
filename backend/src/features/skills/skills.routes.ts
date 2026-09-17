import { createCrudRouter } from '@/shared/crud/createCrudRouter';
import { Skill } from './skill.model';
import { createSkillSchema, updateSkillSchema } from './skills.validation';

export const skillsRouter = createCrudRouter({
  model: Skill,
  resourceName: 'Skill',
  createSchema: createSkillSchema,
  updateSchema: updateSkillSchema,
});
