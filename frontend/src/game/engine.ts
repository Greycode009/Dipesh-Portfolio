import {
  MAP_HEIGHT,
  MAP_WIDTH,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  buildings,
  groundAt,
  interactableAt,
  isSolid,
  props,
  type Interactable,
} from './townMap';
import { TILE, loadSprites, type Facing, type Sprite } from './sprites';

export const CANVAS_WIDTH = VIEW_WIDTH * TILE;
export const CANVAS_HEIGHT = VIEW_HEIGHT * TILE;

const WALK_SPEED = 62; // pixels per second
const FRAME_TIME = 0.16;

/** The character's feet, relative to its 16x16 sprite. Only this collides. */
const FEET = { left: 4, right: 12, top: 11, bottom: 16 };

export interface GameCallbacks {
  onNearbyChange: (item: Interactable | null) => void;
  onInteract: (item: Interactable) => void;
}

export class TownGame {
  private readonly context: CanvasRenderingContext2D;
  private readonly sprites = loadSprites();

  private x = 0;
  private y = 0;
  private facing: Facing = 'down';
  private animationTime = 0;
  private isMoving = false;

  /** Camera position in pixels — top-left of the visible window. */
  private cameraX = 0;
  private cameraY = 0;

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

  setPaused(paused: boolean) {
    this.paused = paused;
    if (paused) this.releaseAll();
  }

  spawnAt(tileX: number, tileY: number) {
    this.x = tileX * TILE;
    this.y = tileY * TILE;
    this.centreCamera();
    this.updateNearby();
  }

  setAxis(x: number, y: number) {
    this.axis = { x, y };
  }

  pressAction() {
    if (this.nearby) this.callbacks.onInteract(this.nearby);
  }

  get debugState() {
    return {
      tile: this.feetTile,
      pixel: { x: Math.round(this.x), y: Math.round(this.y) },
      camera: { x: Math.round(this.cameraX), y: Math.round(this.cameraY) },
      facing: this.facing,
      moving: this.isMoving,
      paused: this.paused,
      held: [...this.heldKeys],
      nearby: this.nearby?.id ?? null,
    };
  }

  // --------------------------------------------------------------- input

  private static isTyping(target: EventTarget | null): boolean {
    const element = target as HTMLElement | null;
    if (!element?.tagName) return false;
    return (
      ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(element.tagName) ||
      element.isContentEditable
    );
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (TownGame.isTyping(event.target)) return;
    const key = event.key.toLowerCase();

    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      event.preventDefault();
    }

    if (key === 'e' || key === 'enter' || key === ' ') {
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

  private readAxis() {
    const held = this.heldKeys;
    const x =
      (held.has('arrowright') || held.has('d') ? 1 : 0) -
      (held.has('arrowleft') || held.has('a') ? 1 : 0);
    const y =
      (held.has('arrowdown') || held.has('s') ? 1 : 0) -
      (held.has('arrowup') || held.has('w') ? 1 : 0);

    // The on-screen pad only applies when no key is held.
    if (x === 0 && y === 0) return this.axis;
    return { x, y };
  }

  // ------------------------------------------------------------ movement

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

    if (axisX !== 0) this.facing = axisX > 0 ? 'right' : 'left';
    else if (axisY !== 0) this.facing = axisY > 0 ? 'down' : 'up';

    // Normalise diagonals so cutting a corner is not faster.
    const scale = axisX !== 0 && axisY !== 0 ? Math.SQRT1_2 : 1;
    const step = WALK_SPEED * delta * scale;

    // Axes resolve separately, so the character slides along walls.
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

    const found = interactableAt(ahead.x, ahead.y);
    if (found?.id !== this.nearby?.id) {
      this.nearby = found;
      this.callbacks.onNearbyChange(found);
    }
  }

  // -------------------------------------------------------------- camera

  private cameraTarget() {
    const maxX = MAP_WIDTH * TILE - CANVAS_WIDTH;
    const maxY = MAP_HEIGHT * TILE - CANVAS_HEIGHT;
    return {
      x: Math.max(0, Math.min(maxX, this.x + TILE / 2 - CANVAS_WIDTH / 2)),
      y: Math.max(0, Math.min(maxY, this.y + TILE / 2 - CANVAS_HEIGHT / 2)),
    };
  }

  private centreCamera() {
    const target = this.cameraTarget();
    this.cameraX = target.x;
    this.cameraY = target.y;
  }

  /** Eases toward the target so the view does not snap on every step. */
  private followCamera(delta: number) {
    const target = this.cameraTarget();
    const ease = 1 - 0.0001 ** delta;
    this.cameraX += (target.x - this.cameraX) * ease;
    this.cameraY += (target.y - this.cameraY) * ease;
  }

  // ------------------------------------------------------------ rendering

  private draw(sprite: Sprite, x: number, y: number) {
    this.context.drawImage(
      sprite.canvas,
      Math.round(x - this.cameraX),
      Math.round(y - this.cameraY),
    );
  }

  private render() {
    const { ground, props: propSprites, houses, player } = this.sprites;

    // Only the tiles under the camera window, plus one for partial tiles.
    const firstX = Math.max(0, Math.floor(this.cameraX / TILE));
    const firstY = Math.max(0, Math.floor(this.cameraY / TILE));
    const lastX = Math.min(MAP_WIDTH - 1, firstX + VIEW_WIDTH + 1);
    const lastY = Math.min(MAP_HEIGHT - 1, firstY + VIEW_HEIGHT + 1);

    for (let y = firstY; y <= lastY; y += 1) {
      for (let x = firstX; x <= lastX; x += 1) {
        this.draw(ground[groundAt(x, y)], x * TILE, y * TILE);
      }
    }

    // Everything standing on the ground is painted back to front, so the
    // character can walk behind a house and in front of a fence.
    const layers: { sortY: number; paint: () => void }[] = [];

    for (const building of buildings) {
      const parts = houses[building.roof];
      const doorIndex = Math.floor(building.width / 2);
      layers.push({
        sortY: building.y + 2,
        paint: () => {
          for (let i = 0; i < building.width; i += 1) {
            const px = (building.x + i) * TILE;
            const roof =
              i === 0
                ? parts.roofLeft
                : i === building.width - 1
                  ? parts.roofRight
                  : parts.roofMid;
            this.draw(roof, px, building.y * TILE);
            this.draw(
              i % 2 === 1 ? parts.wallWindow : parts.wall,
              px,
              (building.y + 1) * TILE,
            );
            this.draw(
              i === doorIndex ? parts.wallDoor : parts.wall,
              px,
              (building.y + 2) * TILE,
            );
          }
        },
      });
    }

    for (const prop of props) {
      layers.push({
        sortY: prop.y,
        paint: () => {
          // Trees are two tiles tall: the canopy sits on the tile above.
          if (prop.name === 'treeBottom') {
            this.draw(propSprites.treeTop, prop.x * TILE, (prop.y - 1) * TILE);
          }
          this.draw(
            propSprites[prop.name],
            prop.x * TILE,
            prop.y * TILE - (prop.lift ?? 0),
          );
        },
      });
    }

    layers.push({
      sortY: this.feetTile.y,
      paint: () => {
        const frame =
          this.isMoving && Math.floor(this.animationTime / FRAME_TIME) % 2
            ? 1
            : 0;
        this.draw(player[this.facing][frame], this.x, this.y);
      },
    });

    layers.sort((a, b) => a.sortY - b.sortY);
    for (const layer of layers) layer.paint();

    if (this.nearby) {
      const bob = Math.sin(performance.now() / 220) * 1.5;
      this.context.fillStyle = '#f7c46b';
      this.context.fillRect(
        Math.round(this.nearby.x * TILE + 7 - this.cameraX),
        Math.round(this.nearby.y * TILE - 8 + bob - this.cameraY),
        2,
        5,
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
    this.followCamera(delta);
    this.render();

    this.rafId = requestAnimationFrame(this.tick);
  };
}
