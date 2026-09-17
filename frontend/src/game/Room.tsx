import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { bio } from '@/content/bio';
import { CANVAS_HEIGHT, CANVAS_WIDTH, TownGame } from './engine';
import { SPAWN, type Interactable } from './townMap';
import TouchControls from './ui/TouchControls';
import {
  AboutPanel,
  CatPanel,
  ContactPanel,
  ProjectPanel,
  SignPanel,
  SkillsPanel,
} from './ui/panels';

export default function Room() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<TownGame | null>(null);

  const [nearby, setNearby] = useState<Interactable | null>(null);
  const [open, setOpen] = useState<Interactable | null>(null);

  // The town is a side trip, so it does not drive the URL.
  const handleInteract = useCallback((item: Interactable) => setOpen(item), []);
  const interactRef = useRef(handleInteract);
  interactRef.current = handleInteract;

  // The pixel font is only needed here, so it is not in the document head.
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new TownGame(canvas, {
      onNearbyChange: setNearby,
      onInteract: (item) => interactRef.current(item),
    });
    gameRef.current = game;
    if (import.meta.env.DEV) {
      (window as unknown as { __town?: TownGame }).__town = game;
    }

    game.spawnAt(SPAWN.x, SPAWN.y);
    game.start();

    return () => {
      game.stop();
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    gameRef.current?.setPaused(open !== null);
  }, [open]);

  const closePanel = useCallback(() => setOpen(null), []);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#14110f]">
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="font-pixel text-[0.55rem] text-[#e8a33d] sm:text-[0.7rem]">
          {bio.name.split(' ')[0]}&apos;s town
        </p>
        <Link
          to="/"
          className="border-2 border-[#f2ebe3] px-3 py-1.5 font-pixel text-[0.5rem] text-[#f2ebe3] transition-colors hover:bg-[#f2ebe3] hover:text-[#14110f]"
        >
          BACK TO SITE
        </Link>
      </header>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-28 lg:pb-6">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          aria-label="A pixel town. Use the arrow keys to walk and E to go inside."
          className="h-auto w-full max-w-5xl rounded border-4 border-[#241c17]"
          style={{ imageRendering: 'pixelated', aspectRatio: '24 / 16' }}
        />

        {nearby && !open && (
          <p className="pointer-events-none absolute bottom-32 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border-2 border-[#241c17] bg-[#f2ebe3]/95 px-3 py-2 font-pixel text-[0.5rem] text-[#241c17] lg:bottom-10">
            <span className="text-[#b8483c]">E</span> · {nearby.label}
          </p>
        )}

        <TouchControls
          onAxis={(x, y) => gameRef.current?.setAxis(x, y)}
          onAction={() => gameRef.current?.pressAction()}
          actionLabel={nearby?.label ?? null}
        />
      </div>

      <p className="hidden pb-4 text-center font-pixel text-[0.45rem] leading-relaxed text-[#a99c90] lg:block">
        ARROWS / WASD TO WALK · E TO ENTER
      </p>

      {open?.kind === 'project' && open.projectId !== undefined && (
        <ProjectPanel projectId={open.projectId} onClose={closePanel} />
      )}
      {open?.kind === 'skills' && <SkillsPanel onClose={closePanel} />}
      {open?.kind === 'about' && <AboutPanel onClose={closePanel} />}
      {open?.kind === 'contact' && <ContactPanel onClose={closePanel} />}
      {open?.kind === 'cat' && <CatPanel onClose={closePanel} />}
      {open?.kind === 'sign' && <SignPanel onClose={closePanel} />}
    </div>
  );
}
