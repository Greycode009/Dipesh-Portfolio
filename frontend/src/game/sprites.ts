import { PALETTE, ROOFS, type RoofName } from './palette';

/**
 * Sprites are authored as grids of palette characters — one character per
 * pixel, '.' for transparent. They are rasterised to offscreen canvases once
 * at startup, so there is no image loading and nothing to license.
 *
 * Buildings are composed from 16x16 tiles rather than drawn whole: three roof
 * pieces and three wall pieces tile into any house, and a roof colour costs a
 * palette swap instead of another set of pixels.
 */
export type PixelGrid = readonly string[];

export const TILE = 16;

// ------------------------------------------------------------------ ground

const GRASS: PixelGrid = [
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgHgGgGgGgGgG',
  'GgGgGgGgGgGgHgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgHgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgHgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgHgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
];

const GRASS_TUFT: PixelGrid = [
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGlGgGgGgGgGg',
  'gGgGlLlGgGgGgGgG',
  'GgGglLlgGgGgGgGg',
  'gGgGgLgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGlGgGg',
  'gGgGgGgGgGglLlgG',
  'GgGgGgGgGgGgLgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
];

const FLOWERS: PixelGrid = [
  'gGgGgGgGgGgGgGgG',
  'GgGgGfGgGgGgGgGg',
  'gGgGfFfGgGgFgGgG',
  'GgGgGfGgGgGfFfGg',
  'gGgGgLgGgGgGfgGg',
  'GgGgGgGgGgGgLgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgfgGgGgGgGgGgGg',
  'gFfFgGgGgGgGgGgG',
  'GgfgGgGgGgGgGgGg',
  'gGLgGgGgGgGgGgGg',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
];

const PATH: PixelGrid = [
  'tTtttTttttTttttt',
  'ttttttttTtttttTt',
  'tTttttttttttTttt',
  'ttttTttttttttttt',
  'ttttttttttTttttT',
  'tTtttttTtttttttt',
  'ttttttttttttTttt',
  'ttTttttttttttttt',
  'ttttttTttttttTtt',
  'tttttttttTtttttt',
  'tTttttttttttttTt',
  'ttttttttTttttttt',
  'ttttTtttttttTttt',
  'tttttttttttttttt',
  'ttTttttttTtttttt',
  'tttttttttttttttt',
];

const WATER: PixelGrid = [
  'uUuUuUuUuUuUuUuU',
  'UuUuUuUuUuUuUuUu',
  'uUuUzUuUuUuUuUuU',
  'UuUuUuUuUuUzUuUu',
  'uUuUuUuUuUuUuUuU',
  'UuUuUuUuUuUuUuUu',
  'uUuUuUuUzUuUuUuU',
  'UuUuUuUuUuUuUuUu',
  'uUuUuUuUuUuUuUuU',
  'UuzuUuUuUuUuUuUu',
  'uUuUuUuUuUuUuUuU',
  'UuUuUuUuUuUuUuUu',
  'uUuUuUuUuUuUzUuU',
  'UuUuUuUuUuUuUuUu',
  'uUuUuUuUuUuUuUuU',
  'UuUuUuUuUuUuUuUu',
];

// ---------------------------------------------------------------- buildings

const ROOF_L: PixelGrid = [
  '..............kk',
  '............kkRR',
  '..........kkRRRR',
  '........kkRRRRRR',
  '......kkRRRRRRRR',
  '....kkRRRRRRRRRR',
  '..kkRRRRRRRRRRRR',
  'kkRRRRRRRRRRRRRR',
  'krrRRRRRRRRRRRRR',
  'krrrRRRRRRRRRRRR',
  'krrrrRRRRRRRRRRR',
  'kkkkkkkkkkkkkkkk',
  '.kpppppppppppppp',
  '.kpppppppppppppp',
  '.kpppppppppppppp',
  '.kpppppppppppppp',
];

const ROOF_M: PixelGrid = [
  'kkkkkkkkkkkkkkkk',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'kkkkkkkkkkkkkkkk',
  'pppppppppppppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
];

const WALL: PixelGrid = [
  'pppppppppppppppp',
  'pppppppppppppppp',
  'ppPppppppppppPpp',
  'pppppppppppppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
  'ppppppPppppppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
  'ppppppppppPppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
];

const WALL_WINDOW: PixelGrid = [
  'pppppppppppppppp',
  'ppkkkkkkkkkkkkpp',
  'ppkQQQQQkQQQQQkp',
  'ppkQqqqqkqqqqQkp',
  'ppkQqqqqkqqqqQkp',
  'ppkQqqqqkqqqqQkp',
  'ppkkkkkkkkkkkkpp',
  'ppkQqqqqkqqqqQkp',
  'ppkQqqqqkqqqqQkp',
  'ppkQqqqqkqqqqQkp',
  'ppkQqqqqkqqqqQkp',
  'ppkkkkkkkkkkkkpp',
  'ppPppppppppppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
  'pppppppppppppppp',
];

const WALL_DOOR: PixelGrid = [
  'pppppppppppppppp',
  'pppppppppppppppp',
  'pppkkkkkkkkkkppp',
  'pppkbbbbbbbbkppp',
  'pppkbBBBBBBbkppp',
  'pppkbBbbbbBbkppp',
  'pppkbBbbbbBbkppp',
  'pppkbBbbbbBbkppp',
  'pppkbBbbbbBbkppp',
  'pppkbBbbbbBbkppp',
  'pppkbBbbbbBbkppp',
  'pppkbBbbaBBbkppp',
  'pppkbBbbbbBbkppp',
  'pppkbbbbbbbbkppp',
  'pppkkkkkkkkkkppp',
  'hhhhhhhhhhhhhhhh',
];

// ------------------------------------------------------------------ props

const TREE_TOP: PixelGrid = [
  '......llll......',
  '....llLLLLll....',
  '...lLLMMLLLLl...',
  '..lLLMMMMLLLLl..',
  '.lLLMMMMMMLLLLl.',
  '.lLMMMMMMMLLLLl.',
  'lLLMMMMMMMMLLLLl',
  'lLLMMMMMMMMLLLLl',
  'lLLMMMMMMMMLLLLl',
  '.lLLMMMMMMLLLLl.',
  '.lLLLMMMMLLLLll.',
  '..lLLLLLLLLLll..',
  '...llLLLLLLll...',
  '.....llllll.....',
  '.......nn.......',
  '.......nn.......',
];

const TREE_BOT: PixelGrid = [
  'gGgGgGgnnGgGgGgG',
  'GgGgGgGnnGgGgGgG',
  'gGgGgGgnNgGgGgGg',
  'GgGgGgGnnGgGgGgG',
  'gGgGgGgnnGgGgGgG',
  'GgGgGgknnkGgGgGg',
  'gGgGgkhhhhkGgGgG',
  'GgGgGghhhhgGgGgG',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
];

const FENCE: PixelGrid = [
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'knkGgGgknkGgGknk',
  'knkGgGgknkGgGknk',
  'kkkkkkkkkkkkkkkk',
  'kNNNNNNNNNNNNNNk',
  'kkkkkkkkkkkkkkkk',
  'knkGgGgknkGgGknk',
  'kkkkkkkkkkkkkkkk',
  'kNNNNNNNNNNNNNNk',
  'kkkkkkkkkkkkkkkk',
  'knkGgGgknkGgGknk',
  'knkGgGgknkGgGknk',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
];

const SIGN: PixelGrid = [
  '................',
  '..kkkkkkkkkkkk..',
  '..kWWWWWWWWWWk..',
  '..kWaaaaaaaaWk..',
  '..kWaAAAAAAaWk..',
  '..kWaaaaaaaaWk..',
  '..kWWWWWWWWWWk..',
  '..kkkkkkkkkkkk..',
  '......knnk......',
  '......knnk......',
  '......knnk......',
  '......knnk......',
  '......knnk......',
  '.....kknnkk.....',
  '.....kkkkkk.....',
  '....hhhhhhhh....',
];

/** The town notice board. Walk up to it to read the public chat. */
const BOARD: PixelGrid = [
  '................',
  '..kkkkkkkkkkkk..',
  '..kNNNNNNNNNNk..',
  '..kNwwwwwwwwNk..',
  '..kNwccwwccwNk..',
  '..kNwccwwccwNk..',
  '..kNwwwwwwwwNk..',
  '..kNwwccccwwNk..',
  '..kNwwccccwwNk..',
  '..kNwwwwwwwwNk..',
  '..kNNNNNNNNNNk..',
  '..kkkkkkkkkkkk..',
  '....knk..knk....',
  '....knk..knk....',
  '...kkkk..kkkk...',
  '...hhhh..hhhh...',
];

const LAMP: PixelGrid = [
  '.....kkkkkk.....',
  '....kAAAAAAk....',
  '....kAEEEEAk....',
  '....kAEEEEAk....',
  '....kAAAAAAk....',
  '.....kkkkkk.....',
  '......knnk......',
  '......knnk......',
  '......knnk......',
  '......knnk......',
  '......knnk......',
  '......knnk......',
  '......knnk......',
  '.....kknnkk.....',
  '.....kkkkkk.....',
  '....hhhhhhhh....',
];

const BENCH: PixelGrid = [
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'kkkkkkkkkkkkkkkk',
  'kNNNNNNNNNNNNNNk',
  'kkkkkkkkkkkkkkkk',
  'kNNNNNNNNNNNNNNk',
  'kkkkkkkkkkkkkkkk',
  'knkGgGgGgGgGgknk',
  'knkGgGgGgGgGgknk',
  'knkGgGgGgGgGgknk',
  'kkkGgGgGgGgGgkkk',
  'gGgGgGgGgGgGgGgG',
  'hhhGgGgGgGgGghhh',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
];

/** Projects. Stands beside its house like a shop display. */
const CABINET: PixelGrid = [
  '..kkkkkkkkkkkk..',
  '..kaaaaaaaaaak..',
  '..kaAAAAAAAAak..',
  '..kaaaaaaaaaak..',
  '..kkkkkkkkkkkk..',
  '..kmmmmmmmmmmk..',
  '..kmeeeeeeeemk..',
  '..kmeEEEEEEemk..',
  '..kmeeeeeeeemk..',
  '..kmmmmmmmmmmk..',
  '..kaaaaaaaaaak..',
  '..karkkkkkkrak..',
  '..kaaaaaaaaaak..',
  '..kkkkkkkkkkkk..',
  '..kwwwwwwwwwwk..',
  '..kkkkkkkkkkkk..',
];

const CAT: PixelGrid = [
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGgGgGgGgGgGgGgG',
  'GgGgGgGgGgGgGgGg',
  'gGkkgGgGgGkkgGgG',
  'GgkakGgGgGkakGgG',
  'gGkaakkkkaakgGgG',
  'GkaaaaaaaaaakGgG',
  'gkaKaaaaaaKakgGg',
  'GkaaaaaaaaaakGgG',
  'gkaaaaaaaaaakgGg',
  'GkaaaaaaaaaakGgG',
  'gkkkkkkkkkkkkgGg',
  'GghhhhhhhhhhggGg',
];

// -------------------------------------------------------------- character

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
  '....dddddddd....',
  '...dddddddddd...',
  '...sddddddds....',
  '...sddddddds....',
  '....dddddddd....',
  '....DD....DD....',
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
  '....dddddddd....',
  '...dddddddddd...',
  '...sddddddds....',
  '...sddddddds....',
  '....dddddddd....',
  '.....DDDDDD.....',
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
  '....dddddddd....',
  '...dddddddddd...',
  '...sddddddds....',
  '...sddddddds....',
  '....dddddddd....',
  '....DD....DD....',
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
  '....dddddddd....',
  '...dddddddddd...',
  '...sddddddds....',
  '...sddddddds....',
  '....dddddddd....',
  '.....DDDDDD.....',
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
  '....dddddddd....',
  '...dddddddddd...',
  '...ddddddddds...',
  '...ddddddddds...',
  '....dddddddd....',
  '....DD....DD....',
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
  '....dddddddd....',
  '...dddddddddd...',
  '...ddddddddds...',
  '...ddddddddds...',
  '....dddddddd....',
  '.....DDDDDD.....',
  '.....kkkkkk.....',
];

// ------------------------------------------------------------- rasteriser

export interface Sprite {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

interface RasterOptions {
  flipX?: boolean;
  /** Maps grid characters onto different palette entries — used for roofs. */
  swap?: Readonly<Record<string, string>>;
}

function raster(grid: PixelGrid, options: RasterOptions = {}): Sprite {
  const { flipX = false, swap } = options;
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
      const raw = grid[y][flipX ? width - 1 - x : x];
      const key = swap?.[raw] ?? raw;
      const colour = PALETTE[key];
      if (!colour || colour === 'transparent') continue;
      context.fillStyle = colour;
      context.fillRect(x, y, 1, 1);
    }
  }

  return { canvas, width, height };
}

export type GroundName = 'grass' | 'grassTuft' | 'flowers' | 'path' | 'water';

export type PropName =
  | 'treeTop'
  | 'treeBottom'
  | 'fence'
  | 'sign'
  | 'board'
  | 'lamp'
  | 'bench'
  | 'cabinet'
  | 'cat';

export type HousePart = 'roofLeft' | 'roofMid' | 'roofRight' | 'wall' | 'wallWindow' | 'wallDoor';

export type Facing = 'down' | 'up' | 'left' | 'right';

export interface SpriteSheet {
  tileSize: number;
  ground: Record<GroundName, Sprite>;
  props: Record<PropName, Sprite>;
  /** House parts, one set per roof colour. */
  houses: Record<RoofName, Record<HousePart, Sprite>>;
  player: Record<Facing, [Sprite, Sprite]>;
}

let cached: SpriteSheet | null = null;

/** Rasterises every sprite once. Safe to call repeatedly. */
export function loadSprites(): SpriteSheet {
  if (cached) return cached;

  const houseParts = (roof: RoofName): Record<HousePart, Sprite> => {
    const swap = ROOFS[roof];
    return {
      roofLeft: raster(ROOF_L, { swap }),
      roofMid: raster(ROOF_M, { swap }),
      roofRight: raster(ROOF_L, { swap, flipX: true }),
      wall: raster(WALL),
      wallWindow: raster(WALL_WINDOW),
      wallDoor: raster(WALL_DOOR),
    };
  };

  cached = {
    tileSize: TILE,
    ground: {
      grass: raster(GRASS),
      grassTuft: raster(GRASS_TUFT),
      flowers: raster(FLOWERS),
      path: raster(PATH),
      water: raster(WATER),
    },
    props: {
      treeTop: raster(TREE_TOP),
      treeBottom: raster(TREE_BOT),
      fence: raster(FENCE),
      sign: raster(SIGN),
      board: raster(BOARD),
      lamp: raster(LAMP),
      bench: raster(BENCH),
      cabinet: raster(CABINET),
      cat: raster(CAT),
    },
    houses: {
      red: houseParts('red'),
      blue: houseParts('blue'),
      green: houseParts('green'),
      teal: houseParts('teal'),
      violet: houseParts('violet'),
      ochre: houseParts('ochre'),
    },
    player: {
      down: [raster(FACE_DOWN_A), raster(FACE_DOWN_B)],
      up: [raster(FACE_UP_A), raster(FACE_UP_B)],
      right: [raster(FACE_RIGHT_A), raster(FACE_RIGHT_B)],
      // Left mirrors right, so the two always match.
      left: [
        raster(FACE_RIGHT_A, { flipX: true }),
        raster(FACE_RIGHT_B, { flipX: true }),
      ],
    },
  };

  return cached;
}
