/**
 * The seam every family ticket plugs into.
 *
 * A family owns exactly ONE file under `src/families/`. It is discovered at build
 * time with `import.meta.glob` in `src/families/index.ts`, so no family ever
 * edits a shared aggregator (`src/data/pages/index.ts`, `src/pages/[slug].astro`).
 * That is what lets the family tickets run in parallel without clobbering each other.
 */
import type { PageKind, PageRecord } from '@/data/pages/types';
import type { ContentFamily } from '@/content/types';

/** Renders the page body for one registry record. Must return complete, escaped HTML. */
export type PageView = (record: PageRecord) => string;

export type FamilyModule = {
  /** Unique family name; must match the filename (`src/families/<name>.ts`). */
  name: string;
  /** Routes this family owns. Paths must be globally unique — checked at build. */
  routes: PageRecord[];
  /** `contentRef` → blocks, keyed `"<name>:<key>"` for the family's own records. */
  content: ContentFamily;
  /** Page kinds this family renders. Kinds must be claimed by at most one family. */
  views: Partial<Record<PageKind, PageView>>;
};
