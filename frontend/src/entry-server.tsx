import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

/**
 * Renders one route to HTML for the prerender step.
 *
 * Framer Motion writes its `initial` state into the markup, so animated
 * elements ship as opacity:0. That is correct for hydration — the client
 * picks up exactly that state and animates from it — but it would leave the
 * page blank for anyone without JavaScript, which the <noscript> rule in
 * index.html covers.
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}

export { routes } from './routes';
