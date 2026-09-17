import { useEffect } from 'react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const adminNav = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/timeline', label: 'Timeline' },
  { to: '/admin/expertise', label: 'Expertise' },
  { to: '/admin/socials', label: 'Socials' },
  { to: '/admin/bio', label: 'Bio' },
  { to: '/admin/guestbook', label: 'Guestbook' },
];

export default function AdminLayout() {
  const { isAuthenticated, isLoading, email, signOut } = useAuth();
  const location = useLocation();

  // The admin area must never be indexed.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  if (isLoading) {
    return <p className="p-8 text-muted">Checking your session...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-sm uppercase tracking-wider text-muted">
            Portfolio CMS
          </p>
          <p className="font-medium">{email}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-primary/10"
        >
          Sign out
        </button>
      </header>

      <nav className="mb-10 flex flex-wrap gap-2">
        {adminNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface text-content hover:bg-primary/10 hover:text-primary'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
