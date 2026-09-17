import type { PointerEvent as ReactPointerEvent } from 'react';

interface TouchControlsProps {
  onAxis: (x: number, y: number) => void;
  onAction: () => void;
  actionLabel: string | null;
}

const DIRECTIONS = [
  { label: '▲', x: 0, y: -1, area: 'up', name: 'up' },
  { label: '◀', x: -1, y: 0, area: 'left', name: 'left' },
  { label: '▶', x: 1, y: 0, area: 'right', name: 'right' },
  { label: '▼', x: 0, y: 1, area: 'down', name: 'down' },
] as const;

/**
 * Thumb controls.
 *
 * Shown on every small screen rather than only on coarse pointers: a laptop
 * with a touchscreen reports a fine pointer, and a phone held in a desktop-mode
 * browser reports one too. The keyboard still works alongside these.
 */
export default function TouchControls({
  onAxis,
  onAction,
  actionLabel,
}: TouchControlsProps) {
  const press =
    (x: number, y: number) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      // Capture keeps the direction held if the thumb slides off the button.
      event.currentTarget.setPointerCapture(event.pointerId);
      onAxis(x, y);
    };

  const release = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onAxis(0, 0);
  };

  const pad =
    'flex h-14 w-14 touch-none select-none items-center justify-center rounded-lg border-[3px] border-[#241c17] bg-[#f2ebe3]/95 text-lg text-[#241c17] shadow-[3px_3px_0_0_#241c17] active:translate-x-[3px] active:translate-y-[3px] active:bg-[#e8a33d] active:shadow-none';

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-4 lg:hidden">
      <div
        className="pointer-events-auto grid gap-1.5"
        style={{
          gridTemplateAreas: '". up ." "left . right" ". down ."',
        }}
      >
        {DIRECTIONS.map((direction) => (
          <button
            key={direction.name}
            type="button"
            aria-label={`Move ${direction.name}`}
            style={{ gridArea: direction.area }}
            className={pad}
            onPointerDown={press(direction.x, direction.y)}
            onPointerUp={release}
            onPointerCancel={release}
            onLostPointerCapture={release}
            onContextMenu={(event) => event.preventDefault()}
          >
            <span aria-hidden="true">{direction.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onAction}
        disabled={!actionLabel}
        aria-label={
          actionLabel ? `Enter ${actionLabel}` : 'Nothing within reach'
        }
        className="pointer-events-auto flex h-20 w-20 touch-none select-none flex-col items-center justify-center rounded-full border-[3px] border-[#241c17] bg-[#e8a33d] text-[#241c17] shadow-[4px_4px_0_0_#241c17] transition-opacity active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-40"
      >
        <span aria-hidden="true" className="font-pixel text-sm leading-none">
          A
        </span>
        <span
          aria-hidden="true"
          className="mt-1 font-pixel text-[0.4rem] leading-none"
        >
          {actionLabel ? 'ENTER' : '—'}
        </span>
      </button>
    </div>
  );
}
