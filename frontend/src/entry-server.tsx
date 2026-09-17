import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import type { SiteContent } from '@/api/content';
import { ContentProvider } from '@/content/ContentContext';
import App from './App';

/**
 * Renders one route to HTML for the prerender step.
 *
 * The content is fetched by the build and handed in here, so the static HTML
 * carries real text rather than a loading state. The browser fetches again on
 * load, which is what makes an edit in the CMS appear without a redeploy.
 */
export function render(url: string, content: SiteContent | null): string {
  return renderToString(
    <StrictMode>
      <ContentProvider initial={content}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </ContentProvider>
    </StrictMode>,
  );
}

export { fetchSiteContent } from '@/api/content';
export { routes } from './routes';
