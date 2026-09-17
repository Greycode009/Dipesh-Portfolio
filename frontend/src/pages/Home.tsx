import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from '@/components/SectionHeading';
import TechTag from '@/components/TechTag';
import { bio, expertise, homeIntro } from '@/content/bio';

const heartbeat = {
  scale: [1, 1.05, 1, 1.05, 1],
  transition: {
    duration: 4,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'loop' as const,
  },
};

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-20">
      <motion.div
        className="flex min-h-[70vh] flex-col-reverse items-center justify-between py-16 md:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mt-8 flex-1 md:mt-0 md:pr-10">
          <motion.h1
            className="mb-2 text-4xl font-bold md:text-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Hi, I&apos;m <span className="text-primary">{bio.name}</span>
          </motion.h1>

          <motion.p
            className="mb-5 text-2xl font-normal text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {bio.headline}
          </motion.p>

          <motion.p
            className="mb-8 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {homeIntro}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link
              to="/projects"
              className="rounded bg-primary px-6 py-3 font-medium text-on-primary transition-all duration-300 hover:-translate-y-1 hover:bg-secondary"
            >
              View Work
            </Link>
            <Link
              to="/contact"
              className="rounded border-2 border-primary px-6 py-3 font-medium transition-all duration-300 hover:-translate-y-1 hover:bg-primary/10"
            >
              Contact Me
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="flex flex-1 items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div
            className="relative w-4/5 max-w-md overflow-hidden rounded-full p-2 shadow-2xl"
            animate={heartbeat}
          >
            <img
              src={bio.avatarUrl}
              alt={bio.name}
              className="block h-auto w-full"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.section
        className="mt-14 pb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <SectionHeading>My Expertise</SectionHeading>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {expertise.map((item) => (
            <motion.article
              key={item.id}
              className="relative overflow-hidden rounded-xl border border-primary/10 bg-surface p-8 transition-all duration-300"
              whileHover={{ y: -15, boxShadow: '0 15px 30px rgb(0 0 0 / 0.25)' }}
            >
              <div className="absolute left-0 top-0 h-1 w-full bg-primary" />

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
                <i className={item.icon} aria-hidden="true" />
              </div>

              <h3 className="mb-3 text-xl font-medium">{item.title}</h3>
              <p className="mb-4 text-muted">{item.description}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Link
            to="/about"
            className="group inline-flex items-center rounded-full bg-primary/10 px-4 py-2 font-medium text-primary transition-all duration-300 hover:bg-primary/20"
          >
            View My Full Skill Set
            <i
              className="fas fa-arrow-right ml-2 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
