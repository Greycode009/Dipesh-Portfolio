import { useEffect, useRef, type ReactNode } from 'react';

interface PanelProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** The in-world window every interaction opens. Escape and the X both close. */
export default function Panel({ title, onClose, children }: PanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-3 sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-lg border-4 border-[#241c17] bg-surface shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b-4 border-[#241c17] bg-primary px-4 py-3">
          <h2 className="font-pixel text-[0.6rem] leading-relaxed text-on-primary sm:text-xs">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 border-[#241c17] bg-surface font-pixel text-[0.55rem] text-content transition-transform hover:scale-110"
          >
            X
          </button>
        </header>

        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
