/**
 * Every sprite in the room is drawn from this palette. Sprites are authored as
 * grids of single characters (see sprites.ts); each character indexes here.
 *
 * Keeping it to one small palette is what makes hand-authored pixel art read
 * as a set rather than a pile of unrelated drawings.
 */
export const PALETTE: Record<string, string> = {
  '.': 'transparent',

  // Outlines and shadow
  k: '#241c17',
  K: '#100c0a',
  h: '#3a2c23', // soft shadow

  // Wood — floor, furniture
  w: '#6b4b2f',
  W: '#8a6540',
  x: '#a87f52',
  X: '#c39b6b',

  // Walls
  v: '#3a2b24',
  V: '#4e3a30',
  u: '#64493c',

  // Amber accent, matching the site theme
  a: '#e8a33d',
  A: '#f7c46b',
  g: '#b4740f',

  // Neutrals
  c: '#f2ebe3', // cream
  n: '#a99c90', // muted
  d: '#6b5f52',

  // Character
  s: '#d9a066', // skin
  S: '#b87d4a', // skin shade
  b: '#4a6fa5', // shirt
  B: '#3a5680', // shirt shade
  p: '#33405c', // trousers

  // Screens and glow
  m: '#16202e',
  e: '#5ec8f2',
  E: '#a5e6ff',

  // Accents
  f: '#4a7c3f', // plant
  F: '#67a355',
  r: '#9c4a3c', // rug red
  R: '#b85c46',
  q: '#2f6f5e', // teal
};

export type PaletteKey = keyof typeof PALETTE;
