/**
 * Content shapes. These deliberately mirror the database tables the CMS will
 * expose in Phase 2, so swapping the local modules for API responses is a
 * change of data source only, not of types.
 *
 * Fields marked "game" are unused by the classic pages — they carry the
 * placement each entity will have inside the pixel room in Phase 3.
 */

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'development'
  | 'authentication';

export type ContentStatus = 'draft' | 'published';

/**
 * What kind of thing a project is. Drives what its card can show — a backend
 * or CLI project usually has no live demo and nothing to screenshot.
 */
export type ProjectType =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'mobile'
  | 'other';

/** 1 = touched it, 5 = could teach it. Becomes item rarity in the game. */
export type Proficiency = 1 | 2 | 3 | 4 | 5;

export interface WorldPlacement {
  /** Tile coordinates within the room. */
  worldX: number;
  worldY: number;
  /** Key into the sprite atlas. */
  sprite: string;
}

export interface Project extends WorldPlacement {
  id: number;
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  /** Null when there is nothing to show — a backend project, typically. */
  image: string | null;
  githubUrl: string;
  /** Null when there is nowhere to click through to. */
  liveUrl: string | null;
  featured: boolean;
  type: ProjectType;
  category: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  sortOrder: number;
  status: ContentStatus;
}

export interface Skill {
  id: number;
  name: string;
  /** Font Awesome class for the classic view. */
  icon: string;
  description: string;
  category: SkillCategory;
  proficiency: Proficiency;
  /** Inventory item sprite key (game). */
  itemSprite: string;
  sortOrder: number;
}

export interface TimelineEntry {
  id: number;
  year: string;
  title: string;
  description: string;
  highlight: boolean;
  sortOrder: number;
}

export interface Bio {
  name: string;
  headline: string;
  roles: string[];
  /** Rendered as separate paragraphs. */
  story: string[];
  /** Lead paragraph on the home page. */
  homeIntro: string;
  /** Third figure in the hero. The other two are counted, not stored. */
  heroStatValue: string;
  heroStatLabel: string;
  quote: string;
  avatarUrl: string;
  portraitUrl: string;
  location: string;
  email: string;
  phone: string;
  availableForWork: boolean;
}

export interface Social {
  id: number;
  label: string;
  url: string;
  /** Key into the icon map in SocialIcons. */
  icon: 'github' | 'linkedin' | 'x';
  sortOrder: number;
}

export interface Expertise {
  id: number;
  title: string;
  description: string;
  icon: string;
  technologies: string[];
  sortOrder: number;
}
