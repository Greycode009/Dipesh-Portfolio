/**
 * Renders every route in src/routes.ts to a static HTML file so crawlers and
 * link previews get real markup instead of an empty <div id="root">.
 *
 * Runs after both Vite builds: the client build supplies the HTML template
 * (with hashed asset tags already injected), the SSR build supplies `render`.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

/** Overridable so a custom domain does not need a code change. */
const SITE_URL = (
  process.env.SITE_URL ?? 'https://dipeshmalla.vercel.app'
).replace(/\/$/, '');

/** Vercel sets both of these; a laptop build sets neither. */
const isCi = Boolean(process.env.CI || process.env.VERCEL);

const escapeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  );

const { render, routes, fetchSiteContent } = await import(
  pathToFileURL(join(ssrDir, 'entry-server.js')).href
);

/**
 * Content comes from the CMS, so the build needs it too — otherwise the static
 * HTML would ship a loading state and there would be nothing for a crawler to
 * read.
 *
 * On a laptop the API is often just not running, so an unreachable API is a
 * warning and the pages render empty. On CI it is a failure: a deploy that
 * quietly ships blank pages is worse than one that does not ship.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A free-tier host puts the API to sleep after a spell of no traffic, and the
 * first request then waits on a cold start that can take about a minute. One
 * failed fetch is therefore not evidence the API is down, so the build knocks
 * a few times before giving up.
 */
async function fetchContentWithRetry(attempts = 6) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fetchSiteContent();
    } catch (error) {
      if (attempt >= attempts) throw error;
      const wait = attempt * 5000;
      console.log(
        `  API did not answer (attempt ${attempt}/${attempts}): ${error.message}` +
          ` — waiting ${wait / 1000}s, it may be waking up`,
      );
      await sleep(wait);
    }
  }
}

let content = null;
try {
  content = await fetchContentWithRetry();
  console.log(
    `fetched content: ${content.projects.length} projects, ` +
      `${content.skills.length} skills, bio for ${content.bio.name}`,
  );
} catch (error) {
  const detail =
    `  API: ${process.env.VITE_API_URL ?? 'http://localhost:4000 (VITE_API_URL is unset)'}
` +
    `  Cause: ${error.message}`;

  if (isCi) {
    throw new Error(
      `Could not reach the API, so every page would ship empty.
` +
        `${detail}
` +
        `  Set VITE_API_URL to the deployed API and check it is reachable.`,
    );
  }

  console.warn(
    `
  WARNING: could not reach the API, so pages are prerendered empty.
` +
      `${detail}
`,
  );
}

const template = await readFile(join(distDir, 'index.html'), 'utf8');

for (const route of routes) {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const canonical = `${SITE_URL}${route.path === '/' ? '' : route.path}`;

  const head = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ');

  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${description}" />\n    ${head}`,
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root">${render(route.path, content)}</div>` +
        (content
          ? `
    <script>window.__CONTENT__=${JSON.stringify(content).replace(/</g, '\u003c')}</script>`
          : ''),
    );

  if (html.includes('<div id="root"></div>')) {
    throw new Error(`Prerender produced no markup for ${route.path}`);
  }

  const outFile =
    route.path === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route.path, 'index.html');

  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, html, 'utf8');
  console.log(`prerendered ${route.path} -> ${outFile.replace(root, '.')}`);
}

await rm(ssrDir, { recursive: true, force: true });
