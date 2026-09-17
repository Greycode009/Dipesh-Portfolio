import { useMemo, useState } from 'react';
import { projects } from '@/content/projects';
import { usePageAnimations } from '@/hooks/usePageAnimations';

const shell = 'mx-auto max-w-[92rem] px-5 sm:px-8';
const ALL = 'All';

export default function Projects() {
  const scope = usePageAnimations();
  const [filter, setFilter] = useState(ALL);

  const published = useMemo(
    () =>
      projects
        .filter((project) => project.status === 'published')
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [],
  );

  const technologies = useMemo(
    () => [ALL, ...new Set(published.flatMap((project) => project.technologies))],
    [published],
  );

  const visible =
    filter === ALL
      ? published
      : published.filter((project) => project.technologies.includes(filter));

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
          {published.length} shipped projects. Every one has source you can read
          and a demo you can click.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5" data-reveal>
          {technologies.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setFilter(tech)}
              aria-pressed={filter === tech}
              className={`nb-box nb-press px-3.5 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-wider ${
                filter === tech
                  ? 'nb-shadow bg-primary text-on-primary'
                  : 'nb-shadow bg-surface'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </section>

      <section className={`${shell} pb-16 md:pb-24`}>
        {visible.length === 0 ? (
          <div className="nb-card p-10 text-center">
            <p className="font-display text-xl uppercase">
              Nothing matches {filter}
            </p>
            <button
              type="button"
              onClick={() => setFilter(ALL)}
              className="nb-btn-primary mt-6"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((project, index) => (
              <article
                key={project.id}
                className="nb-card flex flex-col overflow-hidden"
                data-reveal
              >
                <div className="relative border-b-[3px] border-border">
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <span className="nb-box absolute left-3 top-3 bg-background px-2.5 py-1 font-display text-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {project.featured && (
                    <span className="nb-box absolute right-3 top-3 bg-primary px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-on-primary">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-xl uppercase leading-tight">
                    {project.title}
                  </h2>
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
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nb-btn-primary flex-1 px-4 py-2.5 text-xs"
                    >
                      Live
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nb-btn-plain flex-1 px-4 py-2.5 text-xs"
                    >
                      Source
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
