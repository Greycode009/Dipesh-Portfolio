import { useMemo, useState } from 'react';
import { useContent } from '@/hooks/useContent';
import { usePageAnimations } from '@/hooks/usePageAnimations';
import type { Project, ProjectType } from '@/types/content';

const shell = 'mx-auto max-w-[92rem] px-5 sm:px-8';

const TYPE_LABELS: Record<ProjectType, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full-stack',
  mobile: 'Mobile',
  other: 'Other',
};

const TYPE_ORDER: ProjectType[] = [
  'frontend',
  'backend',
  'fullstack',
  'mobile',
  'other',
];

/**
 * A stand-in for projects with nothing to screenshot — an API, a CLI, a
 * library. Better than a broken image or an empty grey box, and it keeps the
 * card the same height as its neighbours.
 */
function NoPreview({ project }: { project: Project }) {
  return (
    <div className="flex aspect-[16/10] w-full flex-col justify-center gap-2 bg-content p-6 font-mono text-xs text-background">
      <p className="opacity-60">$ git clone</p>
      <p className="break-all">{project.githubUrl.replace('https://', '')}</p>
      <p className="mt-2 opacity-60">
        {project.technologies.slice(0, 4).join(' · ')}
      </p>
    </div>
  );
}

export default function Projects() {
  const { projects } = useContent();
  const scope = usePageAnimations();
  const [type, setType] = useState<ProjectType | 'all'>('all');

  const published = useMemo(
    () =>
      projects
        .filter((project) => project.status === 'published')
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [projects],
  );

  /** Only offer a filter for types that actually exist. */
  const availableTypes = useMemo(() => {
    const present = new Set(published.map((project) => project.type));
    return TYPE_ORDER.filter((option) => present.has(option));
  }, [published]);

  const visible =
    type === 'all'
      ? published
      : published.filter((project) => project.type === type);

  const countFor = (option: ProjectType) =>
    published.filter((project) => project.type === option).length;

  return (
    <div ref={scope}>
      <section className={`${shell} py-12 md:py-16`}>
        <p className="eyebrow" data-reveal>
          Index of work
        </p>
        <h1
          className="mt-4 font-display text-[clamp(2.5rem,9vw,5rem)] uppercase leading-[0.92]"
          data-reveal
        >
          The <span className="nb-mark">work</span>
        </h1>
        <p
          className="mt-5 max-w-xl text-lg font-medium leading-snug text-muted"
          data-reveal
        >
          {published.length} shipped projects. Every one has source you can read;
          the ones with somewhere to click have a demo too.
        </p>

        {availableTypes.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2.5" data-reveal>
            <button
              type="button"
              onClick={() => setType('all')}
              aria-pressed={type === 'all'}
              className={`nb-box nb-press px-3.5 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-wider ${
                type === 'all'
                  ? 'nb-shadow bg-primary text-on-primary'
                  : 'nb-shadow bg-surface'
              }`}
            >
              All {published.length}
            </button>
            {availableTypes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setType(option)}
                aria-pressed={type === option}
                className={`nb-box nb-press px-3.5 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-wider ${
                  type === option
                    ? 'nb-shadow bg-primary text-on-primary'
                    : 'nb-shadow bg-surface'
                }`}
              >
                {TYPE_LABELS[option]} {countFor(option)}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className={`${shell} pb-16 md:pb-24`}>
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project, index) => (
            <article
              key={project.id}
              className="nb-card flex flex-col overflow-hidden"
              data-reveal
            >
              <div className="relative border-b-[3px] border-border">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  <NoPreview project={project} />
                )}

                <span className="nb-box absolute left-3 top-3 bg-background px-2.5 py-1 font-display text-sm">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="nb-box absolute right-3 top-3 bg-primary px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-on-primary">
                  {TYPE_LABELS[project.type]}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl uppercase leading-tight">
                    {project.title}
                  </h2>
                  {project.featured && (
                    <span
                      aria-label="Featured"
                      title="Featured"
                      className="shrink-0 font-display text-lg text-primary"
                    >
                      ★
                    </span>
                  )}
                </div>

                <p className="mt-3 line-clamp-4 flex-1 font-medium leading-snug text-muted">
                  {project.description}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li key={tech} className="nb-pill">
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nb-btn-primary flex-1 px-4 py-2.5 text-xs"
                    >
                      Live
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`nb-btn-plain px-4 py-2.5 text-xs ${
                      project.liveUrl ? 'flex-1' : 'w-full'
                    }`}
                  >
                    {project.liveUrl ? 'Source' : 'Read the source'}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
