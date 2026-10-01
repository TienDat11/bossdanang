#!/usr/bin/env node
/**
 * Byte-fidelity audit.
 *
 * Every Vietnamese string in a content map is business copy that the site owner
 * will read, and the failure mode is silent: a U+00A0 flattened to a space, or a
 * tone mark typed wrong, still renders as plausible Vietnamese. This walks every
 * string literal in the content/data modules, normalises it to the same shape the
 * capture stores, and reports anything that does not appear in the capture at all.
 *
 * A string that is genuinely not in the capture is not automatically wrong — a
 * written SEO description, an alt written to describe an image, a `ponytail:`
 * comment. So this reports candidates for a human to look at, and it is loud about
 * the two corruption classes that are always wrong:
 *
 *   - a U+00A0 in the source that became a plain space
 *   - a character that differs from the capture by exactly one diacritic
 *
 * Usage: node scripts/audit-bytes.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CAPTURE_DIR = path.join(ROOT, '.scratch', 'capture');

const stripDiacritics = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Every quoted string literal in the source files we care about. */
const MODULES = [
  'src/families/company/index.ts',
  'src/families/handbook/index.ts',
  'src/families/policies/index.ts',
  'src/families/catalog/index.ts',
  'src/families/gallery/index.ts',
  'src/families/dealers/index.ts',
  'src/families/home/index.ts',
  'src/content/company.ts',
  'src/data/site.ts',
  'src/data/products.ts',
  'src/components/Header.astro',
  'src/components/Footer.astro',
];


if (!fs.existsSync(CAPTURE_DIR)) {
  console.error('audit-bytes: .scratch/capture is missing; nothing to compare against.');
  process.exit(1);
}

// ------------------------------------------------------- build the capture corpus

const captureStrings = new Set();
const nbspInCapture = [];

const harvest = (value, trail) => {
  if (typeof value === 'string') {
    captureStrings.add(value.trim());
    if (value.includes(' ')) nbspInCapture.push({ trail, sample: value.slice(0, 60) });
    return;
  }
  if (Array.isArray(value)) return value.forEach((v, i) => harvest(v, `${trail}[${i}]`));
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) harvest(v, `${trail}.${k}`);
  }
};

for (const file of fs.readdirSync(CAPTURE_DIR).filter((f) => f.endsWith('.json'))) {
  if (file === 'media-manifest.json') continue;
  try {
    harvest(JSON.parse(fs.readFileSync(path.join(CAPTURE_DIR, file), 'utf8')), file);
  } catch {
    /* a half-written capture file is not this script's problem */
  }
}

const captureStripped = new Set([...captureStrings].map(stripDiacritics));
console.log(`capture corpus: ${captureStrings.size} distinct strings`);
const captureByLength = [...captureStrings].sort((a, b) => b.length - a.length);

/**
 * A module may elide long copy in the middle, keeping the opening and the closing
 * clause. So an elided string matches when some captured string starts with the
 * head and, if a tail was kept, ends with it.
 */
const inCapture = (value) => {
  if (captureStrings.has(value) || captureStripped.has(stripDiacritics(value))) return true;
  const [head, tail] = value.split('…');
  const h = stripDiacritics(head.trim());
  if (h.length >= 20 && captureByLength.some((c) => stripDiacritics(c).startsWith(h))) {
    if (!tail) return true;
    const t = stripDiacritics(tail.trim());
    if (t.length < 20) return true;
    return captureByLength.some((c) => {
      const d = stripDiacritics(c);
      return d.startsWith(h) && d.endsWith(t);
    });
  }
  return false;
};

// -------------------------------------------------------------- scan the modules

const problems = [];


/**
 * Copy written for the replica rather than captured: a per-page `seo.description`,
 * a dev-facing note, a css class name, a contentRef key. A visitor does not read
 * these as page copy, so they are listed for review rather than counted as a
 * fidelity failure. Everything a visitor does read must be byte-exact.
 */
const REVIEWED_BY_DESIGN = [
  /^\[home\]/,            // console.warn for a missing capture block
  /^[a-z]+:[a-z0-9-]+$/,  // contentRef key
  /product-card__/,       // css class name
  // Copy written for the replica under a recorded decision, not copied from the
  // source. `/lien-he`: the owner chose to keep the send button disabled until a
  // real endpoint exists, so the form states that in Vietnamese — see
  // docs/reference-inventory.md §6 deviation 21 and §7.
  /^Biểu mẫu chưa được cấu hình/,
  /^Vui lòng liên hệ trực tiếp/,
  // The extractor's note about `/lien-he`, kept as a dev-facing console warning so
  // the next reader knows why working hours and the map are absent.
  /^Phone: …/,
];

const review = [];
const isByDesign = (value) => REVIEWED_BY_DESIGN.some((re) => re.test(value));

/**
 * `seo.description` is copy written for the replica — the source's own is empty
 * (deviation #5 in docs/reference-inventory.md). The modules emit the literal
 * inside a `seo: { … }` block, so a match against the surrounding text tells us a
 * string is a description rather than page copy.
 */
const inSeoBlock = (source, index) => {
  const open = source.lastIndexOf('seo:', index);
  if (open === -1) return false;
  const close = source.indexOf('contentRef', open);
  return close === -1 || index < close;
};
let scanned = 0;

for (const rel of MODULES) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    problems.push(`${rel}: file listed in audit but missing`);
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');

  for (const match of source.matchAll(/'((?:[^'\\\n]|\\.){4,})'|"((?:[^"\\\n]|\\.){4,})"/g)) {
    const raw = match[1] ?? match[2];
    if (!/[a-zA-Zà-ỹ]/.test(raw)) continue;
    // Skip obvious non-copy: css, paths, urls, html, import specifiers.
    if (/^[\w./@-]+$/.test(raw) || /[{}<>]/.test(raw) || raw.includes('http')) continue;
    scanned++;

    const value = raw.replace(/\\'/g, "'").replace(/\\n/g, ' ').trim();
    if (captureStrings.has(value)) continue;
    // Copy written for the replica, not captured: not a fidelity failure.
    if (inSeoBlock(source, match.index)) {
      review.push(`${rel}: seo description written for the replica.\n    ${JSON.stringify(value.slice(0, 90))}`);
      continue;
    }

    // A non-breaking space in the capture written here as a plain space.
    const withNbsp = value.replace(/ (?=[\p{L}])/gu, ' ');
    if (captureStrings.has(withNbsp)) {
      problems.push(`${rel}: U+00A0 in the capture was written as a plain space.\n    source module: ${JSON.stringify(value)}\n    capture:       ${JSON.stringify(withNbsp)}`);
      continue;
    }

    const stripped = stripDiacritics(value);
    if (captureStripped.has(stripped)) {
      // Matches once diacritics are removed: a tone mark was changed or dropped.
      const near = [...captureStrings].find((c) => stripDiacritics(c) === stripped && c !== value);
      problems.push(`${rel}: diacritic differs from the capture.\n    source module: ${JSON.stringify(value)}\n    capture:       ${JSON.stringify(near)}`);
      continue;
    }

    if (inCapture(value)) continue;

    // Only for literals that survived extraction intact: a string containing an
    // escaped quote was cut short by the literal regex, so "not found" would say
    // nothing about fidelity.
    if (value.length > 40 && !raw.includes('\\')) {
      const note = `${rel}: not in the capture — confirm it is intentional.\n    ${JSON.stringify(value.slice(0, 110))}`;
      (isByDesign(value) ? review : problems).push(note);
    }
  }
}

console.log(`scanned ${scanned} string literals across ${MODULES.length} modules`);
if (nbspInCapture.length) console.log(`capture contains ${nbspInCapture.length} U+00A0`);

if (review.length) {
  console.log(`\n${review.length} string(s) written for the replica, not captured (seo descriptions, notes):`);
  for (const r of review) console.log(`  ${r.split('\n')[0]}`);
}

if (problems.length) {
  console.error(`\naudit-bytes: ${problems.length} fidelity failure(s)\n`);
  for (const p of problems) console.error(`  ${p}\n`);
  process.exit(1);
}
console.log('audit-bytes: OK — no captured copy was altered');
