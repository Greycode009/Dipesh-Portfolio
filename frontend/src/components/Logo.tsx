import { bio } from '@/content/bio';

/** Initials in an accent tile — the site's one piece of "branding". */
export default function Logo() {
  const initials = bio.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="nb-box nb-shadow flex h-10 w-10 items-center justify-center bg-primary font-display text-lg leading-none text-on-primary"
      >
        {initials}
      </span>
      <span className="hidden font-display text-lg leading-none sm:block">
        {bio.name.split(' ')[0]}
      </span>
    </span>
  );
}
