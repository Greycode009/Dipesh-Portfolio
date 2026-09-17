import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bio } from '@/content/bio';
import { CANVAS_HEIGHT, CANVAS_WIDTH, RoomGame } from './engine';
import { spawnFor, type Interactable } from './roomMap';
import TouchControls from './ui/TouchControls';
import {
  AboutPanel,
  CatPanel,
  ContactPanel,
  ProjectPanel,
  SkillsPanel,
} from './ui/panels';

interface RoomProps {
  /** Lets the visitor drop back to the readable pages. */
  onExit: () => void;
}

export default function Room({ onExit }: RoomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<RoomGame | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [nearby, setNearby] = useState<Interactable | null>(null);
  const [open, setOpen] = useState<Interactable | null>(null);

  const handleInteract = useCallback(
    (item: Interactable) => {
      setOpen(item);
      if (item.route && item.route !== pathname) {
        navigate(item.route, { replace: true });
      }
    },
    [navigate, pathname],
  );

  // The engine keeps whatever callback it was built with, so route it through
  // a ref rather than letting it capture a stale pathname.
  const interactRef = useRef(handleInteract);
  useEffect(() => {
    interactRef.current = handleInteract;
  }, [handleInteract]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new RoomGame(canvas, {
      onNearbyChange: setNearby,
      onInteract: (item) => interactRef.current(item),
    });
    gameRef.current = game;
    if (import.meta.env.DEV) {
      (window as unknown as { __room?: RoomGame }).__room = game;
    }

    const spawn = spawnFor(window.location.pathname);
    game.spawnAt(spawn.x, spawn.y);
    game.start();

    return () => {
      game.stop();
      gameRef.current = null;
    };
    // Deliberately mounts once: re-creating the game on navigation would
    // teleport the character mid-walk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the engine's callback current without restarting the game.
  useEffect(() => {
    const game = gameRef.current;
    if (game) game.setPaused(open !== null);
  }, [open]);

  const closePanel = useCallback(() => {
    setOpen(null);
    if (pathname !== '/') navigate('/', { replace: true });
  }, [navigate, pathname]);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0d0a08]">
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="font-pixel text-[0.55rem] text-primary sm:text-[0.7rem]">
          {bio.name}
        </p>
        <button
          type="button"
          onClick={onExit}
          className="rounded border-2 border-border px-3 py-1.5 font-pixel text-[0.5rem] text-muted transition-colors hover:border-primary hover:text-primary"
        >
          READ AS A PAGE
        </button>
      </header>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-24 sm:pb-6">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          aria-label="A pixel room. Use the arrow keys to walk and E to interact."
          className="h-auto w-full max-w-5xl rounded border-4 border-[#241c17]"
          style={{ imageRendering: 'pixelated', aspectRatio: '24 / 16' }}
        />

        {nearby && !open && (
          <p className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 rounded border-2 border-[#241c17] bg-surface/95 px-3 py-2 font-pixel text-[0.5rem] sm:bottom-10">
            <span className="text-primary">E</span> · {nearby.label}
          </p>
        )}

        <TouchControls
          onAxis={(x, y) => gameRef.current?.setAxis(x, y)}
          onAction={() => gameRef.current?.pressAction()}
          actionLabel={nearby?.label ?? null}
        />
      </div>

      <p className="pb-4 text-center font-pixel text-[0.45rem] leading-relaxed text-muted [@media(pointer:coarse)]:hidden">
        ARROWS / WASD TO WALK · E TO INTERACT
      </p>

      {open?.kind === 'project' && open.projectId !== undefined && (
        <ProjectPanel projectId={open.projectId} onClose={closePanel} />
      )}
      {open?.kind === 'skills' && <SkillsPanel onClose={closePanel} />}
      {open?.kind === 'about' && <AboutPanel onClose={closePanel} />}
      {open?.kind === 'contact' && <ContactPanel onClose={closePanel} />}
      {open?.kind === 'cat' && <CatPanel onClose={closePanel} />}
    </div>
  );
}
