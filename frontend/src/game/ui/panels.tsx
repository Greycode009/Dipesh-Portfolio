import { useEffect, useRef, useState, type FormEvent } from 'react';
import { sendContactMessage } from '@/api/contact';
import { bio, timeline } from '@/content/bio';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';
import type { Proficiency } from '@/types/content';
import Panel from './Panel';

// ------------------------------------------------------------ projects

export function ProjectPanel({
  projectId,
  onClose,
}: {
  projectId: number;
  onClose: () => void;
}) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return null;

  return (
    <Panel title={project.title} onClose={onClose}>
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          className="mb-4 w-full rounded border-2 border-border object-cover"
        />
      ) : (
        <p className="mb-4 rounded border-2 border-border bg-background p-4 font-pixel text-[0.5rem] leading-relaxed text-muted">
          NO SCREENSHOT — THIS ONE LIVES IN THE TERMINAL
        </p>
      )}
      <p className="mb-4 leading-relaxed text-muted">{project.description}</p>

      <div className="mb-5 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded bg-primary/10 px-2 py-1 font-pixel text-[0.5rem] text-primary"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border-2 border-[#241c17] bg-primary px-4 py-2 font-pixel text-[0.55rem] text-on-primary transition-transform hover:-translate-y-0.5"
          >
            PLAY DEMO
          </a>
        )}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border-2 border-border px-4 py-2 font-pixel text-[0.55rem] transition-transform hover:-translate-y-0.5"
        >
          SOURCE
        </a>
      </div>
    </Panel>
  );
}

// ------------------------------------------------------------ skills

const RARITY: Record<Proficiency, { label: string; colour: string }> = {
  5: { label: 'Legendary', colour: '#e8a33d' },
  4: { label: 'Epic', colour: '#a367d4' },
  3: { label: 'Rare', colour: '#4a8fd4' },
  2: { label: 'Uncommon', colour: '#5fa355' },
  1: { label: 'Common', colour: '#8a8a8a' },
};

export function SkillsPanel({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState(skills[0]);

  return (
    <Panel title="Inventory" onClose={onClose}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-2">
        {skills.map((skill) => {
          const rarity = RARITY[skill.proficiency];
          const isSelected = selected?.id === skill.id;
          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => setSelected(skill)}
              aria-pressed={isSelected}
              title={skill.name}
              style={{ borderColor: rarity.colour }}
              className={`flex aspect-square items-center justify-center rounded border-2 bg-background text-xl transition-transform hover:scale-105 ${
                isSelected ? 'scale-105 ring-2 ring-primary' : ''
              }`}
            >
              <i
                className={skill.icon}
                style={{ color: rarity.colour }}
                aria-hidden="true"
              />
              <span className="sr-only">{skill.name}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-5 rounded border-2 border-border bg-background p-4">
          <p className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-pixel text-[0.6rem]">{selected.name}</span>
            <span
              className="font-pixel text-[0.5rem]"
              style={{ color: RARITY[selected.proficiency].colour }}
            >
              {RARITY[selected.proficiency].label}
            </span>
          </p>
          <p className="mb-2 font-pixel text-[0.5rem] text-muted">
            {'*'.repeat(selected.proficiency)}
            {'-'.repeat(5 - selected.proficiency)} · {selected.category}
          </p>
          <p className="text-sm leading-relaxed text-muted">
            {selected.description}
          </p>
        </div>
      )}
    </Panel>
  );
}

// ------------------------------------------------------------ about

/** Types the text out, the way a dialogue box should. */
function useTypewriter(text: string, enabled: boolean) {
  const [shown, setShown] = useState(enabled ? '' : text);

  useEffect(() => {
    if (!enabled) {
      setShown(text);
      return;
    }
    setShown('');
    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setShown(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 16);
    return () => window.clearInterval(timer);
  }, [text, enabled]);

  return shown;
}

export function AboutPanel({ onClose }: { onClose: () => void }) {
  const pages = [...bio.story, bio.quote];
  const [page, setPage] = useState(0);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const text = useTypewriter(pages[page], !reducedMotion);
  const isLast = page === pages.length - 1;

  return (
    <Panel title={bio.name} onClose={onClose}>
      <div className="mb-4 flex items-start gap-4">
        <img
          src={bio.portraitUrl}
          alt=""
          className="h-16 w-16 shrink-0 rounded border-2 border-border object-cover"
        />
        <p className="min-h-[7rem] leading-relaxed">{text}</p>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="font-pixel text-[0.5rem] text-muted">
          {page + 1}/{pages.length}
        </span>
        <button
          type="button"
          onClick={() => (isLast ? onClose() : setPage(page + 1))}
          className="rounded border-2 border-[#241c17] bg-primary px-4 py-2 font-pixel text-[0.55rem] text-on-primary"
        >
          {isLast ? 'CLOSE' : 'NEXT'}
        </button>
      </div>

      <h3 className="mb-3 font-pixel text-[0.55rem] text-primary">JOURNEY</h3>
      <ol className="space-y-2">
        {timeline.map((entry) => (
          <li key={entry.id} className="flex gap-3 text-sm">
            <span className="font-pixel text-[0.5rem] text-primary">
              {entry.year}
            </span>
            <span className="text-muted">{entry.title}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

// ------------------------------------------------------------ contact

export function ContactPanel({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    setStatus('sending');
    try {
      await sendContactMessage(formRef.current);
      formRef.current.reset();
      setStatus('sent');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not send.');
      setStatus('error');
    }
  };

  const inputClass =
    'w-full rounded border-2 border-border bg-background px-3 py-2 outline-none focus:border-primary';

  return (
    <Panel title="Mailbox" onClose={onClose}>
      {status === 'sent' ? (
        <p className="py-6 text-center leading-relaxed">
          Your letter is on its way. {bio.name} usually replies within 24 hours.
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted">
            {bio.location} · {bio.email}
          </p>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
            <input name="name" required placeholder="Your name" className={inputClass} />
            <input
              name="email"
              type="email"
              required
              placeholder="Your email"
              className={inputClass}
            />
            <input
              name="subject"
              required
              placeholder="Subject & budget"
              className={inputClass}
            />
            <textarea
              name="message"
              rows={4}
              required
              placeholder="Message"
              className={`${inputClass} resize-y`}
            />
            <input
              type="hidden"
              name="to_email"
              value={import.meta.env.VITE_CONTACT_TO_EMAIL ?? bio.email}
            />

            {status === 'error' && (
              <p className="rounded bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded border-2 border-[#241c17] bg-primary px-4 py-3 font-pixel text-[0.55rem] text-on-primary disabled:opacity-60"
            >
              {status === 'sending' ? 'SENDING...' : 'SEND LETTER'}
            </button>
          </form>
        </>
      )}
    </Panel>
  );
}

// ------------------------------------------------------------ town sign

export function SignPanel({ onClose }: { onClose: () => void }) {
  const houses = projects.filter((project) => project.status === 'published');

  return (
    <Panel title="Town sign" onClose={onClose}>
      <p className="mb-4 leading-relaxed">
        Welcome. Every house on the north street is a project — walk up to a
        door and press E to look inside.
      </p>
      <ul className="mb-5 space-y-1.5">
        {houses.map((project, index) => (
          <li key={project.id} className="font-pixel text-[0.5rem] text-muted">
            {String(index + 1).padStart(2, '0')} · {project.title}
          </li>
        ))}
      </ul>
      <p className="text-sm leading-relaxed text-muted">
        The library holds the skills, the post office takes messages, and the
        house at the east end is where the story is.
      </p>
    </Panel>
  );
}

// ------------------------------------------------------------ cat

export function CatPanel({ onClose }: { onClose: () => void }) {
  return (
    <Panel title="Cat" onClose={onClose}>
      <p className="py-4 text-center leading-relaxed">
        The cat blinks slowly at you, which is apparently how cats say hello.
      </p>
      <p className="text-center font-pixel text-[0.5rem] text-muted">
        It goes back to sleep.
      </p>
    </Panel>
  );
}
