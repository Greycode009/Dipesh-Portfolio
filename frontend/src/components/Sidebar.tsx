import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { bio } from '@/content/bio';
import SocialIcons from './SocialIcons';
import ThemeSwitcher from './ThemeSwitcher';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer whenever navigation happens.
  useEffect(() => setIsOpen(false), [pathname]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        className={`fixed right-6 top-6 z-50 flex h-10 w-10 flex-col items-center justify-center rounded-md border border-border bg-surface shadow-md transition-all duration-300 hover:shadow-lg md:hidden ${
          isOpen ? 'rotate-90' : ''
        }`}
      >
        <span
          className={`mb-1.5 block h-0.5 w-6 bg-primary transition-all duration-300 ${
            isOpen ? 'translate-y-2 rotate-45' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`mt-1.5 block h-0.5 w-6 bg-primary transition-all duration-300 ${
            isOpen ? '-translate-y-2 -rotate-45' : ''
          }`}
        />
      </button>

      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border bg-surface p-6 shadow-xl transition-transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-border pb-8 pt-6">
          <h2 className="text-2xl font-bold text-primary">{bio.name}</h2>
          <p className="mt-1 text-muted">{bio.headline}</p>
        </div>

        <nav className="my-8">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `block rounded-md px-4 py-2 transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-content hover:bg-primary/10 hover:text-primary'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mb-6">
          <ThemeSwitcher />
        </div>

        <div className="mt-auto border-t border-border pt-6">
          <SocialIcons className="justify-center" />
        </div>
      </aside>
    </>
  );
}
