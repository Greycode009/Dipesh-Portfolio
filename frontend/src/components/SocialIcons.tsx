import { useContent } from '@/hooks/useContent';

export default function SocialIcons({ className = '' }: { className?: string }) {
  const { socials } = useContent();

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {socials.map((social) => (
        <li key={social.id}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="nb-box nb-shadow nb-press block bg-surface px-4 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-wider"
          >
            {social.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
