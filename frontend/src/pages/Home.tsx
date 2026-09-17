import { Link } from 'react-router-dom';
import { bio, expertise, homeIntro } from '@/content/bio';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';
import { gsap, infiniteMarquee } from '@/lib/animations';
import { usePageAnimations } from '@/hooks/usePageAnimations';

const shell = 'mx-auto max-w-[92rem] px-5 sm:px-8';

export default function Home() {
  const scope = usePageAnimations((root) => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    const lines = root.querySelectorAll('[data-hero-line]');
    const items = root.querySelectorAll('[data-hero-item]');
    const portrait = root.querySelector('[data-hero-portrait]');

    /*
     * fromTo, not from. `from` takes the element's *current* value as its
     * destination, so if a previous run left an inline style behind — a
     * killed timeline, a motion toggle, React's double-mount in development —
     * the next run animates to that stale value and the hero stays hidden.
     * Spelling out both ends makes the result independent of what the DOM
     * happens to be holding.
     *
     * The headline lines sit in overflow-hidden blocks, so sliding them up
     * reads as the type being uncovered rather than fading in.
     */
    if (lines.length) {
      timeline.fromTo(
        lines,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.85, stagger: 0.08 },
      );
    }
    if (items.length) {
      timeline.fromTo(
        items,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 },
        '-=0.5',
      );
    }
    if (portrait) {
      // rotate ends at 2deg to match the `rotate-2` class: GSAP replaces the
      // whole transform, so Tailwind's rotation has to be restated here.
      timeline.fromTo(
        portrait,
        { opacity: 0, scale: 0.94, rotate: -4 },
        { opacity: 1, scale: 1, rotate: 2, duration: 0.7 },
        '-=0.6',
      );
    }

    const track = root.querySelector<HTMLElement>('[data-marquee]');
    const stopMarquee = track ? infiniteMarquee(track) : undefined;

    // No timeline.kill() here: the gsap.context this runs inside reverts
    // everything it created, restoring the inline styles. Killing first would
    // freeze them instead, leaving them for the next run to inherit.
    return () => stopMarquee?.();
  });

  const featured = projects
    .filter((project) => project.status === 'published')
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder,
    )
    .slice(0, 3);

  const ticker = skills.map((skill) => skill.name);
  const nameParts = bio.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const stats = [
    { value: String(projects.length), label: 'Projects shipped' },
    { value: String(skills.length), label: 'Tools in the box' },
    { value: '2yr', label: 'Building for the web' },
  ];

  return (
    <div ref={scope}>
      {/* ------------------------------------------------------------ hero */}
      <section className={`${shell} grid gap-10 py-12 md:grid-cols-12 md:py-20`}>
        <div className="md:col-span-7">
          <p className="nb-pill nb-shadow" data-hero-item>
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
            {bio.headline} · {bio.location}
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.75rem,9vw,5.5rem)] uppercase leading-[0.92]">
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="block" data-hero-line>
                {firstName}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="block" data-hero-line>
                <span className="nb-mark">{lastName}</span>
              </span>
            </span>
          </h1>

          <p
            className="mt-7 max-w-xl text-lg font-medium leading-snug text-muted"
            data-hero-item
          >
            {homeIntro}
          </p>

          <div className="mt-9 flex flex-wrap gap-4" data-hero-item>
            <Link to="/projects" className="nb-btn-primary">
              See the work →
            </Link>
            <Link to="/contact" className="nb-btn-plain">
              Hire me
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-3" data-hero-item>
            {stats.map((stat) => (
              <div key={stat.label} className="nb-card px-5 py-3">
                <dt className="font-display text-2xl leading-none">
                  {stat.value}
                </dt>
                <dd className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-5">
          {/*
            The outer element is what GSAP animates, so it carries the tilt and
            nothing else. Hover lives on the inner card: GSAP writes an inline
            transform here, and an inline style beats a hover class.
            Capped from md up — at full column width the 4:5 portrait was 739px
            tall on a 900px screen, pushing everything else out of the first
            view. Mobile is left alone; it scrolls anyway.
          */}
          <div
            className="relative rotate-2 pb-6 md:ml-auto md:max-w-[22rem] xl:max-w-[26rem]"
            data-hero-portrait
          >
            <div className="nb-box nb-shadow-lg nb-lift overflow-hidden bg-surface">
              <img
                src={bio.avatarUrl}
                alt={bio.name}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            {/* Detached sticker: sits off the card's bottom-right corner and
                counter-rotates so it reads level against the tilt. */}
            <p className="nb-box nb-shadow absolute -bottom-1 -right-2 flex -rotate-2 items-center gap-2 whitespace-nowrap bg-primary px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-on-primary sm:-right-4">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-on-primary"
              />
              {bio.availableForWork ? 'Available for work' : 'Currently booked'}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- ticker */}
      <div className="overflow-hidden border-y-[3px] border-border bg-primary py-3 text-on-primary">
        <div className="flex w-max gap-8" data-marquee>
          {[...ticker, ...ticker].map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="whitespace-nowrap font-display text-sm uppercase"
            >
              {name} <span aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------- expertise */}
      <section className={`${shell} py-14 md:py-20`}>
        <p className="eyebrow" data-reveal>
          01 — What I do
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {expertise.map((item, index) => (
            <article key={item.id} className="nb-card p-6" data-reveal>
              <span className="nb-box flex h-11 w-11 items-center justify-center bg-primary font-display text-base text-on-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-5 font-display text-xl uppercase leading-tight">
                {item.title}
              </h2>
              <p className="mt-3 font-medium leading-snug text-muted">
                {item.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <li key={tech} className="nb-pill">
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ recent work */}
      <section className={`${shell} pb-14 md:pb-20`}>
        <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
          <p className="eyebrow">02 — Selected work</p>
          <Link
            to="/projects"
            className="font-mono text-xs font-bold uppercase tracking-wider underline decoration-primary decoration-[3px] underline-offset-4"
          >
            All {projects.length} projects →
          </Link>
        </div>

        <ul className="mt-8 space-y-5">
          {featured.map((project, index) => (
            <li key={project.id} data-reveal>
              <Link
                to="/projects"
                className="nb-card nb-press flex flex-wrap items-center gap-4 p-5 sm:gap-6"
              >
                <span className="nb-box flex h-12 w-12 shrink-0 items-center justify-center bg-background font-display text-lg">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl uppercase leading-tight sm:text-2xl">
                    {project.title}
                  </span>
                  <span className="mt-1 block font-mono text-[0.7rem] uppercase tracking-wider text-muted">
                    {project.technologies.slice(0, 3).join(' · ')}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="nb-box flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-lg text-on-primary"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className={`${shell} pb-16 md:pb-24`}>
        <div
          className="nb-box nb-shadow-lg -rotate-1 bg-primary p-8 text-on-primary md:p-14"
          data-reveal
        >
          <p className="font-mono text-xs font-bold uppercase tracking-wider opacity-80">
            03 — What next
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,5vw,3.25rem)] uppercase leading-[0.95]">
            Got something that needs building?
          </h2>
          <Link to="/contact" className="nb-btn nb-press mt-8 rotate-1 bg-surface text-content">
            Start a conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
