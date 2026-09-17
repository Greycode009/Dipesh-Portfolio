import type { Project } from '@/types/content';
import type { GroundName, PropName } from './sprites';
import type { RoofName } from './palette';

/**
 * The town. Generated rather than hand-typed as a character grid: at 56x40
 * tiles a literal map would be 2,240 characters to keep aligned by hand, and
 * every change would mean recounting columns.
 *
 * Project houses come from the projects table, so publishing a project builds
 * a house on the street.
 */
export const MAP_WIDTH = 56;
export const MAP_HEIGHT = 40;

/** Tiles visible at once. The camera scrolls this window over the map. */
export const VIEW_WIDTH = 24;
export const VIEW_HEIGHT = 16;

export type InteractionKind =
  | 'project'
  | 'skills'
  | 'about'
  | 'contact'
  | 'cat'
  | 'sign';

export interface Building {
  id: string;
  kind: InteractionKind;
  /** Top-left tile of the building block. */
  x: number;
  y: number;
  /** Width in tiles; height is always three (roof + two wall courses). */
  width: number;
  roof: RoofName;
  label: string;
  projectId?: number;
}

export interface Prop {
  x: number;
  y: number;
  name: PropName;
  solid: boolean;
  /** Pixels to lift the sprite, for things taller than their tile. */
  lift?: number;
}

export interface Interactable {
  id: string;
  kind: InteractionKind;
  /** The tile the visitor must face. */
  x: number;
  y: number;
  label: string;
  projectId?: number;
}

export interface Town {
  groundAt: (x: number, y: number) => GroundName;
  isSolid: (x: number, y: number) => boolean;
  interactableAt: (x: number, y: number) => Interactable | null;
  buildings: Building[];
  props: Prop[];
  interactables: Interactable[];
}

/**
 * Builds the town from the projects the CMS returned. Called once when the
 * game mounts rather than at module load, because the content now arrives over
 * the network.
 */
export function buildTown(allProjects: Project[]): Town {

// ---------------------------------------------------------------- terrain

const ground: GroundName[][] = Array.from({ length: MAP_HEIGHT }, () =>
  Array.from({ length: MAP_WIDTH }, () => 'grass' as GroundName),
);

const solid: boolean[][] = Array.from({ length: MAP_HEIGHT }, () =>
  Array.from({ length: MAP_WIDTH }, () => false),
);

const inBounds = (x: number, y: number) =>
  x >= 0 && y >= 0 && x < MAP_WIDTH && y < MAP_HEIGHT;

function paint(x: number, y: number, name: GroundName) {
  if (inBounds(x, y)) ground[y][x] = name;
}

function paintRect(x: number, y: number, w: number, h: number, name: GroundName) {
  for (let dy = 0; dy < h; dy += 1) {
    for (let dx = 0; dx < w; dx += 1) paint(x + dx, y + dy, name);
  }
}

function blockRect(x: number, y: number, w: number, h: number) {
  for (let dy = 0; dy < h; dy += 1) {
    for (let dx = 0; dx < w; dx += 1) {
      if (inBounds(x + dx, y + dy)) solid[y + dy][x + dx] = true;
    }
  }
}

/** Deterministic noise, so the scenery is the same on every visit. */
function scatter(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

// A solid ring, so the character cannot walk off the edge of the world.
blockRect(0, 0, MAP_WIDTH, 1);
blockRect(0, MAP_HEIGHT - 1, MAP_WIDTH, 1);
blockRect(0, 0, 1, MAP_HEIGHT);
blockRect(MAP_WIDTH - 1, 0, 1, MAP_HEIGHT);

// Roads: one main street, one lane south to the post office.
const MAIN_ROAD_Y = 22;
paintRect(0, MAIN_ROAD_Y, MAP_WIDTH, 2, 'path');
paintRect(27, MAIN_ROAD_Y, 2, 12, 'path');

// The park pond.
paintRect(13, 31, 6, 4, 'water');
blockRect(13, 31, 6, 4);

// ---------------------------------------------------------------- buildings

const HOUSE_ROOFS: RoofName[] = ['red', 'blue', 'green', 'teal', 'violet', 'ochre'];

const published = allProjects
  .filter((project) => project.status === 'published')
  .sort((a, b) => a.sortOrder - b.sortOrder);

const buildings: Building[] = [
  ...published.map((project, index) => ({
    id: `project-${project.id}`,
    kind: 'project' as const,
    x: 3 + index * 8,
    y: 18,
    width: 3,
    roof: HOUSE_ROOFS[index % HOUSE_ROOFS.length],
    label: project.title,
    projectId: project.id,
  })),
  {
    id: 'library',
    kind: 'skills',
    x: 5,
    y: 26,
    width: 5,
    roof: 'teal',
    label: 'The Library',
  },
  {
    id: 'home',
    kind: 'about',
    x: 44,
    y: 26,
    width: 5,
    roof: 'violet',
    label: 'My House',
  },
  {
    id: 'post-office',
    kind: 'contact',
    x: 33,
    y: 29,
    width: 5,
    roof: 'red',
    label: 'Post Office',
  },
];

/** The door is the tile the visitor interacts with. */
const doorOf = (building: Building) => ({
  x: building.x + Math.floor(building.width / 2),
  y: building.y + 2,
});

for (const building of buildings) {
  blockRect(building.x, building.y, building.width, 3);
  // A short path from each door out to the grass, so houses look lived in.
  const door = doorOf(building);
  paint(door.x, door.y + 1, 'path');
}

// ------------------------------------------------------------------- props

const props: Prop[] = [];

// Tree line around the edges.
for (let x = 1; x < MAP_WIDTH - 1; x += 3) {
  props.push({ x, y: 1, name: 'treeBottom', solid: true, lift: 0 });
  props.push({ x, y: MAP_HEIGHT - 2, name: 'treeBottom', solid: true, lift: 0 });
}
for (let y = 3; y < MAP_HEIGHT - 3; y += 3) {
  props.push({ x: 1, y, name: 'treeBottom', solid: true, lift: 0 });
  props.push({ x: MAP_WIDTH - 2, y, name: 'treeBottom', solid: true, lift: 0 });
}

// Street lamps along the main road.
for (let x = 6; x < MAP_WIDTH - 4; x += 10) {
  props.push({ x, y: MAIN_ROAD_Y - 1, name: 'lamp', solid: true });
}

// Park furniture.
props.push({ x: 21, y: 32, name: 'bench', solid: true });
props.push({ x: 21, y: 34, name: 'bench', solid: true });
props.push({ x: 11, y: 29, name: 'treeBottom', solid: true });
props.push({ x: 20, y: 29, name: 'treeBottom', solid: true });
props.push({ x: 12, y: 36, name: 'treeBottom', solid: true });
props.push({ x: 19, y: 36, name: 'treeBottom', solid: true });

// An arcade cabinet outside each project house, as its shop sign.
for (const building of buildings) {
  if (building.kind !== 'project') continue;
  props.push({ x: building.x + building.width, y: building.y + 2, name: 'cabinet', solid: true });
}

// Garden fences beside the library and house.
for (let x = 5; x < 10; x += 1) props.push({ x, y: 30, name: 'fence', solid: true });
for (let x = 44; x < 49; x += 1) props.push({ x, y: 30, name: 'fence', solid: true });

const signTile = { x: 26, y: MAIN_ROAD_Y + 2 };
props.push({ ...signTile, name: 'sign', solid: true });

const catTile = { x: 22, y: 33 };
props.push({ ...catTile, name: 'cat', solid: true });

for (const prop of props) {
  if (prop.solid && inBounds(prop.x, prop.y)) solid[prop.y][prop.x] = true;
}

// Scenery, painted after the solid layout so it never blocks a path.
const random = scatter(20260917);
for (let y = 0; y < MAP_HEIGHT; y += 1) {
  for (let x = 0; x < MAP_WIDTH; x += 1) {
    if (ground[y][x] !== 'grass' || solid[y][x]) continue;
    const roll = random();
    if (roll > 0.94) ground[y][x] = 'flowers';
    else if (roll > 0.84) ground[y][x] = 'grassTuft';
  }
}

// ----------------------------------------------------------- lookup tables

const groundAt = (x: number, y: number): GroundName =>
  inBounds(x, y) ? ground[y][x] : 'grass';

const isSolid = (x: number, y: number): boolean =>
  inBounds(x, y) ? solid[y][x] : true;

const interactables: Interactable[] = [
  ...buildings.map((building) => ({
    id: building.id,
    kind: building.kind,
    ...doorOf(building),
    label: building.label,
    projectId: building.projectId,
  })),
  { id: 'cat', kind: 'cat', ...catTile, label: 'A cat' },
  { id: 'sign', kind: 'sign', ...signTile, label: 'Town sign' },
];

function interactableAt(x: number, y: number): Interactable | null {
  return interactables.find((item) => item.x === x && item.y === y) ?? null;
}

  return { groundAt, isSolid, interactableAt, buildings, props, interactables };
}

/** Where the visitor appears — the crossroads, facing the houses. */
export const SPAWN = { x: 27, y: 25 };
