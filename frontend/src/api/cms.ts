import type {
  Bio,
  Expertise,
  Project,
  Skill,
  Social,
  TimelineEntry,
} from '@/types/content';
import { request, setToken } from './client';

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  approved: boolean;
  createdAt: string;
}

export interface AdminSession {
  token: string;
  admin: { id: number; email: string };
}

export const auth = {
  login: (email: string, password: string) =>
    request<AdminSession>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  me: () => request<{ admin: { sub: number; email: string } }>('/api/auth/me', {
    auth: true,
  }),
  logout: () => setToken(null),
};

/** CRUD surface matching the backend's shared router. */
export function resource<T>(path: string) {
  return {
    list: (asAdmin = false) => request<T[]>(path, { auth: asAdmin }),
    get: (id: number) => request<T>(`${path}/${id}`),
    create: (body: Partial<T>) =>
      request<T>(path, { method: 'POST', body, auth: true }),
    update: (id: number, body: Partial<T>) =>
      request<T>(`${path}/${id}`, { method: 'PATCH', body, auth: true }),
    remove: (id: number) =>
      request<void>(`${path}/${id}`, { method: 'DELETE', auth: true }),
    reorder: (ids: number[]) =>
      request<{ ok: boolean }>(`${path}/reorder`, {
        method: 'POST',
        body: { ids },
        auth: true,
      }),
  };
}

export const cms = {
  projects: resource<Project>('/api/projects'),
  skills: resource<Skill>('/api/skills'),
  timeline: resource<TimelineEntry>('/api/timeline'),
  socials: resource<Social>('/api/socials'),
  expertise: resource<Expertise>('/api/expertise'),

  bio: {
    get: () => request<Bio>('/api/bio'),
    update: (body: Partial<Bio>) =>
      request<Bio>('/api/bio', { method: 'PATCH', body, auth: true }),
  },

  guestbook: {
    list: (asAdmin = false) =>
      request<GuestbookEntry[]>('/api/guestbook', { auth: asAdmin }),
    moderate: (id: number, approved: boolean) =>
      request<GuestbookEntry>(`/api/guestbook/${id}`, {
        method: 'PATCH',
        body: { approved },
        auth: true,
      }),
    remove: (id: number) =>
      request<void>(`/api/guestbook/${id}`, { method: 'DELETE', auth: true }),
  },
};

export interface GitHubPreview {
  existingProjectId: number | null;
  draft: Partial<Project> & { githubStars?: number; lastCommitAt?: string };
}

export const github = {
  preview: (repo: string) =>
    request<GitHubPreview>('/api/github/preview', {
      method: 'POST',
      body: { repo },
      auth: true,
    }),
  syncStats: () =>
    request<{ results: { title: string; ok: boolean; reason?: string }[] }>(
      '/api/github/sync-stats',
      { method: 'POST', auth: true },
    ),
};
