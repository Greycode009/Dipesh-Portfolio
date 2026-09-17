import { Link } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import Logo from './Logo';
import MotionToggle from './MotionToggle';
import SocialIcons from './SocialIcons';

export default function Footer() {
  const { bio } = useContent();

  return (
    <footer className="border-t-[3px] border-border bg-surface">
      <div className="mx-auto flex max-w-[92rem] flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs font-medium leading-snug text-muted">
            {bio.location} · {bio.email}
          </p>
          <Link
            to="/contact#guestbook-heading"
            className="nb-pill nb-shadow nb-press mt-5 inline-flex bg-background"
          >
            ✎ Sign the wall
          </Link>
          <Link
            to="/room"
            className="nb-pill nb-shadow nb-press mt-5 inline-flex bg-background"
          >
            ↳ Walk around the studio
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <SocialIcons />
          <MotionToggle />
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            © {new Date().getFullYear()} {bio.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
