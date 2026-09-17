import { apiUrl, request } from './client';

export interface ChatMessage {
  id: number;
  body: string;
  createdAt: string;
}

export const chat = {
  history: () =>
    request<{ messages: ChatMessage[]; online: number }>('/api/chat'),
  send: (body: string) =>
    request<ChatMessage>('/api/chat', { method: 'POST', body: { body } }),
};

export interface ChatStreamHandlers {
  onMessage: (message: ChatMessage) => void;
  onDeleted: (id: number) => void;
  onPresence: (online: number) => void;
  onStatus: (status: 'live' | 'offline') => void;
}

/**
 * Subscribes to the live feed. Returns a function that closes it.
 *
 * EventSource reconnects on its own after a drop, so this only reports the
 * status change rather than trying to manage retries.
 */
export function openChatStream(handlers: ChatStreamHandlers): () => void {
  let source: EventSource | null = null;

  try {
    source = new EventSource(apiUrl('/api/chat/stream'));
  } catch {
    handlers.onStatus('offline');
    return () => {};
  }

  source.addEventListener('open', () => handlers.onStatus('live'));
  source.addEventListener('error', () => handlers.onStatus('offline'));

  source.addEventListener('message', (event) => {
    handlers.onStatus('live');
    handlers.onMessage(JSON.parse((event as MessageEvent).data));
  });

  source.addEventListener('deleted', (event) => {
    handlers.onDeleted(JSON.parse((event as MessageEvent).data).id);
  });

  source.addEventListener('presence', (event) => {
    handlers.onPresence(JSON.parse((event as MessageEvent).data).online);
  });

  return () => source?.close();
}
