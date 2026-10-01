/**
 * Import-alias guard.
 *
 * Every source-authored import under src/ must use the `@/` alias, so the
 * build cannot silently depend on directory layout. Fails with file:line for
 * each relative specifier (`./x`, `../x`).
 *
 * Usage: node scripts/check-imports.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const EXTS = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs']);
const SKIP = new Set(['node_modules', 'dist', '.astro']);

/** `import x from './y'`, `export * from '../y'`, `import './y.css'`, `import('./y')`, `require('./y')` */
const RELATIVE_SPECIFIER =
  /(?:\bimport\b|\bexport\b)[\s\S]{0,400}?(?:\bfrom\s*|\bimport\s*|\brequire\s*\(\s*|^\s*import\s+)(['"])(\.{1,2}\/[^'"\n]*)\1/gm;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (EXTS.has(entry.slice(entry.lastIndexOf('.')))) out.push(full);
  }
  return out;
}

const violations = [];
for (const file of walk(SRC)) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(RELATIVE_SPECIFIER)) {
    const line = text.slice(0, match.index).split('\n').length;
    const spec = match[2];
    violations.push(`${relative(ROOT, file).split(sep).join('/')}:${line} → "${spec}"`);
  }
}

if (violations.length > 0) {
  console.error(`check-imports: ${violations.length} relative import(s) under src/. Use the "@/" alias:\n`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}

console.log('check-imports: OK — every src/ import uses the @/ alias.');
