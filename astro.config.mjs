import { defineConfig } from 'astro/config';

/**
 * Release gate.
 *
 * Publishing (indexable pages + Allow-all robots.txt) happens only when
 * PUBLISH_APPROVED=1 AND SITE_URL is an absolute https URL. Anything else is a
 * local preview build: every page emits noindex,nofollow and robots.txt is
 * `Disallow: /`. `import.meta.env.PROD` is deliberately NOT used — a preview
 * build is production mode too.
 */
const publishApproved = process.env.PUBLISH_APPROVED === '1';
const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.SITE_BASE ?? '';

if (publishApproved) {
  if (!process.env.SITE_URL) {
    throw new Error(
      'Release build blocked: PUBLISH_APPROVED=1 but SITE_URL is not set. ' +
        'Set SITE_URL to the absolute public origin, e.g. SITE_URL=https://tientdat11.github.io/bossdanang.',
    );
  }
  if (!site.startsWith('https://')) {
    throw new Error(
      `Release build blocked: PUBLISH_APPROVED=1 but SITE_URL is not an absolute https URL (got "${site}"). ` +
        'Fix SITE_URL, or unset PUBLISH_APPROVED to build a noindex local preview.',
    );
  }
}

new URL(site); // fail fast on a malformed SITE_URL

// `site` must be the bare origin: a project site may legitimately be configured
// either as SITE_URL=https://host/bossdanang + SITE_BASE=/bossdanang or as
// SITE_URL=https://host + SITE_BASE=/bossdanang. Strip a repeated base so
// canonical/og:url/sitemap never carry the prefix twice.
const basePath = base.replace(/^\/+|\/+$/g, '');
const origin = basePath && site.endsWith(`/${basePath}`) ? site.slice(0, -(basePath.length + 1)) : site;

const publish = publishApproved && origin.startsWith('https://');

export default defineConfig({
  site: origin,
  base: basePath ? `/${basePath}` : '',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  vite: {
    // Build-time config handed to src/data/site.ts (declared there via `declare global`).
    define: {
      __SITE_URL__: JSON.stringify(origin),
      __SITE_BASE__: JSON.stringify(basePath),
      __PUBLISH__: JSON.stringify(publish),
    },
  },
});
