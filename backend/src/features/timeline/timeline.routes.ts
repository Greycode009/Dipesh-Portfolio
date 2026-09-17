import { createCrudRouter } from '@/shared/crud/createCrudRouter';
import { TimelineEntry } from './timelineEntry.model';
import {
  createTimelineEntrySchema,
  updateTimelineEntrySchema,
} from './timeline.validation';

export const timelineRouter = createCrudRouter({
  model: TimelineEntry,
  resourceName: 'Timeline entry',
  createSchema: createTimelineEntrySchema,
  updateSchema: updateTimelineEntrySchema,
});
