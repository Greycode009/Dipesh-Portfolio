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

const SITE_URL = 'https://dipeshmalla.vercel.app';

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

const { render, routes } = await import(
  pathToFileURL(join(ssrDir, 'entry-server.js')).href
);

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
      `<div id="root">${render(route.path)}</div>`,
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
