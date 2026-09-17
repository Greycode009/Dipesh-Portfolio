import { Link } from 'react-router-dom';
import { bio } from '@/content/bio';
import SocialIcons from './SocialIcons';

export default function Footer() {
  return (
    <footer className="border-t-2 border-border">
      <div className="mx-auto flex max-w-[110rem] flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-2xl font-bold uppercase leading-none tracking-tight">
            {bio.name}
            <span className="text-primary">.</span>
          </p>
          <p className="eyebrow mt-2">
            {bio.location} · {bio.email}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <SocialIcons />
          <Link
            to="/room"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-primary"
          >
            ↳ Or walk around the studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
