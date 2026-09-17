import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { ApiError } from '@/api/client';
import { chat, openChatStream, type ChatMessage } from '@/api/chat';

/** Matches the server's limit, so the input stops before a rejection does. */
export const MAX_BODY = 240;

export type ChatStatus = 'connecting' | 'live' | 'offline';

/**
 * The public chat, minus any opinion about how it looks.
 *
 * There are two ways in — the floating widget on the site and the notice board
 * in the town — and they are the same conversation. Keeping the connection,
 * the history and the send path here is what stops the two drifting apart.
 *
 * `visible` says whether the reader can currently see the messages. It only
 * drives the unread count; the stream runs either way, so a badge can count
 * what arrived while the panel was shut.
 */
export function usePublicChat(visible: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  /** Ids posted from this tab, so your own lines can sit on the right. */
  const [ownIds, setOwnIds] = useState<Set<number>>(() => new Set());
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<ChatStatus>('connecting');
  const [online, setOnline] = useState(0);
  const [error, setError] = useState('');
  const [unread, setUnread] = useState(0);

  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  useEffect(() => {
    if (visible) setUnread(0);
  }, [visible]);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((current) =>
      current.some((item) => item.id === message.id)
        ? current
        : [...current, message].slice(-120),
    );
    if (!visibleRef.current) setUnread((count) => count + 1);
  }, []);

  // History first, then the live stream. Both run regardless of visibility.
  useEffect(() => {
    let cancelled = false;

    chat
      .history()
      .then((result) => {
        if (cancelled) return;
        setMessages(result.messages);
        // Deliberately not taking result.online: the history request is sent
        // before the stream connects, so its count is already stale by the
        // time it resolves and would overwrite the live presence event.
      })
      .catch(() => {
        if (!cancelled) setStatus('offline');
      });

    const close = openChatStream({
      onMessage: appendMessage,
      onDeleted: (id) =>
        setMessages((current) => current.filter((item) => item.id !== id)),
      onPresence: setOnline,
      onStatus: setStatus,
    });

    return () => {
      cancelled = true;
      close();
    };
  }, [appendMessage]);

  const send = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const body = draft.trim();
      if (!body) return;

      setError('');
      setDraft('');
      try {
        const sent = await chat.send(body);
        setOwnIds((current) => new Set(current).add(sent.id));
        appendMessage(sent);
      } catch (cause) {
        setDraft(body); // give the text back rather than losing it
        if (cause instanceof ApiError && Array.isArray(cause.details)) {
          setError(
            (cause.details as { message: string }[])
              .map((detail) => detail.message)
              .join(' · '),
          );
        } else {
          setError(
            cause instanceof ApiError ? cause.message : 'Could not send.',
          );
        }
      }
    },
    [draft, appendMessage],
  );

  const statusLabel =
    status === 'live'
      ? `${Math.max(online, 1)} here now`
      : status === 'connecting'
        ? 'Connecting…'
        : 'Offline';

  return {
    messages,
    ownIds,
    draft,
    setDraft,
    send,
    status,
    statusLabel,
    online,
    error,
    unread,
  };
}
