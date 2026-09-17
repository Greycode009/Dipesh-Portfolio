import { socials } from '@/content/bio';

/** Text links rather than icon buttons — this design prefers words. */
export default function SocialIcons({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {socials.map((social) => (
        <li key={social.id}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-2 border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:bg-primary hover:text-on-primary"
          >
            {social.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
