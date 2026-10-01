# bossdanang

Static replica of [thebossvietnam.com](https://thebossvietnam.com) — a Vietnamese
fresh-food brand for dogs and cats. 37 routes, built with Astro, deployed to GitHub
Pages.

Built for the site owner as a reviewable, publishable copy of their own site. The
business copy, photography and fonts belong to the owner; nothing here is a rights
determination. Publishing publicly needs their sign-off on brand, copy, images and
fonts.

## Running it

```bash
npm ci
npm run dev                 # local dev server

npm run check               # import guard + byte-fidelity audit + astro check
npm run build               # astro build, then verify the artifact
npm run preview             # serve dist/ as built
```

`npm run build` runs `scripts/verify-build.mjs` after Astro, and fails if the
output is incomplete. This is deliberate: Astro logs a render error and still exits
0 for the pages that succeeded, so a build-only gate can publish a site that is
quietly missing routes.

For a release build the site URL and base path must be supplied:

```bash
SITE_URL=https://tientdat11.github.io SITE_BASE=/bossdanang npm run build
npm run preview -- --base /bossdanang
```

`SITE_URL` is the **origin only**. `SITE_BASE` is the path prefix, and
`absoluteUrl()` appends it — putting the repo path in `SITE_URL` as well emits
`/bossdanang/bossdanang/…` in every canonical, og:url and sitemap entry.

`PUBLISH_APPROVED=1` is the release gate in `astro.config.mjs`. Without it the build
emits `noindex,nofollow` on every page, so a preview build cannot be indexed by
accident.

## Layout

```
src/
  data/         site constants, the 15-product dataset, the page-kind registry
  families/     one directory per page family — the seam described below
  content/      long-form content maps that are not family-specific
  components/   header, footer, breadcrumbs
  layouts/      the document shell: <head>, canonical, JSON-LD, chrome
  lib/          the block renderer and the media resolver
  pages/        [slug].astro plus sitemap.xml.ts, robots.txt.ts, 404.astro
  styles/       global.css and the per-family sheets
scripts/        capture, fetch, shoot, and the two verification gates
docs/           the reference inventory this replica was built from
.scratch/       working state; .scratch/capture/ is committed, the rest is not
public/media/   220 deduplicated images and 6 fonts, fetched from the source
```

## The family seam

Every page family is one directory, `src/families/<name>/index.ts`, loaded by
`src/families/index.ts` through `import.meta.glob('./*/index.ts', { eager: true })`.
A family owns its routes, its content map and its views. The build enforces:

- the module's `name` equals its directory name
- `contentRef` is `"<family>:<key>"` and that key exists in the family's own map
- a `PageKind` is claimed by exactly one family
- a family may only render routes it owns, so a view never resolves another
  family's content map

Views emit `h2` and below. `[slug].astro` already renders the `h1`, and a view that
emits its own gives the page two.

A family resolves its own blocks with `requireContent(record, content)` from
`src/lib/blocks.ts`, never by importing the aggregator back: the aggregator loads
the family, so calling into it during the family's own evaluation is an import
cycle that fails at render with a TDZ error pointing nowhere useful.

### CSS

A bare `import '@/styles/x.css'` from a `.ts` module **does not reach the built
output**. Families import their sheet as `?raw` and emit it from the view:

```ts
import css from '@/styles/<name>.css?raw';
const withStyles = (body: string) => `<style>${css}</style>${body}`;
```

`src/families/catalog/index.ts` and `src/families/gallery/index.ts` show the
pattern in use.

## Fidelity

The replica is a copy, not a redesign. Where the source has a defect the rule is:
fix it, document it, never copy it. All 22 deviations are in
[`docs/reference-inventory.md`](docs/reference-inventory.md) §6, with the reason for
each.

The failure mode worth knowing about is silent: a U+00A0 flattened to a space, or a
tone mark typed wrong, still renders as plausible Vietnamese. `npm run check` runs
`scripts/audit-bytes.mjs`, which compares every content string against the verbatim
capture and fails on a changed diacritic or a lost non-breaking space. Copy written
for the replica — SEO descriptions, the disabled contact-form notice — is classified
separately and reported without failing.

Nothing is reproduced that belongs to a third party: no Facebook or Zalo embeds, no
reCAPTCHA under the source owner's key, no embedded maps. Nothing hotlinks the
source origin — `verify-build.mjs` fails the build if any page does.

## Regenerating the evidence

```bash
node scripts/fetch-media.mjs            # manifest + public/media, deduped by sha256
node scripts/fetch-media.mjs --dry-run  # plan only, writes nothing
node scripts/shoot-source.mjs           # source screenshots (needs network)

node scripts/verify-build.mjs           # release gate against dist/
node scripts/audit-bytes.mjs            # copy fidelity against the capture
```

`.scratch/capture/*.json` is committed on purpose. It is the verbatim source
capture that every module cites for provenance and the input
`scripts/fetch-media.mjs` derives the media manifest from — a clone without it
cannot rebuild `public/media/` or audit any string in `src/`. The rest of
`.scratch/` is disposable and gitignored.

## Deploy

Push to `main`; `.github/workflows/deploy.yml` checks, builds, verifies, and
publishes to GitHub Pages.

The site is served from a project path, so every internal link carries the `/bossdanang`
prefix. Astro does not rewrite `href` for a project-site base — every link is built
through `withBase()` for that reason.
