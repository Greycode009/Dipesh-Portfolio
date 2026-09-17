import { useState } from 'react';
import { bio, timeline } from '@/content/bio';
import { skills } from '@/content/skills';
import { usePageAnimations } from '@/hooks/usePageAnimations';
import {
  skillCategories,
  type SkillFilter,
} from '@/content/skillCategories';

const shell = 'mx-auto max-w-[110rem] px-5 sm:px-8';

export default function About() {
  const scope = usePageAnimations();
  const [category, setCategory] = useState<SkillFilter>('all');

  const visible = skills.filter(
    (skill) => category === 'all' || skill.category === category,
  );

  return (
    <div ref={scope}>
      <section className="border-b-2 border-border">
        <div className={`${shell} grid gap-10 py-14 md:grid-cols-12 md:py-20`}>
          <div className="md:col-span-7">
            <p className="eyebrow">{bio.roles.join(' / ')}</p>
            <h1 className="mt-5 text-display font-bold uppercase">
              Profile<span className="text-primary">.</span>
            </h1>
          </div>

          <div className="space-y-5 text-lg leading-snug md:col-span-5">
            {bio.story.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- skills */}
      <section className="border-b-2 border-border">
        <div className={`${shell} py-14 md:py-20`}>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <p className="eyebrow">01 — Stack</p>
            <div className="flex flex-wrap gap-2">
              {skillCategories.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setCategory(option.key)}
                  aria-pressed={category === option.key}
                  className={`border-2 border-border px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] transition-colors ${
                    category === option.key
                      ? 'bg-primary text-on-primary'
                      : 'hover:bg-content hover:text-background'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-px border-2 border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((skill) => (
              <article key={skill.id} className="bg-background p-6" data-reveal>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-bold uppercase leading-none tracking-tight">
                    {skill.name}
                  </h2>
                  <span
                    className="font-mono text-xs tracking-[0.2em] text-primary"
                    aria-label={`${skill.proficiency} out of 5`}
                  >
                    {'█'.repeat(skill.proficiency)}
                    <span className="text-muted">
                      {'░'.repeat(5 - skill.proficiency)}
                    </span>
                  </span>
                </div>
                <p className="mt-3 text-sm leading-snug text-muted">
                  {skill.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- timeline */}
      <section className="border-b-2 border-border">
        <div className={`${shell} py-14 md:py-20`}>
          <p className="eyebrow">02 — Timeline</p>

          <ol className="mt-10 border-t-2 border-border">
            {timeline.map((entry) => (
              <li
                key={entry.id}
                className="grid gap-3 border-b-2 border-border py-7 md:grid-cols-12"
                data-reveal
              >
                <span className="font-mono text-sm tracking-[0.2em] text-primary md:col-span-2">
                  {entry.year}
                </span>
                <h3 className="text-xl font-bold uppercase leading-none tracking-tight md:col-span-4">
                  {entry.title}
                </h3>
                <p className="leading-snug text-muted md:col-span-6">
                  {entry.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${shell} py-14 md:py-20`}>
        <blockquote
          className="max-w-4xl border-l-4 border-primary pl-6 text-2xl font-medium leading-tight sm:text-3xl"
          data-reveal
        >
          {bio.quote}
        </blockquote>
      </section>
    </div>
  );
}
