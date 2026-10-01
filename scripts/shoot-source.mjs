/**
 * Headless-Chrome screenshot sweep of the SOURCE site.
 *
 * Reference baseline for the replica's visual diff. One Chrome process per shot:
 * slower than a CDP session, but it cannot exhaust a shared MCP request budget and
 * needs no browser daemon. Re-runnable; existing files are skipped unless forced.
 *
 * Usage: node scripts/shoot-source.mjs [--force] [--only <slug,slug>]
 */
import { execFile } from 'node:child_process';
import { mkdir, stat, readdir } from 'node:fs/promises';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const run = promisify(execFile);

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ORIGIN = 'https://thebossvietnam.com';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.scratch/screens');

/** 37 sitemap routes + /tim-kiem; /gio-hang is a source 404 and is not replicated. */
const ROUTES = [
  '', 'gioi-thieu', 'san-pham', 'thit-tuoi', 'pate', 'tim-kiem',
  'ga-xay-hon-hop', 'supper-ga', 'thit-heo', 'thit-bo', 'ca-xay',
  'chim-cut', 'thit-vit', 'ga-ac', 'tom-xay-hon-hop', 'soup-ga-tiem',
  'soup-heo-ham', 'soup-vit-tiem', 'soup-ca-tuoi', 'soup-bo-ham', 'soup-hai-san',
  'cam-nang', 'cham-soc-suc-khoe-toan-dien-cho-cho-meo-ngoai-che-do-dinh-duong',
  'the-boss-trong-nhung-phien-hoi', 'the-boss-den-khach-hang',
  'huong-dan-cach-chuyen-doi-thuc-an-cho-cho-meo-an-toan',
  'nhung-thuc-pham-nguy-hiem-khong-nen-cho-cho-meo-an',
  'the-boss-va-cac-sen', 'menu-the-boss',
  'thu-vien-anh',
  'he-thong-dai-ly', 'danh-sach-dai-ly-o-ho-chi-minh',
  'danh-sach-dai-ly-o-binh-duong-binh-phuoc', 'danh-sach-dai-ly-o-khu-vuc-khac',
  'lien-he', 'chinh-sach-bao-mat', 'chinh-sach-tuyen-dung',
];

/** The 10 routes that get the full three-width treatment. */
const RESPONSIVE_SET = new Set([
  '', 'san-pham', 'thit-tuoi', 'pate', 'ga-xay-hon-hop', 'thu-vien-anh',
  'cam-nang', 'he-thong-dai-ly', 'lien-he', 'danh-sach-dai-ly-o-ho-chi-minh',
]);

const VIEWPORTS = [
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const force = process.argv.includes('--force');
const onlyIndex = process.argv.indexOf('--only');
const only = onlyIndex === -1 ? null : new Set(process.argv[onlyIndex + 1].split(','));

const profile = path.join(ROOT, '.scratch/chrome-profile');
await mkdir(profile, { recursive: true });

const jobs = [];
for (const slug of ROUTES) {
  if (only && !only.has(slug)) continue;
  for (const viewport of VIEWPORTS) {
    // Desktop baseline for every route; the other two widths only for the responsive set.
    if (viewport.name !== 'desktop' && !RESPONSIVE_SET.has(slug)) continue;
    jobs.push({ slug, viewport });
  }
}

let written = 0;
let skipped = 0;
const failures = [];

for (const { slug, viewport } of jobs) {
  const dir = path.join(OUT, viewport.name);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${slug || 'home'}.png`);
  if (!force) {
    try {
      await stat(file);
      skipped++;
      continue;
    } catch {
      /* not captured yet */
    }
  }

  const url = `${ORIGIN}/${slug}`;
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--virtual-time-budget=15000',
    '--run-all-compositor-stages-before-draw',
    `--user-data-dir=${profile}`,
    `--window-size=${viewport.width},${viewport.height}`,
    `--screenshot=${file}`,
    url,
  ];

  try {
    await run(CHROME, args, { timeout: 90_000, windowsHide: true });
    await stat(file);
    written++;
    process.stdout.write(`  ${viewport.name}/${slug || 'home'}.png\n`);
  } catch (error) {
    failures.push({ slug, viewport: viewport.name, error: String(error.message).slice(0, 200) });
    process.stdout.write(`  FAIL ${viewport.name}/${slug || 'home'}.png\n`);
  }
}

const counts = {};
for (const viewport of VIEWPORTS) {
  try {
    counts[viewport.name] = (await readdir(path.join(OUT, viewport.name))).filter((f) => f.endsWith('.png')).length;
  } catch {
    counts[viewport.name] = 0;
  }
}

console.log(`\nwritten ${written}, skipped ${skipped}, failed ${failures.length}`);
console.log('png counts:', JSON.stringify(counts));
if (failures.length) {
  console.log('failures:', JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
