import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from '@/config/env';
import '@/db/models';
import { authRouter } from '@/features/auth/auth.routes';
import { bioRouter } from '@/features/bio/bio.routes';
import { expertiseRouter } from '@/features/expertise/expertise.routes';
import { chatRouter } from '@/features/chat/chat.routes';
import { githubRouter } from '@/features/github/github.routes';
import { guestbookRouter } from '@/features/guestbook/guestbook.routes';
import { projectsRouter } from '@/features/projects/projects.routes';
import { skillsRouter } from '@/features/skills/skills.routes';
import { socialsRouter } from '@/features/socials/socials.routes';
import { timelineRouter } from '@/features/timeline/timeline.routes';
import {
  errorHandler,
  notFoundHandler,
} from '@/shared/middleware/errorHandler';

export function createApp() {
  const app = express();

  // Railway and Fly sit behind a proxy; without this every client looks like
  // the same IP and the rate limiters are useless.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      // Refusing by omitting the headers lets the browser block the call.
      // Throwing here would surface as a confusing 500 instead.
      origin: (origin, callback) =>
        callback(null, !origin || env.corsOrigins.includes(origin)),
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  if (!env.isProduction) app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ ok: true, env: env.nodeEnv });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/skills', skillsRouter);
  app.use('/api/timeline', timelineRouter);
  app.use('/api/socials', socialsRouter);
  app.use('/api/expertise', expertiseRouter);
  app.use('/api/bio', bioRouter);
  app.use('/api/guestbook', guestbookRouter);
  app.use('/api/github', githubRouter);
  app.use('/api/chat', chatRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
