#!/usr/bin/env node
/**
 * Release gate. Runs against `dist/` AFTER `astro build` and fails the process if
 * the output is not a complete replica.
 *
 * Astro catches a render error, logs it, and still exits 0 for the pages that did
 * render — so `npm run build` succeeding proves nothing about completeness. This
 * checks the artifact itself:
 *
 *   1. every registry route produced an HTML file
 *   2. the sitemap lists exactly the indexable routes, with the right absolute URLs
 *   3. every internal link and media reference points at a file that exists
 *   4. no page hotlinks the source origin
 *   5. every page has exactly one <h1>, and no page has two
 *
 * Usage: node scripts/verify-build.mjs [--base /bossdanang] [--url https://…]
 *        (both default to the values astro.config.mjs baked into the build)
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};

const SITE_URL = flag('--url', process.env.SITE_URL ?? 'http://localhost:4321');
const SITE_BASE = flag('--base', process.env.SITE_BASE ?? '');

const failures = [];
const notes = [];
const fail = (m) => failures.push(m);

// ------------------------------------------------------- what the site must contain

if (!fs.existsSync(DIST)) {
  console.error('verify-build: dist/ does not exist. Run `npm run build` first.');
  process.exit(1);
}


/**
 * The expected counts are the documented inventory (docs/reference-inventory.md
 * §1). Asserting against fixed numbers, rather than against whatever the build
 * happened to emit, is what makes a missing family a failure instead of a
 * self-consistent pass.
 */
const EXPECTED_ROUTES = Number(flag('--routes', '37'));
const EXPECTED_SITEMAP = Number(flag('--sitemap', '36'));

const htmlFiles = fs.readdirSync(DIST).filter((f) => f.endsWith('.html'));

// ------------------------------------------------------------------ 1. route count

// 404.html is a fallback, not a route: it is not in the registry, not in the
// sitemap, and nothing links to it.
const routeFiles = htmlFiles.filter((f) => f !== '404.html');
if (routeFiles.length !== EXPECTED_ROUTES) {
  fail(`expected ${EXPECTED_ROUTES} routes in dist/, found ${routeFiles.length}. A route is missing or duplicated.`);
}

// ------------------------------------------------------------------ 2. sitemap

const sitemapPath = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  fail('dist/sitemap.xml is missing.');
} else {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length !== EXPECTED_SITEMAP) {
    fail(`expected ${EXPECTED_SITEMAP} <loc> entries in sitemap.xml, found ${locs.length}.`);
  }
  for (const loc of locs) {
    if (!loc.startsWith(SITE_URL)) {
      fail(`sitemap <loc> ${loc} does not start with ${SITE_URL} — the site URL was not applied.`);
    }
  }

  if (locs.some((l) => l.includes('/tim-kiem'))) {
    fail('sitemap lists /tim-kiem, which is noindex.');
  }
}

// --------------------------------------------------- 3. references and 4. hotlinks

// A bare address (info.thebossvietnam@gmail.com) is captured prose, not a hotlink.
const hotlink = /https?:\/\/(www\.)?thebossvietnam\.[a-z]+[^"'<>\s]*/i;
const builtBase = (htmlFiles.length ? fs.readFileSync(path.join(DIST, htmlFiles[0]), 'utf8') : '')
  .match(/(?:src|href)="(\/[^/"']+)\/_astro\//)?.[1] ?? '';
notes.push(builtBase ? `deploy base detected: ${builtBase}` : 'deploy base: none (site served from the domain root)');

let referenceCount = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(DIST, file), 'utf8');

  for (const match of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)) {
    const ref = match[1];
    // Assets are emitted under the deploy base but land in dist/ at the root.
    const rel = builtBase && ref.startsWith(builtBase + '/') ? ref.slice(builtBase.length) : ref;
    if (rel.startsWith('/_astro/') || rel === '/') continue;
    referenceCount++;
    // Internal page links are extensionless (`/gioi-thieu`); the file is `gioi-thieu.html`.
    if (fs.existsSync(path.join(DIST, rel)) || fs.existsSync(path.join(DIST, rel + '.html'))) continue;
    fail(`${file}: reference to ${ref} has no file in dist/`);
  }

  for (const match of html.matchAll(new RegExp(hotlink.source, 'gi'))) {
    fail(`${file}: hotlinks the source origin: ${match[0].slice(0, 80)}`);
  }

  // ---------------------------------------------------------------- 5. one <h1>

  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count === 0) fail(`${file}: no <h1>`);
  if (h1Count > 1) fail(`${file}: ${h1Count} <h1> elements; exactly one is required`);
}

notes.push(`${htmlFiles.length} pages, ${referenceCount} internal references resolved`);

// ------------------------------------------------------------------------ robots

const robotsPath = path.join(DIST, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  fail('dist/robots.txt is missing.');
}

const search = fs.readFileSync(path.join(DIST, 'tim-kiem.html'), 'utf8');
if (/rel="canonical"/.test(search)) fail('tim-kiem.html carries a canonical; a noindex page must not.');
if (!/noindex/.test(search)) fail('tim-kiem.html is missing its noindex robots meta.');

// ------------------------------------------------------------------------ report

for (const n of notes) console.log(`  ${n}`);
if (failures.length) {
  console.error(`\nverify-build: ${failures.length} failure(s)`);
  for (const f of failures.slice(0, 40)) console.error(`  FAIL ${f}`);
  if (failures.length > 40) console.error(`  … and ${failures.length - 40} more`);
  process.exit(1);
}
console.log('verify-build: OK');
