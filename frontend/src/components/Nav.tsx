import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { bio } from '@/content/bio';
import ThemeSwitcher from './ThemeSwitcher';

const items = [
  { to: '/', label: 'Index', end: true },
  { to: '/projects', label: 'Work' },
  { to: '/about', label: 'Profile' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
      isActive ? 'text-primary' : 'text-content hover:text-primary'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-border bg-background">
        <div className="mx-auto flex max-w-[110rem] items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <NavLink
            to="/"
            className="text-lg font-bold uppercase leading-none tracking-tight"
          >
            {bio.name}
            <span className="text-primary">.</span>
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              aria-expanded={isOpen}
              className="border-2 border-border px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] md:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
          <div className="flex items-center justify-between border-b-2 border-border px-5 py-4">
            <span className="text-lg font-bold uppercase tracking-tight">
              {bio.name}
              <span className="text-primary">.</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="border-2 border-border px-3 py-2 font-mono text-xs uppercase tracking-[0.2em]"
            >
              Close
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center">
            {items.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-baseline gap-4 border-b-2 border-border px-5 py-5 text-headline font-bold uppercase ${
                    isActive ? 'text-primary' : ''
                  }`
                }
              >
                <span className="font-mono text-xs tracking-[0.2em] text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
