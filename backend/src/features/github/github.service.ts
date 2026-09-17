import { env } from '@/config/env';
import { AppError } from '@/shared/errors/AppError';
import { Project } from '@/features/projects/project.model';

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  created_at: string;
}

/**
 * Accepts "owner/name" or any github.com URL for the repository.
 * Returns null when the input is not a repository reference at all.
 */
export function parseRepoReference(input: string): string | null {
  const trimmed = input.trim().replace(/[/\s]+$/, '');

  const urlMatch = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s]+)/i,
  );
  const shorthand = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/);
  const match = urlMatch ?? shorthand;
  if (!match) return null;

  // Strip .git after splitting, so a clone URL's trailing ".git" does not end
  // up inside the repository name.
  return `${match[1]}/${match[2].replace(/\.git$/i, '')}`;
}

async function fetchRepo(fullName: string): Promise<GitHubRepo> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-cms',
  };
  // Optional, but raises the rate limit from 60 to 5000 requests an hour.
  if (env.githubToken) headers.Authorization = `Bearer ${env.githubToken}`;

  const response = await fetch(`https://api.github.com/repos/${fullName}`, {
    headers,
  });

  if (response.status === 404) {
    throw AppError.notFound(`No public repository at ${fullName}`);
  }
  if (response.status === 403 || response.status === 429) {
    throw new AppError(
      429,
      'GitHub rate limit reached. Set GITHUB_TOKEN to raise it.',
    );
  }
  if (!response.ok) {
    throw new AppError(502, `GitHub responded with ${response.status}`);
  }

  return (await response.json()) as GitHubRepo;
}

/** "Anime-Watchlist" -> "Anime Watchlist" */
const humanize = (name: string) =>
  name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const BACKEND_LANGUAGES = new Set([
  'Python',
  'Go',
  'Rust',
  'Java',
  'Ruby',
  'PHP',
  'C#',
]);

const BACKEND_HINTS = /\b(api|server|backend|service|cli|crud|auth)\b/i;

/**
 * A first guess only — the form is editable. Language alone is not enough:
 * JavaScript covers both halves of the stack, so the repository name and
 * topics get a say too.
 */
function guessCategory(
  language: string | null,
  name: string,
  topics: string[],
): string {
  if (language && BACKEND_LANGUAGES.has(language)) return 'backend';
  const haystack = [name, ...topics].join(' ').replace(/[-_]+/g, ' ');
  return BACKEND_HINTS.test(haystack) ? 'backend' : 'frontend';
}

/**
 * Builds a project draft from a repository. Nothing is saved — the admin UI
 * shows the result so it can be edited before creating.
 */
export async function previewProjectFromRepo(reference: string) {
  const fullName = parseRepoReference(reference);
  if (!fullName) {
    throw AppError.badRequest(
      'Expected "owner/name" or a github.com repository URL',
    );
  }

  const repo = await fetchRepo(fullName);

  const technologies = [...(repo.topics ?? [])];
  if (repo.language && !technologies.includes(repo.language)) {
    technologies.unshift(repo.language);
  }

  const existing = await Project.findOne({
    where: { githubUrl: repo.html_url },
  });

  return {
    /** Non-null when this repository is already a project. */
    existingProjectId: existing?.id ?? null,
    draft: {
      slug: slugify(repo.name),
      title: humanize(repo.name),
      description: repo.description ?? '',
      technologies,
      image: '',
      githubUrl: repo.html_url,
      liveUrl: repo.homepage ?? '',
      featured: false,
      category: guessCategory(repo.language, repo.name, repo.topics ?? []),
      date: repo.created_at.slice(0, 10),
      status: 'draft' as const,
      githubStars: repo.stargazers_count,
      lastCommitAt: repo.pushed_at,
    },
  };
}

/** Refreshes stars and last-commit date for every project with a GitHub URL. */
export async function syncRepoStats() {
  const projects = await Project.findAll();
  const results: { title: string; ok: boolean; reason?: string }[] = [];

  for (const project of projects) {
    const fullName = parseRepoReference(project.githubUrl);
    if (!fullName) {
      results.push({
        title: project.title,
        ok: false,
        reason: 'Not a GitHub URL',
      });
      continue;
    }

    try {
      const repo = await fetchRepo(fullName);
      await project.update({
        githubStars: repo.stargazers_count,
        lastCommitAt: new Date(repo.pushed_at),
      });
      results.push({ title: project.title, ok: true });
    } catch (error) {
      results.push({
        title: project.title,
        ok: false,
        reason: error instanceof AppError ? error.message : 'Fetch failed',
      });
    }
  }

  return results;
}
