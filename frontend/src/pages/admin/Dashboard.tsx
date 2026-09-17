import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cms } from '@/api/cms';

interface Counts {
  projects: number;
  drafts: number;
  skills: number;
  timeline: number;
  pendingGuestbook: number;
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      cms.projects.list(true),
      cms.skills.list(true),
      cms.timeline.list(true),
      cms.guestbook.list(true),
    ])
      .then(([projects, skills, timeline, guestbook]) =>
        setCounts({
          projects: projects.length,
          drafts: projects.filter((p) => p.status === 'draft').length,
          skills: skills.length,
          timeline: timeline.length,
          pendingGuestbook: guestbook.filter((g) => !g.approved).length,
        }),
      )
      .catch((cause) =>
        setError(cause instanceof Error ? cause.message : String(cause)),
      );
  }, []);

  const tiles = counts
    ? [
        { label: 'Projects', value: counts.projects, to: '/admin/projects' },
        { label: 'Unpublished drafts', value: counts.drafts, to: '/admin/projects' },
        { label: 'Skills', value: counts.skills, to: '/admin/skills' },
        { label: 'Timeline entries', value: counts.timeline, to: '/admin/timeline' },
        {
          label: 'Guestbook awaiting review',
          value: counts.pendingGuestbook,
          to: '/admin/guestbook',
        },
      ]
    : [];

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Overview</h1>
        <p className="mt-1 text-muted">
          Changes here go live on the next deploy, once the content sync runs.
        </p>
      </header>

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!counts && !error ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tiles.map((tile) => (
            <Link
              key={tile.label}
              to={tile.to}
              className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40"
            >
              <p className="text-3xl font-bold text-primary">{tile.value}</p>
              <p className="mt-1 text-sm text-muted">{tile.label}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
