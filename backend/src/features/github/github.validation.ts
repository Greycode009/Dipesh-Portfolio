import { z } from 'zod';

export const previewRepoSchema = z.object({
  /** "owner/name", or any github.com URL pointing at the repository. */
  repo: z.string().trim().min(1),
});
