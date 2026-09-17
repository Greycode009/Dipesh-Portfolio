import { createHash } from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';
import { AppError } from '@/shared/errors/AppError';
import { asyncHandler } from '@/shared/middleware/asyncHandler';
import { authenticate } from '@/shared/middleware/authenticate';
import { validateBody } from '@/shared/middleware/validate';
import { ChatMessage } from './chatMessage.model';
import { postMessageSchema } from './chat.validation';
import {
  broadcast,
  heartbeat,
  postMessage,
  recentMessages,
  subscribe,
  subscriberCount,
} from './chat.service';

/**
 * Chat needs a far looser limit than the guestbook — a conversation is many
 * short messages — but still tight enough that one person cannot flood it.
 */
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'You are sending messages too quickly. Wait a moment.' },
});

/** Identifies a sender for rate limiting without storing their address. */
const hashAuthor = (ip: string) =>
  createHash('sha256').update(`${ip}:${env.jwtSecret}`).digest('hex');

export const chatRouter = Router();

chatRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json({ messages: await recentMessages(), online: subscriberCount() });
  }),
);

/** Live stream. Clients that cannot use EventSource fall back to GET above. */
chatRouter.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    // Nginx and some proxies buffer responses, which would hold messages back.
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders?.();

  const unsubscribe = subscribe(res);
  res.write(': connected\n\n');
  broadcast('presence', { online: subscriberCount() });

  const ping = setInterval(() => heartbeat(res), 25_000);

  req.on('close', () => {
    clearInterval(ping);
    unsubscribe();
    broadcast('presence', { online: subscriberCount() });
  });
});

chatRouter.post(
  '/',
  chatLimiter,
  validateBody(postMessageSchema),
  asyncHandler(async (req, res) => {
    const message = await postMessage(
      req.body.body,
      hashAuthor(req.ip ?? 'unknown'),
    );
    res.status(201).json(message);
  }),
);

chatRouter.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const message = await ChatMessage.findByPk(req.params.id);
    if (!message) throw AppError.notFound('Message not found');
    await message.destroy();
    broadcast('deleted', { id: Number(req.params.id) });
    res.status(204).end();
  }),
);
