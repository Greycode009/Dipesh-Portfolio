import type { Response } from 'express';
import { ChatMessage } from './chatMessage.model';

/** How much history a client gets when it opens the chat. */
export const HISTORY_LIMIT = 60;

/**
 * Rows kept in the table. The chat is a conversation, not an archive, and an
 * unbounded public table on a free-tier database is a liability.
 */
const RETAIN_ROWS = 300;

type Subscriber = Response;

/**
 * Connected listeners. Server-sent events rather than WebSockets: the chat
 * only needs server-to-client push (sending is a normal POST), and SSE is
 * plain HTTP, so it survives proxies and needs no extra dependency.
 */
const subscribers = new Set<Subscriber>();

export function subscribe(res: Subscriber) {
  subscribers.add(res);
  return () => subscribers.delete(res);
}

export const subscriberCount = () => subscribers.size;

function send(res: Subscriber, event: string, data: unknown) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

export function broadcast(event: string, data: unknown) {
  for (const res of subscribers) {
    try {
      send(res, event, data);
    } catch {
      // A dead connection is dropped on its own 'close' handler; ignore here.
    }
  }
}

/** Keeps proxies from closing an idle stream, and lets clients notice drops. */
export function heartbeat(res: Subscriber) {
  res.write(': ping\n\n');
}

export async function recentMessages() {
  const rows = await ChatMessage.findAll({
    order: [['id', 'DESC']],
    limit: HISTORY_LIMIT,
  });
  return rows.reverse(); // oldest first, the way a transcript reads
}

export async function postMessage(body: string, authorHash: string) {
  const message = await ChatMessage.create({ body, authorHash });
  broadcast('message', message.toJSON());
  void prune();
  return message;
}

/** Trims the table back to RETAIN_ROWS, oldest first. */
async function prune() {
  const total = await ChatMessage.count();
  if (total <= RETAIN_ROWS) return;

  const excess = await ChatMessage.findAll({
    order: [['id', 'ASC']],
    limit: total - RETAIN_ROWS,
    attributes: ['id'],
  });

  await ChatMessage.destroy({
    where: { id: excess.map((row) => row.id) },
  });
}
