/**
 * Every sprite in the town is drawn from this palette. Sprites are authored as
 * grids of single characters (see sprites.ts); each character indexes here.
 *
 * Keeping one small palette is what makes hand-authored pixel art read as a
 * set rather than a pile of unrelated drawings.
 */
export const PALETTE: Record<string, string> = {
  '.': 'transparent',

  // Outline and shadow
  k: '#241c17',
  K: '#100c0a',
  h: '#3a2c23',

  // Ground
  g: '#3d6b3f', // grass dark
  G: '#4d8049', // grass mid
  H: '#66a05d', // grass highlight
  t: '#b08f66', // path
  T: '#c9a87c', // path light
  o: '#8f7047', // path dark

  // Timber
  n: '#5c4330',
  N: '#7a5a41',
  w: '#6b4b2f',
  W: '#8a6540',
  x: '#a87f52',

  // Foliage
  l: '#2f5c33',
  L: '#40823f',
  M: '#57a24f',

  // Water
  u: '#2f6d8f',
  U: '#3f8cb0',
  z: '#63b3d4',

  // Plaster and glass
  p: '#d9c9a8',
  P: '#b8a888',
  q: '#78c4e0',
  Q: '#a8e2f2',

  // Doors and brick
  b: '#6b4226',
  B: '#8a5733',

  /**
   * Roof placeholders. Every house shares one grid; `raster` swaps R and r for
   * a variant's colours, so a new roof colour costs two entries here rather
   * than another 16 rows of pixels.
   */
  R: '#b8483c',
  r: '#8f3229',

  // Roof variants
  '1': '#b8483c',
  '!': '#8f3229', // red
  '2': '#3f6ea8',
  '@': '#2d5080', // blue
  '3': '#4a8a52',
  '#': '#356540', // green
  '4': '#3f8f8a',
  $: '#2d6b66', // teal
  '5': '#7a5aa8',
  '%': '#5a4080', // violet
  '6': '#a8703f',
  '^': '#80512c', // ochre

  // Accents
  a: '#e8a33d',
  A: '#f7c46b',
  c: '#f2ebe3',
  m: '#16202e', // screen
  e: '#5ec8f2',
  E: '#a5e6ff',
  f: '#c94f6d', // flowers
  F: '#e88ba3',

  // Character
  s: '#d9a066',
  S: '#b87d4a',
  d: '#4a6fa5', // shirt
  D: '#33405c', // trousers
};

/** Roof colour pairs, keyed by name. */
export const ROOFS = {
  red: { R: '1', r: '!' },
  blue: { R: '2', r: '@' },
  green: { R: '3', r: '#' },
  teal: { R: '4', r: '$' },
  violet: { R: '5', r: '%' },
  ochre: { R: '6', r: '^' },
} as const;

export type RoofName = keyof typeof ROOFS;
