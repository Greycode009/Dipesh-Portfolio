import { useState } from 'react';
import { skillCategoriesOf } from '@/api/content';
import { useContent } from '@/hooks/useContent';
import { usePageAnimations } from '@/hooks/usePageAnimations';

const shell = 'mx-auto max-w-[92rem] px-5 sm:px-8';

export default function About() {
  const { bio, skills } = useContent();
  const scope = usePageAnimations();
  const [category, setCategory] = useState('all');
  const skillCategories = skillCategoriesOf(skills);

  const visible = skills.filter(
    (skill) => category === 'all' || skill.category === category,
  );

  return (
    <div ref={scope}>
      <section className={`${shell} grid gap-10 py-12 md:grid-cols-12 md:py-16`}>
        <div className="md:col-span-5">
          <p className="eyebrow" data-reveal>
            Who you would be working with
          </p>
          <h1
            className="mt-4 font-display text-[clamp(2.5rem,9vw,5rem)] uppercase leading-[0.92]"
            data-reveal
          >
            <span className="nb-mark">About</span>
          </h1>
          <ul className="mt-6 flex flex-wrap gap-2" data-reveal>
            {bio.roles.map((role) => (
              <li key={role} className="nb-pill nb-shadow">
                {role}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-7">
          <div className="nb-card space-y-5 p-7 text-lg font-medium leading-snug" data-reveal>
            {bio.story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- skills */}
      <section className={`${shell} pb-14 md:pb-20`}>
        <div className="flex flex-wrap items-end justify-between gap-5" data-reveal>
          <p className="eyebrow">01 — The toolkit</p>
          <div className="flex flex-wrap gap-2.5">
            {skillCategories.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setCategory(option.key)}
                aria-pressed={category === option.key}
                className={`nb-box nb-press px-3.5 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-wider ${
                  category === option.key
                    ? 'nb-shadow bg-primary text-on-primary'
                    : 'nb-shadow bg-surface'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((skill) => (
            <article key={skill.id} className="nb-card p-6" data-reveal>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg uppercase leading-tight">
                  {skill.name}
                </h2>
                <span
                  className="flex shrink-0 gap-1"
                  aria-label={`${skill.proficiency} out of 5`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      aria-hidden="true"
                      className={`h-3 w-3 rounded-full border-2 border-border ${
                        index < skill.proficiency ? 'bg-primary' : 'bg-background'
                      }`}
                    />
                  ))}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium leading-snug text-muted">
                {skill.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${shell} pb-16 md:pb-24`}>
        <blockquote
          className="nb-box nb-shadow-lg rotate-1 bg-surface p-8 text-xl font-semibold leading-snug md:p-12 md:text-2xl"
          data-reveal
        >
          <span aria-hidden="true" className="font-display text-4xl text-primary">
            “
          </span>
          <p className="mt-2">{bio.quote}</p>
        </blockquote>
      </section>
    </div>
  );
}
