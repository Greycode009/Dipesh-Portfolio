import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '@/content/projects';

const ALL = 'all';

export default function Projects() {
  const [filter, setFilter] = useState<string>(ALL);

  const published = useMemo(
    () =>
      projects
        .filter((project) => project.status === 'published')
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [],
  );

  const technologies = useMemo(
    () => [...new Set(published.flatMap((project) => project.technologies))],
    [published],
  );

  const visible =
    filter === ALL
      ? published
      : published.filter((project) => project.technologies.includes(filter));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-2 text-center text-4xl font-bold text-primary"
      >
        My Projects
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-10 text-center text-lg text-muted"
      >
        Here are some of my recent work. Feel free to check them out!
      </motion.p>

      <motion.div
        className="mb-12 flex flex-wrap justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {[ALL, ...technologies].map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => setFilter(tech)}
            aria-pressed={filter === tech}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              filter === tech
                ? 'bg-primary text-on-primary'
                : 'bg-surface text-content hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {tech === ALL ? 'All' : tech}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <motion.article
            key={project.id}
            className="overflow-hidden rounded-xl border border-primary/10 bg-surface shadow-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{
              y: -10,
              boxShadow: '0 15px 30px rgb(0 0 0 / 0.25)',
              transition: { duration: 0.2 },
            }}
          >
            <div className="relative">
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                loading="lazy"
                className="h-48 w-full object-cover"
              />
              {project.featured && (
                <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary shadow-lg">
                  Featured
                </span>
              )}
            </div>

            <div className="p-6">
              <h2 className="mb-2 text-xl font-semibold">{project.title}</h2>
              <p className="mb-4 line-clamp-3 text-muted">
                {project.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <i className="fab fa-github text-lg" aria-hidden="true" />
                  <span>GitHub</span>
                </a>

                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-secondary"
                >
                  <i
                    className="fas fa-external-link-alt text-sm"
                    aria-hidden="true"
                  />
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="py-10 text-center">
          <p className="mb-4 text-muted">
            No projects found with the selected filter.
          </p>
          <button
            type="button"
            onClick={() => setFilter(ALL)}
            className="rounded-md bg-primary/10 px-4 py-2 text-primary transition-colors hover:bg-primary/20"
          >
            Show All Projects
          </button>
        </div>
      )}
    </div>
  );
}
