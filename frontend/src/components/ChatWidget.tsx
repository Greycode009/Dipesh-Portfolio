import { useEffect, useRef, useState } from 'react';
import { MAX_BODY, usePublicChat } from '@/hooks/usePublicChat';

const STORAGE_OPEN = 'chat_open';

/**
 * Floating public chat.
 *
 * Deliberately separate from the wall on the contact page: that is a message
 * people leave, this is a conversation people have.
 *
 * Fully anonymous — no names are collected or shown. The only distinction is
 * that messages you sent in this session are aligned right, tracked by id
 * locally rather than by any identity, so nothing about you is stored or
 * broadcast.
 *
 * The same conversation is reachable from the notice board in the town; both
 * read it through `usePublicChat`.
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    ownIds,
    draft,
    setDraft,
    send,
    status,
    statusLabel,
    error,
    unread,
  } = usePublicChat(isOpen);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setIsOpen(localStorage.getItem(STORAGE_OPEN) === 'true');
    } catch {
      // Not remembering is fine; it stays closed.
    }
  }, []);

  const toggle = () => {
    setIsOpen((open) => {
      const next = !open;
      try {
        localStorage.setItem(STORAGE_OPEN, String(next));
      } catch {
        // Ignore.
      }
      return next;
    });
  };

  // Keep the transcript pinned to the newest line.
  useEffect(() => {
    if (!isOpen) return;
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 print:hidden">
      {isOpen && (
        <section
          aria-label="Public chat"
          className="nb-box nb-shadow-lg flex h-[26rem] w-[min(21rem,calc(100vw-2rem))] flex-col overflow-hidden bg-surface"
        >
          <header className="flex items-center justify-between gap-2 border-b-[3px] border-border bg-primary px-4 py-3 text-on-primary">
            <div className="min-w-0">
              <p className="font-display text-sm uppercase leading-none">
                Public chat
              </p>
              <p className="mt-1 flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-wider opacity-90">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${
                    status === 'live' ? 'bg-on-primary' : 'bg-on-primary/40'
                  }`}
                />
                {statusLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label="Close chat"
              className="nb-box flex h-8 w-8 shrink-0 items-center justify-center bg-surface text-content"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-background p-4"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-muted">
                {status === 'offline'
                  ? 'Chat is offline right now.'
                  : 'No messages yet. Say hello.'}
              </p>
            )}

            {messages.map((message) => {
              const mine = ownIds.has(message.id);
              return (
                <div
                  key={message.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <p
                    className={`nb-box max-w-[85%] break-words px-3 py-2 text-sm font-medium ${
                      mine ? 'bg-primary text-on-primary' : 'bg-surface'
                    }`}
                  >
                    {message.body}
                  </p>
                </div>
              );
            })}
          </div>

          {error && (
            <p
              role="alert"
              className="border-t-[3px] border-border bg-primary px-4 py-2 text-xs font-bold text-on-primary"
            >
              {error}
            </p>
          )}

          <form
            onSubmit={send}
            className="flex items-center gap-2 border-t-[3px] border-border bg-surface p-3"
          >
            <input
              value={draft}
              onChange={(event) =>
                setDraft(event.target.value.slice(0, MAX_BODY))
              }
              placeholder={
                status === 'offline' ? 'Chat unavailable' : 'Message…'
              }
              disabled={status === 'offline'}
              aria-label="Your message"
              className="nb-box min-w-0 flex-1 bg-background px-3 py-2 text-sm font-medium outline-none placeholder:text-muted/70 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!draft.trim() || status === 'offline'}
              className="nb-box nb-press shrink-0 bg-primary px-3 py-2 text-sm font-extrabold uppercase text-on-primary disabled:opacity-40"
            >
              Send
            </button>
          </form>

          <p className="border-t-[3px] border-border bg-surface px-4 py-2 font-mono text-[0.6rem] uppercase tracking-wider text-muted">
            Anonymous · no names, no accounts
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close public chat' : 'Open public chat'}
        className="nb-box nb-shadow nb-press relative flex h-14 items-center gap-2 bg-primary px-5 text-on-primary"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          {isOpen ? '✕' : '💬'}
        </span>
        <span className="font-display text-sm uppercase leading-none">
          {isOpen ? 'Close' : 'Chat'}
        </span>
        {!isOpen && unread > 0 && (
          <span className="nb-box absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center bg-surface px-1 font-mono text-[0.65rem] font-bold text-content">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </div>
  );
}
