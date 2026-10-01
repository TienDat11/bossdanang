/**
 * Single source of truth for the routes that are actually integrated.
 *
 * Routes come from the family modules in `src/families/` (discovered by glob), so a
 * family ticket adds one file there and never edits this aggregator.
 */
import type { Crumb, PageRecord } from '@/data/pages/types';
import { familyRoutes } from '@/families';

export const pages: PageRecord[] = familyRoutes;

function buildIndex(records: PageRecord[]): Map<string, PageRecord> {
  const index = new Map<string, PageRecord>();
  for (const record of records) {
    if (!record.path.startsWith('/') || (record.path.length > 1 && record.path.endsWith('/'))) {
      throw new Error(
        `[registry] path "${record.path}" (${record.contentRef}) must start with "/" and must not end with "/" (home is "/").`,
      );
    }
    const duplicate = index.get(record.path);
    if (duplicate) {
      throw new Error(
        `[registry] duplicate path "${record.path}": "${duplicate.contentRef}" and "${record.contentRef}".`,
      );
    }
    index.set(record.path, record);
  }
  for (const record of records) {
    if (record.parentPath === undefined) continue;
    if (!index.has(record.parentPath)) {
      throw new Error(
        `[registry] "${record.contentRef}" has parentPath "${record.parentPath}" which is not in the registry.`,
      );
    }
  }
  return index;
}

export const pageByPath: Map<string, PageRecord> = buildIndex(pages);

export const indexablePages: PageRecord[] = pages.filter((page) => page.noindex !== true);

/** "Trang chủ" → parent chain → the page itself, matching the source's visible breadcrumb. */
export function breadcrumbTrail(page: PageRecord): Crumb[] {
  const trail: Crumb[] = [{ label: 'Trang chủ', path: '/' }];
  let current: PageRecord | undefined = pageByPath.get(page.parentPath ?? '');
  while (current && current.path !== '/') {
    trail.unshift({ label: current.section, path: current.path });
    current = pageByPath.get(current.parentPath ?? '');
  }
  trail.push({ label: page.section, path: page.path });
  return trail;
}
