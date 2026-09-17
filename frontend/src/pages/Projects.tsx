import { useMemo, useState } from 'react';
import { projects } from '@/content/projects';
import { usePageAnimations } from '@/hooks/usePageAnimations';

const shell = 'mx-auto max-w-[110rem] px-5 sm:px-8';
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
      <section className="border-b-2 border-border">
        <div className={`${shell} py-14 md:py-20`}>
          <p className="eyebrow" data-reveal>Index of work</p>
          <h1 className="mt-5 text-display font-bold uppercase" data-reveal>
            Work<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-snug text-muted">
            {published.length} shipped projects. Every one has source you can read
            and a demo you can click.
          </p>
        </div>
      </section>

      <section className="border-b-2 border-border">
        <div className={`${shell} flex flex-wrap gap-2 py-5`}>
          {technologies.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setFilter(tech)}
              aria-pressed={filter === tech}
              className={`border-2 border-border px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] transition-colors ${
                filter === tech
                  ? 'bg-primary text-on-primary'
                  : 'hover:bg-content hover:text-background'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </section>

      <section className={`${shell} py-14 md:py-20`}>
        {visible.length === 0 ? (
          <div className="border-2 border-border p-10 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Nothing matches {filter}
            </p>
            <button
              type="button"
              onClick={() => setFilter(ALL)}
              className="mt-5 border-2 border-border px-5 py-3 font-mono text-xs uppercase tracking-[0.2em]"
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="grid gap-px border-2 border-border bg-border md:grid-cols-2 xl:grid-cols-3">
            {visible.map((project, index) => (
              <article key={project.id} className="flex flex-col bg-background" data-reveal>
                <div className="relative border-b-2 border-border">
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover grayscale transition-all duration-150 hover:grayscale-0"
                  />
                  <span className="absolute left-0 top-0 border-b-2 border-r-2 border-border bg-background px-3 py-1.5 font-mono text-xs tracking-[0.2em]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {project.featured && (
                    <span className="absolute right-0 top-0 border-b-2 border-l-2 border-border bg-primary px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-on-primary">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-2xl font-bold uppercase leading-none tracking-tight">
                    {project.title}
                  </h2>
                  <p className="mt-4 line-clamp-4 flex-1 leading-snug text-muted">
                    {project.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="border border-border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 grid grid-cols-2 gap-px border-2 border-border bg-border">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary px-3 py-3 text-center font-mono text-[0.65rem] uppercase tracking-[0.15em] text-on-primary"
                    >
                      Live
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-background px-3 py-3 text-center font-mono text-[0.65rem] uppercase tracking-[0.15em] transition-colors hover:bg-content hover:text-background"
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
