#!/usr/bin/env node
// Fetch every media URL referenced by .scratch/capture/*.json, sniff the real
// type from the bytes, and emit a local manifest + generated data module.
//
//   node scripts/fetch-media.mjs [--dry-run] [--limit N]
//
// Writes: public/media/**, public/fonts/**, .scratch/capture/media-manifest.json,
//         src/data/media.ts   (re-runs are no-ops for files already on disk)

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CAPTURE_DIR = path.join(ROOT, '.scratch', 'capture');
const MANIFEST_PATH = path.join(CAPTURE_DIR, 'media-manifest.json');
const MEDIA_TS_PATH = path.join(ROOT, 'src', 'data', 'media.ts');

const ALLOWED_HOSTS = new Set(['thebossvietnam.com', 'fonts.gstatic.com']);
const CONCURRENCY = 4;
const TIMEOUT_MS = 20_000;
const RETRIES = 1;
const RETRY_BACKOFF_MS = 800;

const ROLE_DIR = {
  product: 'products', 'product-main': 'products', 'product-thumb': 'products',
  'product-card': 'products', badge: 'products',
  album: 'gallery', 'album-cover': 'gallery',
  editorial: 'editorial',
  map: 'dealers',
  hero: 'home', partner: 'home', avatar: 'home', 'album-preview': 'home',
  font: 'fonts',
};

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (line) => process.stdout.write(line + '\n');

// ---------------------------------------------------------------- collection
/**
 * Deliberately not shipped.
 *
 * The source loads Inter as a Google Fonts variable font (weights 100-900).
 * fonts.gstatic.com serves it as ~18 unicode-range slices of ONE file, and the
 * CSS that carries the `unicode-range` map is a cross-origin stylesheet this
 * script refuses to fetch. Without that map the slices cannot be bound to
 * `@font-face` without risking dropped Vietnamese glyphs, so they are excluded
 * instead of downloaded: 7.5 MB of unused font data is worse than the missing
 * face. Re-enable when the range map is captured alongside the files.
 */
const EXCLUDED = [
  { match: (u) => /fonts\.gstatic\.com\/.*inter\//i.test(u), reason: 'Inter unicode-range slices: no range map without the rejected Google CSS; the Poppins stack carries the site.' },
];


/** Read every capture file; a half-written file from a concurrent agent is skipped, not fatal. */
function collect() {
  const files = fs
    .readdirSync(CAPTURE_DIR)
    .filter((f) => f.endsWith('.json') && f !== path.basename(MANIFEST_PATH))
    .sort();
  const byUrl = new Map();
  const excluded = [];
  const unreadable = [];

  const add = (url, role, alt, localName, usedOn, note) => {
    if (typeof url !== 'string' || !/^https:\/\//i.test(url)) return;
    const seen = byUrl.get(url);
    if (seen) {
      if (!seen.alt && alt) seen.alt = alt;
      if (note && !seen.notes.includes(note)) seen.notes.push(note);
      for (const u of usedOn) if (!seen.usedOn.includes(u)) seen.usedOn.push(u);
      return;
    }
    for (const rule of EXCLUDED) {
      if (!rule.match(url)) continue;
      excluded.push({ url, reason: rule.reason });
      return;
    }
    byUrl.set(url, { url, role: role || 'unclassified', alt: alt || '', localName, usedOn: [...new Set(usedOn)], notes: note ? [note] : [] });
  };

  for (const file of files) {
    let doc;
    try {
      doc = JSON.parse(fs.readFileSync(path.join(CAPTURE_DIR, file), 'utf8'));
    } catch (e) {
      unreadable.push({ file, reason: e.message });
      continue;
    }
    for (const m of doc.media ?? []) {
      add(m.url, m.role, m.alt, m.localName, m.usedOn ?? [], m.note);
    }
    for (const route of doc.routes ?? []) {
      const slug = String(route.path ?? '').replace(/^\/+|\/+$/g, '') || 'index';
      let n = 0;
      for (const b of route.blocks ?? []) {
        if (b?.type !== 'img' || typeof b.url !== 'string') continue;
        add(b.url, b.role, b.alt, `${slug}-img-${++n}`, [route.path].filter(Boolean), 'from blocks[].img');
      }
    }
  }
  return { files, byUrl, unreadable, excluded };
}

// -------------------------------------------------------------------- sniff

/** Magic bytes decide the type; the URL and Content-Type only get a say in the audit trail. */
/** Name of the first real element, skipping prolog, doctype and comments. */
function firstTag(s) {
  for (let i = 0; i < s.length; ) {
    const lt = s.indexOf('<', i);
    if (lt < 0) return null;
    if (s.startsWith('<?', lt) || s.startsWith('<!', lt)) {
      const end = s.indexOf('>', lt);
      if (end < 0) return null;
      i = end + 1;
      continue;
    }
    return /^<([a-zA-Z][\w:.-]*)/.exec(s.slice(lt))?.[1].toLowerCase() ?? null;
  }
  return null;
}

function sniff(buf) {
  const b = buf;
  if (b.length >= 8 && b[0] === 0x89 && b.toString('latin1', 1, 4) === 'PNG') return { mime: 'image/png', ext: 'png' };
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' };
  if (b.length >= 6 && b.toString('latin1', 0, 3) === 'GIF') return { mime: 'image/gif', ext: 'gif' };
  if (b.length >= 12 && b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return { mime: 'image/webp', ext: 'webp' };
  if (b.length >= 4 && b.toString('latin1', 0, 4) === 'wOFF') return { mime: 'font/woff', ext: 'woff' };
  if (b.length >= 4 && b.toString('latin1', 0, 4) === 'wOF2') return { mime: 'font/woff2', ext: 'woff2' };
  if (b.length >= 4 && b[0] === 0x00 && b[1] === 0x01 && b[2] === 0x00 && b[3] === 0x00) return { mime: 'font/ttf', ext: 'ttf' };
  if (b.length >= 4 && b.toString('latin1', 0, 4) === 'OTTO') return { mime: 'font/otf', ext: 'otf' };
  if (b.length >= 4 && b[0] === 0x00 && b[1] === 0x00 && b[2] === 0x01 && b[3] === 0x00) return { mime: 'image/x-icon', ext: 'ico' };
  const head = b.toString('utf8', 0, Math.min(b.length, 4096)).replace(/^[\s﻿]+/, '');
  // Only a document whose first element is <svg> is SVG; the source serves HTML fragments that embed one.
  if (firstTag(head) === 'svg') return { mime: 'image/svg+xml', ext: 'svg' };
  return null;
}

/** Real pixel size from the bytes. Fonts and unknown types have none. */
function dimensions(buf, ext) {
  const b = buf;
  if (ext === 'png' && b.length >= 24) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (ext === 'gif' && b.length >= 10) return [b.readUInt16LE(6), b.readUInt16LE(8)];
  if (ext === 'jpg') {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker === 0xff || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) { i += 2; continue; }
      if (marker === 0xd9) break;
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
    return [null, null];
  }
  if (ext === 'webp' && b.length >= 30) {
    const chunk = b.toString('latin1', 12, 16);
    if (chunk === 'VP8X') return [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1];
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    if (chunk === 'VP8 ') {
      const at = b.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
      if (at > 0 && at + 6 < b.length) {
        return [b.readUInt16LE(at + 3) & 0x3fff, b.readUInt16LE(at + 5) & 0x3fff];
      }
    }
    return [null, null];
  }
  if (ext === 'svg') {
    const head = b.toString('utf8', 0, Math.min(b.length, 4096));
    const num = (re) => {
      const m = head.match(re);
      return m ? Math.round(parseFloat(m[1])) || null : null;
    };
    let w = num(/\bwidth\s*=\s*["']?\s*([0-9.]+)/i);
    let h = num(/\bheight\s*=\s*["']?\s*([0-9.]+)/i);
    if (w === null || h === null) {
      const vb = head.match(/viewBox\s*=\s*["']([^"']+)["']/i);
      const p = vb?.[1].trim().split(/[\s,]+/).map(Number);
      if (p?.length === 4 && p.every(Number.isFinite)) { w ??= Math.round(p[2]) || null; h ??= Math.round(p[3]) || null; }
    }
    return [w, h];
  }
  return [null, null];
}

// --------------------------------------------------------------------- paths

const sanitize = (s) =>
  String(s ?? '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'media';

const relPathFor = (role, localName, ext) =>
  role === 'font' ? `fonts/${sanitize(localName)}.${ext}` : `media/${ROLE_DIR[role] ?? 'misc'}/${sanitize(localName)}.${ext}`;

/** Second URL claiming the same file name gets a hash suffix instead of an overwrite. */
function claimPath(item, ext, taken) {
  const base = relPathFor(item.role, item.localName, ext);
  if (taken.get(base) === undefined || taken.get(base) === item.url) { taken.set(base, item.url); return base; }
  const hashed = base.replace(/\.[^.]+$/, '') + '-' + sha256(item.url).slice(0, 8) + '.' + ext;
  if (taken.get(hashed) === undefined || taken.get(hashed) === item.url) { taken.set(hashed, item.url); return hashed; }
  throw new Error(`cannot claim a path for ${item.url}`);
}

// -------------------------------------------------------------------- fetch

async function get(url) {
  let last = null;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (attempt) await sleep(RETRY_BACKOFF_MS * attempt);
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
        redirect: 'follow',
        headers: { 'user-agent': 'theboss-replica-media-fetch/1.0' },
      });
      if (res.status >= 500) {
        await res.arrayBuffer().catch(() => {});
        last = { error: `http-${res.status}` };
        continue;
      }
      const body = res.ok ? Buffer.from(await res.arrayBuffer()) : null;
      return { httpStatus: res.status, contentType: res.headers.get('content-type') ?? '', body, error: res.ok ? null : `http-${res.status}` };
    } catch (e) {
      last = { error: e.name === 'TimeoutError' ? 'timeout' : `network-error: ${e.message}` };
    }
  }
  return { httpStatus: 0, contentType: '', body: null, error: last?.error ?? 'unknown-error' };
}

async function pool(items, worker) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await worker(items[i]);
    }
  }));
  return out;
}

// --------------------------------------------------------------------- main

function parseArgs(argv) {
  const opts = { dryRun: false, limit: Infinity };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--limit' || a.startsWith('--limit=')) opts.limit = Number(a.split('=')[1] ?? argv[++i]) || Infinity;
    else throw new Error(`unknown argument: ${a}`);
  }
  return opts;
}

const emptyEntry = (item) => ({
  url: item.url, status: 'pending', role: item.role, alt: item.alt, usedOn: item.usedOn,
  localName: item.localName, httpStatus: null, contentType: null,
  path: null, mime: null, width: null, height: null, bytes: null, sha256: null, notes: [],
});

async function main() {
  if (!fs.existsSync(CAPTURE_DIR)) {
    throw new Error(
      `No capture directory at ${CAPTURE_DIR}. The media manifest is derived from the\n` +
        'verbatim source capture, so it cannot be rebuilt from the repo alone. Restore\n' +
        '.scratch/capture/*.json (or re-capture the source) and re-run.',
    );
  }
  const opts = parseArgs(process.argv.slice(2));
  const { files, byUrl, unreadable, excluded } = collect();
  for (const u of unreadable) log(`SKIP-CAPTURE ${u.file} — unreadable: ${u.reason}`);
  for (const e of excluded) log(`EXCLUDED ${e.url}\n           ${e.reason}`);

  const previous = fs.existsSync(MANIFEST_PATH)
    ? new Map((JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')).entries ?? []).map((e) => [e.url, e]))
    : new Map();

  // NUL-joined so a shorter localName is never treated as a prefix of a longer one.
  const key = (i) => [i.role, i.localName, i.url].join(String.fromCharCode(0));
  const items = [...byUrl.values()].sort((a, b) => (key(a) < key(b) ? -1 : 1));
  const entries = new Map(items.map((i) => [i.url, emptyEntry(i)]));
  const taken = new Map();
  const bySha = new Map();

  // 1. Reuse whatever is already on disk at the right size.
  const todo = [];
  for (const item of items) {
    const prev = previous.get(item.url);
    if (prev?.status === 'ok' && prev.path && fs.existsSync(path.join(ROOT, 'public', prev.path)) && fs.statSync(path.join(ROOT, 'public', prev.path)).size === prev.bytes) {
      const e = entries.get(item.url);
      Object.assign(e, { status: 'ok', localName: prev.localName, httpStatus: prev.httpStatus, contentType: prev.contentType, path: prev.path, mime: prev.mime, width: prev.width, height: prev.height, bytes: prev.bytes, sha256: prev.sha256, notes: prev.notes ?? [] });
      taken.set(prev.path.replace(/^\//, ''), item.url);
      bySha.set(prev.sha256, prev.path);
    } else {
      todo.push(item);
    }
  }
  for (const host of new Set(todo.map((i) => { try { return new URL(i.url).host; } catch { return '?'; } }))) {
    if (!ALLOWED_HOSTS.has(host)) log(`REJECT-HOST ${host} — not in ${[...ALLOWED_HOSTS].join(', ')}`);
  }
  const queue = todo.filter((i) => ALLOWED_HOSTS.has(new URL(i.url).host));
  for (const item of todo) {
    if (!ALLOWED_HOSTS.has(new URL(item.url).host)) {
      const e = entries.get(item.url);
      e.status = 'rejected';
      e.notes.push('host not allowlisted');
    }
  }

  const limited = queue.slice(0, opts.limit);
  log(`capture files: ${files.join(', ')}`);
  if (opts.dryRun) {
    for (const item of limited) {
      const prev = previous.get(item.url);
      log(`FETCH  ${item.role.padEnd(14)} ${(item.localName + '.*').padEnd(46)} ${item.url}${prev ? '  [was: ' + prev.status + ' ' + prev.path + ']' : ''}`);
    }
    const planned = new Set(limited.map((i) => i.url));
    for (const item of items) {
      if (!planned.has(item.url) && entries.get(item.url).status === 'pending') log(`DEFER  ${item.url}`);
    }
    log(`dry run: nothing written. would fetch ${limited.length} url(s).`);
    return;
  }

  // 2. Download. GET only, 4 at a time, 20s timeout, 1 retry.
  const bodies = await pool(limited, async (item) => ({ item, res: await get(item.url) }));

  // 3. Resolve in a stable order so duplicate bytes and name clashes land the same way every run.
  for (const { item, res } of bodies) {
    const e = entries.get(item.url);
    e.httpStatus = res.httpStatus || null;
    e.contentType = res.contentType || null;
    if (res.error) {
      e.status = 'failed';
      e.notes.push(res.error);
      log(`FAIL   ${res.error.padEnd(22)} ${item.url}`);
      continue;
    }
    const kind = sniff(res.body);
    if (!kind) {
      e.status = 'not-an-image';
      e.mime = (res.contentType || 'application/octet-stream').split(';')[0].trim();
      e.notes.push('payload is not a recognised image/font type');
      log(`NOTIMG ${String(e.mime).padEnd(25)} http ${e.httpStatus}  ${item.url}`);
      continue;
    }
    e.mime = kind.mime;
    if (res.contentType && res.contentType.split(';')[0].trim() !== kind.mime) {
      e.notes.push(`content-type said ${res.contentType.split(';')[0].trim()}, bytes say ${kind.mime}; bytes win`);
    }
    const digest = sha256(res.body);
    let dupOf = null;
    if (bySha.has(digest)) {
      dupOf = bySha.get(digest);
      e.path = dupOf;
      e.notes.push(`identical bytes to ${dupOf}`);
    } else {
      e.path = '/' + claimPath(item, kind.ext, taken);
      bySha.set(digest, e.path);
    }
    e.sha256 = digest;
    e.bytes = res.body.length;

    const [bw, bh] = dimensions(res.body, kind.ext);
    const cw = item.width ?? null, ch = item.height ?? null;
    const [w, h] = bw === null && bh === null ? [cw, ch] : [bw, bh];
    e.width = w; e.height = h;
    if (bw !== null && (cw !== null || ch !== null) && (bw !== cw || bh !== ch)) {
      e.notes.push(`dimensionMismatch: capture ${cw}x${ch}, bytes ${bw}x${bh}; bytes win`);
    }
    if (!dupOf) {
      const abs = path.join(ROOT, 'public', e.path);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      if (!fs.existsSync(abs)) fs.writeFileSync(abs, res.body);
    }
    e.status = 'ok';
    const urlExt = (new URL(item.url).pathname.match(/\.([a-z0-9]{2,5})$/i)?.[1] ?? 'none').toLowerCase();
    if (urlExt !== kind.ext) e.notes.push(`ext ${urlExt} -> ${kind.ext} (bytes win)`);
    log(`${dupOf ? 'DUP   ' : 'OK    '} ${String(bw ?? w ?? '?') + 'x' + (bh ?? h ?? '?')} ${kind.mime.padEnd(12)} ${e.path}  <- ${item.url}${urlExt !== kind.ext ? `  [ext ${urlExt} -> ${kind.ext}]` : ''}`);
  }

  // 4. Emit.
  const list = items.map((i) => entries.get(i.url));
  const byStatus = {};
  for (const e of list) byStatus[e.status] = (byStatus[e.status] ?? 0) + 1;
  const ok = list.filter((e) => e.status === 'ok');
  const manifest = {
    generator: 'scripts/fetch-media.mjs',
    sourceFiles: files,
    totals: {
      urls: list.length,
      ok: ok.length,
      uniqueFiles: new Set(ok.map((e) => e.path)).size,
      bytes: [...new Map(ok.map((e) => [e.path, e.bytes]))].reduce((n, [, b]) => n + b, 0),
      byStatus,
    },
    entries: list,
  };
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  fs.mkdirSync(path.dirname(MEDIA_TS_PATH), { recursive: true });
  fs.writeFileSync(MEDIA_TS_PATH, renderTs(ok));

  const problems = list.filter((e) => e.status !== 'ok');
  const extFixes = list.filter((e) => e.notes.some((n) => n.startsWith('ext ')));
  log('');
  log(`fetched ${limited.length} url(s) this run`);
  log(`manifest: ${manifest.totals.urls} urls, ${ok.length} ok, ${manifest.totals.uniqueFiles} unique files, ${problems.length} problem(s)`);
  log(`by status: ${Object.entries(byStatus).map(([k, v]) => `${k}=${v}`).join(' ')}`);
  if (extFixes.length) log(`extension corrected from bytes: ${extFixes.length} (${extFixes.slice(0, 3).map((e) => e.path).join(', ')}${extFixes.length > 3 ? ', ...' : ''})`);
  const mismatches = list.filter((e) => e.notes.some((n) => n.startsWith('dimensionMismatch')));
  log(`dimension mismatches (bytes won): ${mismatches.length}`);
  for (const e of problems) log(`  ${e.status.padEnd(13)} ${e.httpStatus ?? '-'}  ${e.url}`);
}

function renderTs(ok) {
  const q = (s) => JSON.stringify(s);
  const rows = ok
    .slice()
    .sort((a, b) => (a.path < b.path ? -1 : 1))
    .map((e) => [
      '  {',
      `    url: ${q(e.url)},`,
      `    path: ${q(e.path)},`,
      `    mime: ${q(e.mime)},`,
      `    width: ${e.width ?? null},`,
      `    height: ${e.height ?? null},`,
      `    bytes: ${e.bytes},`,
      `    sha256: ${q(e.sha256)},`,
      `    role: ${q(e.role)},`,
      `    alt: ${q(e.alt)},`,
      `    usedOn: [${e.usedOn.map(q).join(', ')}],`,
      '  },',
    ].join('\n'));
  return [
    '// GENERATED by scripts/fetch-media.mjs — do not hand-edit.',
    '// Source inventory: .scratch/capture/*.json',
    '',
    'export type MediaEntry = {',
    '  url: string;          // source URL, provenance only',
    "  path: string;         // \"/media/products/ga-xay-hon-hop-main.webp\" — public path, no \"public/\" prefix, always starts with \"/\"",
    '  mime: string;',
    '  width: number | null;',
    '  height: number | null;',
    '  bytes: number;',
    '  sha256: string;',
    '  role: string;',
    '  alt: string;',
    '  usedOn: string[];     // route paths',
    '};',
    '',
    `export const media: MediaEntry[] = [\n${rows.join('\n')}\n];`,
    '',
    'export const mediaByUrl: Record<string, MediaEntry> = Object.fromEntries(media.map((m) => [m.url, m]));',
    "export const mediaByLocalName: Record<string, MediaEntry> = Object.fromEntries(media.map((m) => [m.path.split('/').pop()!.replace(/\\.[^.]+$/, ''), m]));",
    '',
  ].join('\n');
}

await main();
