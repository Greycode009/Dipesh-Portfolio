import { Link } from 'react-router-dom';
import { bio, expertise, homeIntro } from '@/content/bio';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';
import { gsap, infiniteMarquee } from '@/lib/animations';
import { usePageAnimations } from '@/hooks/usePageAnimations';

const shell = 'mx-auto max-w-[110rem] px-5 sm:px-8';

export default function Home() {
  const scope = usePageAnimations((root) => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    const lines = root.querySelectorAll('[data-hero-line]');
    const items = root.querySelectorAll('[data-hero-item]');
    const portrait = root.querySelector('[data-hero-portrait]');

    // Each headline line sits in an overflow-hidden block, so sliding it up
    // from below reads as the type being uncovered rather than fading in.
    if (lines.length) {
      timeline.from(lines, { yPercent: 115, duration: 0.9, stagger: 0.09 });
    }
    if (items.length) {
      timeline.from(
        items,
        { opacity: 0, y: 24, duration: 0.7, stagger: 0.08 },
        '-=0.55',
      );
    }
    if (portrait) {
      timeline.from(
        portrait,
        { opacity: 0, scale: 1.06, duration: 0.9 },
        '-=0.8',
      );
    }

    // The portrait drifts slightly slower than the page.
    const portraitImage = root.querySelector('[data-hero-portrait] img');
    if (portraitImage) {
      gsap.to(portraitImage, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: portraitImage,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    const track = root.querySelector<HTMLElement>('[data-marquee]');
    const stopMarquee = track ? infiniteMarquee(track) : undefined;

    return () => {
      timeline.kill();
      stopMarquee?.();
    };
  });

  const featured = projects
    .filter((project) => project.status === 'published')
    .sort(
      (a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder,
    )
    .slice(0, 3);

  const ticker = skills.map((skill) => skill.name);
  const [firstName, ...restName] = bio.name.split(' ');

  return (
    <div ref={scope}>
      {/* ------------------------------------------------------------ hero */}
      <section className="border-b-2 border-border">
        <div className={`${shell} grid gap-10 py-14 md:grid-cols-12 md:py-20`}>
          <div className="md:col-span-8">
            <p className="eyebrow" data-hero-item>
              {bio.headline} — {bio.location}
            </p>

            <h1 className="mt-5 text-display font-bold uppercase">
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="block" data-hero-line>
                  {firstName}
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="block" data-hero-line>
                  {restName.join(' ')}
                  <span className="text-primary">.</span>
                </span>
              </span>
            </h1>

            <p
              className="mt-8 max-w-2xl text-lg leading-snug text-muted sm:text-xl"
              data-hero-item
            >
              {homeIntro}
            </p>

            <div className="mt-10 flex flex-wrap gap-4" data-hero-item>
              <Link
                to="/projects"
                className="block-shadow-hover border-2 border-border bg-primary px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-on-primary"
              >
                See the work
              </Link>
              <Link
                to="/contact"
                className="block-shadow-hover border-2 border-border px-7 py-4 font-mono text-xs uppercase tracking-[0.2em]"
              >
                Hire me
              </Link>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="border-2 border-border" data-hero-portrait>
              <div className="overflow-hidden">
                <img
                  src={bio.avatarUrl}
                  alt={bio.name}
                  className="aspect-square w-full scale-110 object-cover grayscale transition-all duration-150 hover:grayscale-0"
                />
              </div>
              <p className="border-t-2 border-border px-4 py-3 font-mono text-xs uppercase tracking-[0.2em]">
                {bio.availableForWork ? 'Available for work' : 'Currently booked'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- ticker */}
      <div className="overflow-hidden border-b-2 border-border bg-primary py-3 text-on-primary">
        <div className="flex w-max gap-8" data-marquee>
          {[...ticker, ...ticker].map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em]"
            >
              {name} <span aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------- expertise */}
      <section className="border-b-2 border-border">
        <div className={`${shell} py-14 md:py-20`}>
          <p className="eyebrow" data-reveal>
            01 — What I do
          </p>

          <div className="mt-10 grid gap-px border-2 border-border bg-border md:grid-cols-3">
            {expertise.map((item, index) => (
              <article key={item.id} className="bg-background p-7" data-reveal>
                <p className="font-mono text-xs tracking-[0.2em] text-primary">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-4 text-2xl font-bold uppercase leading-none tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-4 leading-snug text-muted">{item.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="border-2 border-border px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.15em]"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ recent work */}
      <section className="border-b-2 border-border">
        <div className={`${shell} py-14 md:py-20`}>
          <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
            <p className="eyebrow">02 — Selected work</p>
            <Link
              to="/projects"
              className="font-mono text-xs uppercase tracking-[0.2em] text-primary"
            >
              All {projects.length} projects →
            </Link>
          </div>

          <ul className="mt-10 border-t-2 border-border">
            {featured.map((project, index) => (
              <li key={project.id} data-reveal>
                <Link
                  to="/projects"
                  className="group grid items-center gap-4 border-b-2 border-border py-6 transition-colors hover:bg-primary hover:text-on-primary md:grid-cols-12"
                >
                  <span className="font-mono text-xs tracking-[0.2em] md:col-span-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl font-bold uppercase leading-none tracking-tight md:col-span-5">
                    {project.title}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.15em] md:col-span-5">
                    {project.technologies.slice(0, 3).join(' / ')}
                  </p>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xl transition-transform duration-150 group-hover:translate-x-2 md:col-span-1 md:text-right"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className={`${shell} py-14 md:py-24`}>
        <div
          className="border-2 border-border bg-primary p-8 text-on-primary md:p-14"
          data-reveal
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-80">
            03 — Next
          </p>
          <h2 className="mt-5 max-w-4xl text-headline font-bold uppercase">
            Got something that needs building?
          </h2>
          <Link
            to="/contact"
            className="mt-9 inline-block border-2 border-current bg-background px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-content"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
