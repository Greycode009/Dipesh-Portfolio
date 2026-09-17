import { PALETTE } from './palette';

/**
 * Sprites are authored as grids of palette characters — one character per
 * pixel, '.' for transparent. They are rasterised to offscreen canvases once
 * at startup and then blitted, so there is no image loading and nothing to
 * license.
 *
 * Every row in a grid must be the same length.
 */
export type PixelGrid = readonly string[];

const TILE = 16;

// ---------------------------------------------------------------- terrain

const FLOOR: PixelGrid = [
  'wwwwwwwwwwwwwwww',
  'WWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWW',
  'WWWxWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWxWWWW',
  'WWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWW',
  'wwwwwwwwwwwwwwww',
  'WWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWW',
  'WWWWWWWxWWWWWWWW',
  'WWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWWWW',
];

const WALL: PixelGrid = [
  'uuuuuuuuuuuuuuuu',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVuVVVVVVVVuVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVuVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVuVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVuVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
];

/** Bottom course of wall: skirting board plus the shadow it casts. */
const WALL_BASE: PixelGrid = [
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVuVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVuVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'VVVVVVVVVVVVVVVV',
  'uuuuuuuuuuuuuuuu',
  'kkkkkkkkkkkkkkkk',
  'hhhhhhhhhhhhhhhh',
];

const RUG: PixelGrid = [
  'rrrrrrrrrrrrrrrr',
  'rRRRRRRRRRRRRRRr',
  'rRrrrrrrrrrrrrRr',
  'rRrRRRRRRRRRRrRr',
  'rRrRrrrrrrrrRrRr',
  'rRrRrRRRRRRrRrRr',
  'rRrRrRrrrrRrRrRr',
  'rRrRrRrRRrRrRrRr',
  'rRrRrRrRRrRrRrRr',
  'rRrRrRrrrrRrRrRr',
  'rRrRrRRRRRRrRrRr',
  'rRrRrrrrrrrrRrRr',
  'rRrRRRRRRRRRRrRr',
  'rRrrrrrrrrrrrrRr',
  'rRRRRRRRRRRRRRRr',
  'rrrrrrrrrrrrrrrr',
];

const WINDOW: PixelGrid = [
  'kkkkkkkkkkkkkkkk',
  'kEEEEEEkkEEEEEEk',
  'kEEEEEEkkEEEEEEk',
  'kEEEEEEkkEEEEEEk',
  'keeeeeekkeeeeeek',
  'keeeeeekkeeeeeek',
  'kkkkkkkkkkkkkkkk',
  'keeeeeekkeeeeeek',
  'keeeeeekkeeeeeek',
  'keeeeeekkeeeeeek',
  'keeeeeekkeeeeeek',
  'keeeeeekkeeeeeek',
  'kkkkkkkkkkkkkkkk',
  '.kWWWWWWWWWWWWk.',
  '.kkkkkkkkkkkkkk.',
  '................',
];

// ---------------------------------------------------------------- objects

/** Projects. One per row in the projects table. */
const CABINET: PixelGrid = [
  '..kkkkkkkkkkkk..',
  '..kaaaaaaaaaak..',
  '..kaAAAAAAAAak..',
  '..kaaaaaaaaaak..',
  '..kkkkkkkkkkkk..',
  '..kvvvvvvvvvvk..',
  '..kvmmmmmmmmvk..',
  '..kvmeeeeeemvk..',
  '..kvmeEEEEemvk..',
  '..kvmeeeeeemvk..',
  '..kvmmmmmmmmvk..',
  '..kvvvvvvvvvvk..',
  '..kaaaaaaaaaak..',
  '..karkkkkkkrak..',
  '..kaaaaaaaaaak..',
  '..kkkkkkkkkkkk..',
  '..kvvvvvvvvvvk..',
  '..kvvvvvvvvvvk..',
  '..kvvvvvvvvvvk..',
  '..kvvvvvvvvvvk..',
  '..kvvvvvvvvvvk..',
  '..kvvvvvvvvvvk..',
  '..kkkkkkkkkkkk..',
  '...hhhhhhhhhh...',
];

/** Skills. Each shelf row is a different set of spines. */
const BOOKSHELF: PixelGrid = [
  'kkkkkkkkkkkkkkkk',
  'kWWWWWWWWWWWWWWk',
  'kWaaWrrWqqWAAWWk',
  'kWaaWrrWqqWAAWWk',
  'kWaaWrrWqqWAAWWk',
  'kkkkkkkkkkkkkkkk',
  'kWWWWWWWWWWWWWWk',
  'kWffWAAWrrWqqWWk',
  'kWffWAAWrrWqqWWk',
  'kWffWAAWrrWqqWWk',
  'kkkkkkkkkkkkkkkk',
  'kWWWWWWWWWWWWWWk',
  'kWqqWffWAAWrrWWk',
  'kWqqWffWAAWrrWWk',
  'kWqqWffWAAWrrWWk',
  'kkkkkkkkkkkkkkkk',
  'kWWWWWWWWWWWWWWk',
  'kWrrWqqWffWaaWWk',
  'kWrrWqqWffWaaWWk',
  'kWrrWqqWffWaaWWk',
  'kkkkkkkkkkkkkkkk',
  'kwwwwwwwwwwwwwwk',
  'kkkkkkkkkkkkkkkk',
  '.hhhhhhhhhhhhhh.',
];

/** About — the desk you actually work at. */
const DESK: PixelGrid = [
  '...kkkkkkkkkk...',
  '...kmmmmmmmmk...',
  '...kmeeeeeemk...',
  '...kmmmmmmmmk...',
  '...kkkkkkkkkk...',
  '......kkkk......',
  '.....kWWWWk.....',
  'kkkkkkkkkkkkkkkk',
  'kWWWWWWWWWWWWWWk',
  'kkkkkkkkkkkkkkkk',
  '.kw..........wk.',
  '.kw..........wk.',
  '.kw..........wk.',
  '.kw..........wk.',
  '.kk..........kk.',
  'hhhh........hhhh',
];

/** Contact. */
const MAILBOX: PixelGrid = [
  '................',
  '....kkkkkkkk....',
  '...kaaaaaaaak...',
  '...kaAAAAAAak...',
  '...kaaaaaaaak...',
  '...kakkkkkkak...',
  '...kaaaaaaaak...',
  '....kkkkkkkk....',
  '......kwwk......',
  '......kwwk......',
  '......kwwk......',
  '......kwwk......',
  '......kwwk......',
  '.....kkwwkk.....',
  '.....kkkkkk.....',
  '....hhhhhhhh....',
];

const PLANT: PixelGrid = [
  '................',
  '.....ff..ff.....',
  '....fFffffFf....',
  '...ffFffffFff...',
  '...fffFffFfff...',
  '....ffffffff....',
  '.....ffffff.....',
  '......ffff......',
  '.......ff.......',
  '.......ff.......',
  '....kkkkkkkk....',
  '....krrrrrrk....',
  '....krRRRRrk....',
  '....krrrrrrk....',
  '....kkkkkkkk....',
  '.....hhhhhh.....',
];

/** Easter egg. Every room like this needs one. */
const CAT: PixelGrid = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '...kk......kk...',
  '...kak....kak...',
  '...kaakkkkaak...',
  '..kaaaaaaaaaak..',
  '..kaKaaaaaaKak..',
  '..kaaaaaaaaaak..',
  '..kaaaaaaaaaak..',
  '..kaaaaaaaaaak..',
  '..kkkkkkkkkkkk..',
  '...hhhhhhhhhh...',
];

// ---------------------------------------------------------------- character

const FACE_DOWN_A: PixelGrid = [
  '................',
  '................',
  '.....kkkkkk.....',
  '....kkkkkkkk....',
  '....kssssssk....',
  '....ksKssKsk....',
  '....kssssssk....',
  '....kSssssSk....',
  '.....kkkkkk.....',
  '....bbbbbbbb....',
  '...bbbbbbbbbb...',
  '...sbbbbbbbbs...',
  '...sbbbbbbbbs...',
  '....bbbbbbbb....',
  '....pp....pp....',
  '....kk....kk....',
];

const FACE_DOWN_B: PixelGrid = [
  '................',
  '................',
  '.....kkkkkk.....',
  '....kkkkkkkk....',
  '....kssssssk....',
  '....ksKssKsk....',
  '....kssssssk....',
  '....kSssssSk....',
  '.....kkkkkk.....',
  '....bbbbbbbb....',
  '...bbbbbbbbbb...',
  '...sbbbbbbbbs...',
  '...sbbbbbbbbs...',
  '....bbbbbbbb....',
  '.....pppppp.....',
  '.....kkkkkk.....',
];

const FACE_UP_A: PixelGrid = [
  '................',
  '................',
  '.....kkkkkk.....',
  '....kkkkkkkk....',
  '....kkkkkkkk....',
  '....kkkkkkkk....',
  '....kkkkkkkk....',
  '....kSkkkkSk....',
  '.....kkkkkk.....',
  '....bbbbbbbb....',
  '...bbbbbbbbbb...',
  '...sbbbbbbbbs...',
  '...sbbbbbbbbs...',
  '....bbbbbbbb....',
  '....pp....pp....',
  '....kk....kk....',
];

const FACE_UP_B: PixelGrid = [
  '................',
  '................',
  '.....kkkkkk.....',
  '....kkkkkkkk....',
  '....kkkkkkkk....',
  '....kkkkkkkk....',
  '....kkkkkkkk....',
  '....kSkkkkSk....',
  '.....kkkkkk.....',
  '....bbbbbbbb....',
  '...bbbbbbbbbb...',
  '...sbbbbbbbbs...',
  '...sbbbbbbbbs...',
  '....bbbbbbbb....',
  '.....pppppp.....',
  '.....kkkkkk.....',
];

const FACE_RIGHT_A: PixelGrid = [
  '................',
  '................',
  '.....kkkkkk.....',
  '....kkkkkkkk....',
  '....kkssssssk...',
  '....kksKssssk...',
  '....kkssssssk...',
  '....kkSsssssk...',
  '.....kkkkkkk....',
  '....bbbbbbbb....',
  '...bbbbbbbbbb...',
  '...bbbbbbbbbs...',
  '...bbbbbbbbbs...',
  '....bbbbbbbb....',
  '....pp....pp....',
  '....kk....kk....',
];

const FACE_RIGHT_B: PixelGrid = [
  '................',
  '................',
  '.....kkkkkk.....',
  '....kkkkkkkk....',
  '....kkssssssk...',
  '....kksKssssk...',
  '....kkssssssk...',
  '....kkSsssssk...',
  '.....kkkkkkk....',
  '....bbbbbbbb....',
  '...bbbbbbbbbb...',
  '...bbbbbbbbbs...',
  '...bbbbbbbbbs...',
  '....bbbbbbbb....',
  '.....pppppp.....',
  '.....kkkkkk.....',
];

// ---------------------------------------------------------------- rasteriser

export interface Sprite {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

function raster(grid: PixelGrid, flipX = false): Sprite {
  const height = grid.length;
  const width = grid[0].length;

  if (grid.some((row) => row.length !== width)) {
    throw new Error('Sprite rows must all be the same length');
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context unavailable');

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = grid[y][flipX ? width - 1 - x : x];
      const colour = PALETTE[key];
      if (!colour || colour === 'transparent') continue;
      context.fillStyle = colour;
      context.fillRect(x, y, 1, 1);
    }
  }

  return { canvas, width, height };
}

export type SpriteName =
  | 'floor'
  | 'wall'
  | 'wallBase'
  | 'rug'
  | 'window'
  | 'cabinet'
  | 'bookshelf'
  | 'desk'
  | 'mailbox'
  | 'plant'
  | 'cat';

export type Facing = 'down' | 'up' | 'left' | 'right';

export interface SpriteSheet {
  tiles: Record<SpriteName, Sprite>;
  /** [standing, walking] per facing. */
  player: Record<Facing, [Sprite, Sprite]>;
  tileSize: number;
}

let cached: SpriteSheet | null = null;

/** Rasterises every sprite once. Safe to call repeatedly. */
export function loadSprites(): SpriteSheet {
  if (cached) return cached;

  cached = {
    tileSize: TILE,
    tiles: {
      floor: raster(FLOOR),
      wall: raster(WALL),
      wallBase: raster(WALL_BASE),
      rug: raster(RUG),
      window: raster(WINDOW),
      cabinet: raster(CABINET),
      bookshelf: raster(BOOKSHELF),
      desk: raster(DESK),
      mailbox: raster(MAILBOX),
      plant: raster(PLANT),
      cat: raster(CAT),
    },
    player: {
      down: [raster(FACE_DOWN_A), raster(FACE_DOWN_B)],
      up: [raster(FACE_UP_A), raster(FACE_UP_B)],
      right: [raster(FACE_RIGHT_A), raster(FACE_RIGHT_B)],
      // Left is the right-facing frames mirrored, so the two always match.
      left: [raster(FACE_RIGHT_A, true), raster(FACE_RIGHT_B, true)],
    },
  };

  return cached;
}
