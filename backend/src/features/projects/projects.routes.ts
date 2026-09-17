import { createCrudRouter } from '@/shared/crud/createCrudRouter';
import { Project } from './project.model';
import {
  createProjectSchema,
  updateProjectSchema,
} from './projects.validation';

export const projectsRouter = createCrudRouter({
  model: Project,
  resourceName: 'Project',
  createSchema: createProjectSchema,
  updateSchema: updateProjectSchema,
  publicWhere: { status: 'published' },
});
