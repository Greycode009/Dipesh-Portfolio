import type { PointerEvent as ReactPointerEvent } from 'react';

interface TouchControlsProps {
  onAxis: (x: number, y: number) => void;
  onAction: () => void;
  actionLabel: string | null;
}

const DIRECTIONS = [
  { label: '↑', x: 0, y: -1, area: 'up' },
  { label: '←', x: -1, y: 0, area: 'left' },
  { label: '→', x: 1, y: 0, area: 'right' },
  { label: '↓', x: 0, y: 1, area: 'down' },
] as const;

/**
 * Thumb controls for touch. Hidden on pointer-fine devices, where the keyboard
 * is the better input.
 */
export default function TouchControls({
  onAxis,
  onAction,
  actionLabel,
}: TouchControlsProps) {
  const press =
    (x: number, y: number) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      onAxis(x, y);
    };

  const release = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onAxis(0, 0);
  };

  const padButton =
    'flex h-12 w-12 items-center justify-center rounded border-2 border-[#241c17] bg-surface/90 font-pixel text-xs text-content active:bg-primary active:text-on-primary';

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-4 [@media(pointer:fine)]:hidden">
      <div
        className="pointer-events-auto grid grid-cols-3 grid-rows-3 gap-1"
        style={{
          gridTemplateAreas: `". up ." "left . right" ". down ."`,
        }}
      >
        {DIRECTIONS.map((direction) => (
          <button
            key={direction.area}
            type="button"
            aria-label={`Move ${direction.area}`}
            style={{ gridArea: direction.area }}
            className={padButton}
            onPointerDown={press(direction.x, direction.y)}
            onPointerUp={release}
            onPointerCancel={release}
            onPointerLeave={release}
            onContextMenu={(event) => event.preventDefault()}
          >
            {direction.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onAction}
        disabled={!actionLabel}
        aria-label={actionLabel ? `Interact with ${actionLabel}` : 'Nothing in reach'}
        className="pointer-events-auto h-16 w-16 rounded-full border-4 border-[#241c17] bg-primary font-pixel text-[0.55rem] text-on-primary disabled:opacity-40"
      >
        {actionLabel ? 'OK' : '·'}
      </button>
    </div>
  );
}
