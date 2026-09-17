import { projects } from '@/content/projects';
import type { SpriteName } from './sprites';

/**
 * The studio. One interior, authored as a character grid:
 *
 *   #  wall          _  bottom course of the back wall
 *   .  floor         r  rug
 *
 * Interactables are laid on top. Project cabinets come from the projects
 * table's worldX/worldY, so adding a project in the CMS places furniture.
 */
const TERRAIN = [
  '########################',
  '########################',
  '________________________',
  '#......................#',
  '#......................#',
  '#......................#',
  '#......................#',
  '#......................#',
  '#........rrrrrr........#',
  '#........rrrrrr........#',
  '#........rrrrrr........#',
  '#........rrrrrr........#',
  '#......................#',
  '#......................#',
  '#......................#',
  '########################',
] as const;

export const ROOM_WIDTH = TERRAIN[0].length;
export const ROOM_HEIGHT = TERRAIN.length;

export type TerrainKind = 'wall' | 'wallBase' | 'floor' | 'rug';

export function terrainAt(x: number, y: number): TerrainKind {
  if (y < 0 || y >= ROOM_HEIGHT || x < 0 || x >= ROOM_WIDTH) return 'wall';
  switch (TERRAIN[y][x]) {
    case '#':
      return 'wall';
    case '_':
      return 'wallBase';
    case 'r':
      return 'rug';
    default:
      return 'floor';
  }
}

export type InteractionKind =
  | 'project'
  | 'skills'
  | 'about'
  | 'contact'
  | 'cat';

export interface Interactable {
  id: string;
  kind: InteractionKind;
  /** Tile coordinates of the tile the object stands on. */
  x: number;
  y: number;
  sprite: SpriteName;
  /** Pixels to raise the sprite by, for objects taller than one tile. */
  lift: number;
  /** Shown in the "press E" prompt. */
  label: string;
  projectId?: number;
  /** Pushed to the URL when opened, so the room is deep-linkable. */
  route?: string;
}

/** Decoration that blocks movement but cannot be interacted with. */
export interface Prop {
  x: number;
  y: number;
  sprite: SpriteName;
  lift: number;
  solid: boolean;
}

const publishedProjects = projects
  .filter((project) => project.status === 'published')
  .sort((a, b) => a.sortOrder - b.sortOrder);

/**
 * Cabinets use the project's stored position, but fall back to an evenly
 * spaced slot along the back wall so a project added without a position still
 * appears somewhere sensible rather than stacking at 0,0.
 */
export const interactables: Interactable[] = [
  ...publishedProjects.map((project, index) => ({
    id: `project-${project.id}`,
    kind: 'project' as const,
    x: project.worldX > 0 ? project.worldX : 4 + index * 3,
    y: project.worldY > 0 ? project.worldY : 3,
    sprite: 'cabinet' as SpriteName,
    lift: 8,
    label: project.title,
    projectId: project.id,
    route: '/projects',
  })),
  {
    id: 'bookshelf',
    kind: 'skills',
    x: 1,
    y: 3,
    sprite: 'bookshelf',
    lift: 8,
    label: 'Bookshelf',
    route: '/about',
  },
  {
    id: 'desk',
    kind: 'about',
    x: 22,
    y: 3,
    sprite: 'desk',
    lift: 0,
    label: 'Desk',
    route: '/about',
  },
  {
    id: 'mailbox',
    kind: 'contact',
    x: 12,
    y: 13,
    sprite: 'mailbox',
    lift: 0,
    label: 'Mailbox',
    route: '/contact',
  },
  {
    id: 'cat',
    kind: 'cat',
    x: 7,
    y: 12,
    sprite: 'cat',
    lift: 0,
    label: 'Cat',
  },
];

export const props: Prop[] = [
  { x: 2, y: 14, sprite: 'plant', lift: 0, solid: true },
  { x: 21, y: 14, sprite: 'plant', lift: 0, solid: true },
  // Windows sit on the back wall and are purely scenery.
  { x: 5, y: 1, sprite: 'window', lift: 0, solid: false },
  { x: 18, y: 1, sprite: 'window', lift: 0, solid: false },
];

const solidTiles = new Set<string>();
const key = (x: number, y: number) => `${x},${y}`;

for (const item of interactables) solidTiles.add(key(item.x, item.y));
for (const prop of props) {
  if (prop.solid) solidTiles.add(key(prop.x, prop.y));
}

export function isSolid(x: number, y: number): boolean {
  const terrain = terrainAt(x, y);
  if (terrain === 'wall' || terrain === 'wallBase') return true;
  return solidTiles.has(key(x, y));
}

export function interactableAt(x: number, y: number): Interactable | null {
  return (
    interactables.find((item) => item.x === x && item.y === y) ?? null
  );
}

/**
 * Where the character appears for a given URL, so /projects drops you at the
 * arcade rather than making you walk there.
 */
export function spawnFor(pathname: string): { x: number; y: number } {
  switch (pathname) {
    case '/projects':
      return { x: interactables[0]?.x ?? 4, y: 5 };
    case '/about':
      return { x: 3, y: 5 };
    case '/contact':
      return { x: 12, y: 11 };
    default:
      return { x: 12, y: 7 };
  }
}
