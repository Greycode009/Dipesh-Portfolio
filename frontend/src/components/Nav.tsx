import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import ThemeSwitcher from './ThemeSwitcher';

const items = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Work' },
  { to: '/about', label: 'About' },
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

  return (
    <>
      <header className="sticky top-0 z-40 border-b-[3px] border-border bg-background">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <NavLink to="/" aria-label="Home">
            <Logo />
          </NavLink>

          <nav className="hidden items-center gap-2 md:flex">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `nb-box nb-press px-4 py-2 text-sm font-extrabold uppercase tracking-wide ${
                    isActive
                      ? 'nb-shadow bg-primary text-on-primary'
                      : 'nb-shadow bg-surface'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              aria-expanded={isOpen}
              className="nb-box nb-shadow nb-press flex h-10 w-10 items-center justify-center bg-surface md:hidden"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ☰
              </span>
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
          <div className="flex items-center justify-between border-b-[3px] border-border px-5 py-4">
            <Logo />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="nb-box nb-shadow nb-press flex h-10 w-10 items-center justify-center bg-surface text-lg"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-4 p-6">
            {items.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `nb-box nb-shadow-lg flex items-center gap-4 px-6 py-5 font-display text-3xl uppercase ${
                    isActive ? 'bg-primary text-on-primary' : 'bg-surface'
                  }`
                }
              >
                <span className="font-mono text-xs opacity-60">
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
