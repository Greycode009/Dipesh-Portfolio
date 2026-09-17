import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/context/ThemeContext';
import NotFound from '@/pages/NotFound';
import { routes } from '@/routes';

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
  return (
    <ThemeProvider>
      <ScrollToTop />
      <DocumentMeta />
      <div className="min-h-screen bg-background text-content">
        <Sidebar />
        <main className="min-h-screen md:pl-64">
          <Routes>
            {routes.map(({ path, component: Page }) => (
              <Route key={path} path={path} element={<Page />} />
            ))}
            {/* The host rewrites unknown paths to the shell, so catch them
                here rather than rendering an empty page. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}
