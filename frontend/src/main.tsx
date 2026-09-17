import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import type { SiteContent } from '@/api/content';
import { ContentProvider } from '@/content/ContentContext';
import App from './App';
import 'lenis/dist/lenis.css';
import './styles/index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

/**
 * Content the build embedded in the HTML. Rendering from it first keeps
 * hydration matching the prerendered markup; the provider then refetches so a
 * CMS edit shows up without waiting for a deploy.
 */
const embedded =
  (window as unknown as { __CONTENT__?: SiteContent }).__CONTENT__ ?? null;

const tree = (
  <StrictMode>
    <ContentProvider initial={embedded}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContentProvider>
  </StrictMode>
);

// Prerendered HTML is hydrated; an empty shell (dev server) is mounted fresh.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
