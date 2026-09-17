import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import SocialIcons from '@/components/SocialIcons';
import { bio, timeline } from '@/content/bio';
import { skillCategories, skills, type SkillFilter } from '@/content/skills';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

export default function About() {
  const [category, setCategory] = useState<SkillFilter>('all');

  const visibleSkills = skills.filter(
    (skill) => category === 'all' || skill.category === category,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.header
        className="mb-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="mb-4 text-4xl font-bold md:text-5xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          About Me
        </motion.h1>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {bio.roles.map((role, index) => (
            <span key={role} className="flex items-center gap-3">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
              {role}
            </span>
          ))}
        </motion.div>
      </motion.header>

      <motion.section className="mb-20" {...fadeIn} transition={{ duration: 0.6 }}>
        <SectionHeading>My Story</SectionHeading>

        <div className="flex flex-col items-center gap-10 md:flex-row">
          <div className="flex-1 space-y-5 text-lg leading-relaxed">
            {bio.story.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-1 justify-center">
            <div className="relative w-64 overflow-hidden rounded-2xl border border-primary/20 p-2">
              <img
                src={bio.portraitUrl}
                alt={bio.name}
                className="block h-auto w-full rounded-xl"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="mb-20" {...fadeIn} transition={{ duration: 0.5 }}>
        <SectionHeading>My Skills</SectionHeading>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {skillCategories.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setCategory(option.key)}
              aria-pressed={category === option.key}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                category === option.key
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface text-content hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleSkills.map((skill, index) => (
            <motion.article
              key={skill.id}
              className="relative overflow-hidden rounded-xl border border-primary/10 bg-surface p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              whileHover={{
                y: -10,
                boxShadow: '0 10px 25px rgb(0 0 0 / 0.25)',
                transition: { duration: 0.2 },
              }}
            >
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-secondary" />

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
                <i className={skill.icon} aria-hidden="true" />
              </div>

              <h3 className="mb-2 text-lg font-semibold">{skill.name}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {skill.description}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="mb-20" {...fadeIn} transition={{ duration: 0.6 }}>
        <SectionHeading>My Journey</SectionHeading>

        <ol className="relative mx-auto max-w-2xl border-l-2 border-primary/40 pl-8">
          {timeline.map((entry, index) => (
            <motion.li
              key={entry.id}
              className="relative mb-10 last:mb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
            >
              <span
                aria-hidden="true"
                className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-4 border-background bg-primary"
              />
              <div className="rounded-xl border border-primary/10 bg-surface p-6">
                <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-sm font-semibold text-on-primary">
                  {entry.year}
                </span>
                <h3 className="mb-1 text-lg font-semibold">{entry.title}</h3>
                <p className="text-muted">{entry.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.section>

      <motion.blockquote
        className="mx-auto mb-20 max-w-3xl rounded-xl border-l-4 border-primary bg-surface p-8 text-lg italic leading-relaxed text-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {bio.quote}
      </motion.blockquote>

      <motion.section
        className="text-center"
        {...fadeIn}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading>Let&apos;s Connect</SectionHeading>
        <p className="mb-8 text-muted">
          I&apos;m always open to new opportunities, collaborations, and
          interesting conversations.
        </p>
        <SocialIcons className="justify-center" />
      </motion.section>
    </div>
  );
}
