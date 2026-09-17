import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import { ThemeProvider } from '@/context/ThemeContext';
import PublicLayout from '@/components/PublicLayout';
import NotFound from '@/pages/NotFound';
import { routes } from '@/routes';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

// The admin area is a separate chunk: public visitors never download it.
const AdminApp = lazy(() => import('@/pages/admin/AdminApp'));
// The room is an easter egg now, so it only loads for people who ask for it.
const Room = lazy(() => import('@/game/Room'));

/**
 * Keeps <title> and the meta description in step during client-side
 * navigation. The prerendered HTML already carries the correct tags for the
 * initial load; this only covers navigation after hydration.
 */
function DocumentMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = routes.find((candidate) => candidate.path === pathname);
    if (!route) return;

    document.title = route.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', route.description);
  }, [pathname]);

  return null;
}

/** The app minus its router, so the client and the prerenderer can each
 *  supply their own. */
export default function App() {
  useSmoothScroll();

  return (
    <ThemeProvider>
      <ScrollToTop />
      <DocumentMeta />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <p className="p-8 text-muted">Loading the CMS...</p>
              }
            >
              <AdminApp />
            </Suspense>
          }
        />

        <Route
          path="/room"
          element={
            <Suspense
              fallback={
                <p className="p-8 font-mono text-xs uppercase tracking-[0.2em]">
                  Loading the studio…
                </p>
              }
            >
              <Room />
            </Suspense>
          }
        />

        {routes.map(({ path, component: Page }) => (
          <Route
            key={path}
            path={path}
            element={
              <PublicLayout>
                <Page />
              </PublicLayout>
            }
          />
        ))}

        {/* The host rewrites unknown paths to the shell, so catch them here
            rather than rendering an empty page. */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
