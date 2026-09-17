import {
  ROOM_HEIGHT,
  ROOM_WIDTH,
  interactableAt,
  interactables,
  isSolid,
  props,
  terrainAt,
  type Interactable,
} from './roomMap';
import { loadSprites, type Facing, type Sprite } from './sprites';

const TILE = 16;
export const CANVAS_WIDTH = ROOM_WIDTH * TILE;
export const CANVAS_HEIGHT = ROOM_HEIGHT * TILE;

const WALK_SPEED = 64; // pixels per second
const FRAME_TIME = 0.16; // seconds per walk frame

/** The character's feet, relative to its 16x16 sprite. Only this collides. */
const FEET = { left: 4, right: 12, top: 11, bottom: 16 };

export interface GameCallbacks {
  /** Fires when the object the character could interact with changes. */
  onNearbyChange: (item: Interactable | null) => void;
  onInteract: (item: Interactable) => void;
}

export class RoomGame {
  private readonly context: CanvasRenderingContext2D;
  private readonly sprites = loadSprites();

  private x = 12 * TILE;
  private y = 7 * TILE;
  private facing: Facing = 'down';
  private animationTime = 0;
  private isMoving = false;

  /** -1, 0 or 1 on each axis. Set by keyboard and by the on-screen pad. */
  private axis = { x: 0, y: 0 };
  private readonly heldKeys = new Set<string>();

  private nearby: Interactable | null = null;
  private paused = false;
  private rafId = 0;
  private lastTime = 0;

  constructor(
    canvas: HTMLCanvasElement,
    private readonly callbacks: GameCallbacks,
  ) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D canvas context unavailable');
    context.imageSmoothingEnabled = false;
    this.context = context;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  start() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.releaseAll);
    // Switching tabs mid-stride would otherwise leave the key held.
    document.addEventListener('visibilitychange', this.releaseAll);
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.releaseAll);
    document.removeEventListener('visibilitychange', this.releaseAll);
    cancelAnimationFrame(this.rafId);
  }

  /** Movement stops while a panel is open, but the room keeps rendering. */
  setPaused(paused: boolean) {
    this.paused = paused;
    if (paused) this.releaseAll();
  }

  spawnAt(tileX: number, tileY: number) {
    this.x = tileX * TILE;
    this.y = tileY * TILE;
    this.updateNearby();
  }

  /** On-screen d-pad. */
  setAxis(x: number, y: number) {
    this.axis = { x, y };
  }

  /** Development aid: lets tests read the character's state. */
  get debugState() {
    return {
      tile: this.feetTile,
      pixel: { x: Math.round(this.x), y: Math.round(this.y) },
      facing: this.facing,
      moving: this.isMoving,
      paused: this.paused,
      held: [...this.heldKeys],
      axis: this.axis,
      nearby: this.nearby?.id ?? null,
    };
  }

  /** On-screen action button. */
  pressAction() {
    if (this.nearby) this.callbacks.onInteract(this.nearby);
  }

  // ------------------------------------------------------------- input

  /** True while the visitor is typing, so the room ignores their keystrokes. */
  private static isTyping(target: EventTarget | null): boolean {
    const element = target as HTMLElement | null;
    if (!element?.tagName) return false;
    return (
      ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(element.tagName) ||
      element.isContentEditable
    );
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (RoomGame.isTyping(event.target)) return;

    const key = event.key.toLowerCase();

    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      event.preventDefault(); // stop the page scrolling under the room
    }

    if (key === 'e' || key === 'enter' || key === ' ') {
      // Auto-repeat would re-open the panel the moment it closed.
      if (!event.repeat && !this.paused) this.pressAction();
      return;
    }

    this.heldKeys.add(key);
  };

  private onKeyUp = (event: KeyboardEvent) => {
    this.heldKeys.delete(event.key.toLowerCase());
  };

  private releaseAll = () => {
    this.heldKeys.clear();
    this.axis = { x: 0, y: 0 };
  };

  private readAxis(): { x: number; y: number } {
    const held = this.heldKeys;
    const x =
      (held.has('arrowright') || held.has('d') ? 1 : 0) -
      (held.has('arrowleft') || held.has('a') ? 1 : 0);
    const y =
      (held.has('arrowdown') || held.has('s') ? 1 : 0) -
      (held.has('arrowup') || held.has('w') ? 1 : 0);

    // The on-screen pad wins only when no key is held.
    if (x === 0 && y === 0) return this.axis;
    return { x, y };
  }

  // ------------------------------------------------------------- movement

  private canStandAt(x: number, y: number): boolean {
    const left = Math.floor((x + FEET.left) / TILE);
    const right = Math.floor((x + FEET.right - 1) / TILE);
    const top = Math.floor((y + FEET.top) / TILE);
    const bottom = Math.floor((y + FEET.bottom - 1) / TILE);

    for (let tileY = top; tileY <= bottom; tileY += 1) {
      for (let tileX = left; tileX <= right; tileX += 1) {
        if (isSolid(tileX, tileY)) return false;
      }
    }
    return true;
  }

  private move(delta: number) {
    const { x: axisX, y: axisY } = this.readAxis();
    this.isMoving = axisX !== 0 || axisY !== 0;

    if (!this.isMoving) {
      this.animationTime = 0;
      return;
    }

    // Face the dominant axis, preferring horizontal so diagonals read clearly.
    if (axisX !== 0) this.facing = axisX > 0 ? 'right' : 'left';
    else if (axisY !== 0) this.facing = axisY > 0 ? 'down' : 'up';

    // Normalise diagonals so corner-cutting is not faster.
    const scale = axisX !== 0 && axisY !== 0 ? Math.SQRT1_2 : 1;
    const step = WALK_SPEED * delta * scale;

    // Axes are resolved separately so sliding along a wall still works.
    const nextX = this.x + axisX * step;
    if (axisX !== 0 && this.canStandAt(nextX, this.y)) this.x = nextX;

    const nextY = this.y + axisY * step;
    if (axisY !== 0 && this.canStandAt(this.x, nextY)) this.y = nextY;

    this.animationTime += delta;
  }

  private get feetTile() {
    return {
      x: Math.floor((this.x + TILE / 2) / TILE),
      y: Math.floor((this.y + TILE - 1) / TILE),
    };
  }

  private updateNearby() {
    const { x, y } = this.feetTile;
    const ahead = {
      down: { x, y: y + 1 },
      up: { x, y: y - 1 },
      left: { x: x - 1, y },
      right: { x: x + 1, y },
    }[this.facing];

    const found =
      interactableAt(ahead.x, ahead.y) ??
      // Tall objects are entered from below, so also check one further up.
      (this.facing === 'up' ? interactableAt(ahead.x, ahead.y - 1) : null);

    if (found?.id !== this.nearby?.id) {
      this.nearby = found;
      this.callbacks.onNearbyChange(found);
    }
  }

  // ------------------------------------------------------------- rendering

  private drawSprite(sprite: Sprite, x: number, y: number) {
    this.context.drawImage(sprite.canvas, Math.round(x), Math.round(y));
  }

  private render() {
    const { tiles, player } = this.sprites;

    for (let y = 0; y < ROOM_HEIGHT; y += 1) {
      for (let x = 0; x < ROOM_WIDTH; x += 1) {
        const kind = terrainAt(x, y);
        const tile =
          kind === 'wall'
            ? tiles.wall
            : kind === 'wallBase'
              ? tiles.wallBase
              : kind === 'rug'
                ? tiles.rug
                : tiles.floor;
        this.drawSprite(tile, x * TILE, y * TILE);
      }
    }

    // Wall scenery sits behind everything that stands on the floor.
    for (const prop of props.filter((item) => !item.solid)) {
      this.drawSprite(
        tiles[prop.sprite],
        prop.x * TILE,
        prop.y * TILE - prop.lift,
      );
    }

    // Everything on the floor is drawn back to front so the character can
    // walk in front of and behind furniture.
    const standing: { y: number; draw: () => void }[] = [
      ...interactables.map((item) => ({
        y: item.y,
        draw: () =>
          this.drawSprite(
            tiles[item.sprite],
            item.x * TILE,
            item.y * TILE - item.lift,
          ),
      })),
      ...props
        .filter((item) => item.solid)
        .map((prop) => ({
          y: prop.y,
          draw: () =>
            this.drawSprite(
              tiles[prop.sprite],
              prop.x * TILE,
              prop.y * TILE - prop.lift,
            ),
        })),
      {
        y: this.feetTile.y,
        draw: () => {
          const frame =
            this.isMoving && Math.floor(this.animationTime / FRAME_TIME) % 2
              ? 1
              : 0;
          this.drawSprite(player[this.facing][frame], this.x, this.y);
        },
      },
    ];

    standing.sort((a, b) => a.y - b.y);
    for (const item of standing) item.draw();

    // A soft marker over whatever is in reach.
    if (this.nearby) {
      const bob = Math.sin(performance.now() / 220) * 1.5;
      this.context.fillStyle = '#f7c46b';
      this.context.fillRect(
        this.nearby.x * TILE + 7,
        Math.round(this.nearby.y * TILE - this.nearby.lift - 6 + bob),
        2,
        4,
      );
    }
  }

  private tick = (now: number) => {
    const delta = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    if (!this.paused) {
      this.move(delta);
      this.updateNearby();
    }
    this.render();

    this.rafId = requestAnimationFrame(this.tick);
  };
}
