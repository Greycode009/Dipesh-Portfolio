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
  image: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
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
