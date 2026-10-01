/**
 * Build-time family registry.
 *
 * Every file under `src/families/` (except this one and `types.ts`) is a family
 * module discovered by Vite's glob import. Family tickets therefore never touch a
 * shared aggregator — adding a family is adding one file.
 *
 * Invariants checked at build time (a broken family must not ship a soft-200):
 *  - family `name` matches its filename;
 *  - no two families claim the same route path;
 *  - no two families claim the same `PageKind`;
 *  - every registered route's `contentRef` family is loaded;
 *  - every registered route's `kind` has a view.
 */
import type { PageKind, PageRecord } from '@/data/pages/types';
import type { FamilyModule, PageView } from '@/families/types';

type FamilyModuleFile = { default?: FamilyModule };

// One directory per family, one entry file each: a family may add `data.ts`,
// `blocks.ts` or anything else beside it without the glob mistaking a helper for
// a family and failing the build.
const families: FamilyModule[] = Object.entries(import.meta.glob<FamilyModuleFile>('./*/index.ts', { eager: true }))
  .map(([file, module]) => {
    const family = module.default;
    if (!family) {
      throw new Error(`[families] ${file} has no default export. A family module must export itself as default.`);
    }
    const expected = file.replace(/^\.\/|\/index\.ts$/g, '');
    if (family.name !== expected) {
      throw new Error(`[families] ${file} exports name "${family.name}"; the name must match the directory name.`);
    }
    return family;
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const familyByName = new Map<string, FamilyModule>();
for (const family of families) {
  if (familyByName.has(family.name)) {
    throw new Error(`[families] two family modules are both named "${family.name}". Names are the contentRef namespace and must be unique.`);
  }
  familyByName.set(family.name, family);
}

export const familyRoutes: PageRecord[] = families.flatMap((family) => family.routes);

/**
 * Every registered route's `contentRef` must resolve inside the family that owns it.
 * Checked here rather than in each view: a family resolves its own blocks through
 * `requireContent` (see `src/lib/blocks.ts`) to keep this module out of its
 * evaluation cycle, so a typo in a `contentRef` would otherwise surface only when
 * that one page renders.
 */
for (const family of families) {
  for (const record of family.routes) {
    if (!record.contentRef.startsWith(`${family.name}:`)) {
      throw new Error(
        `[families] "${record.contentRef}" (${record.path}) is registered by family "${family.name}" ` +
          `but its contentRef is not in that family's namespace.`,
      );
    }
    if (!family.content[record.contentRef]) {
      throw new Error(
        `[families] "${record.contentRef}" (${record.path}) has no blocks in family "${family.name}".`,
      );
    }
  }
}

/** kind → the one family allowed to render it. A second claim is a build error. */
const viewOwners = new Map<PageKind, { family: string; view: PageView }>();
for (const family of families) {
  for (const [kind, view] of Object.entries(family.views) as [PageKind, PageView][]) {
    const owner = viewOwners.get(kind);
    if (owner) {
      throw new Error(
        `[families] PageKind "${kind}" is claimed by both family "${owner.family}" and family "${family.name}". ` +
          'Each kind belongs to exactly one family.',
      );
    }
    viewOwners.set(kind, { family: family.name, view });
  }
}

// A family may claim a kind it owns no routes for (a shared renderer), but a route
// of that kind must belong to the family holding the view: otherwise one family's
// view would resolve another family's contentRef and fail with a misleading error.
const routeOwners = new Map<PageRecord, string>();
for (const family of families) {
  for (const record of family.routes) routeOwners.set(record, family.name);
}
for (const family of families) {
  for (const kind of Object.keys(family.views) as PageKind[]) {
    for (const [record, owner] of routeOwners) {
      if (record.kind !== kind || owner === family.name) continue;
      throw new Error(
        `[families] family "${family.name}" renders PageKind "${kind}", but ${record.path} ` +
          `(contentRef "${record.contentRef}") belongs to family "${owner}". ` +
          'The view and the content map must come from the same family.',
      );
    }
  }
}

export function viewFor(record: PageRecord): PageView {
  const view = viewOwners.get(record.kind)?.view;
  if (!view) {
    throw new Error(
      `[families] no view for PageKind "${record.kind}" (${record.path}, ${record.contentRef}). ` +
        'Claim that kind in the family that owns the route.',
    );
  }
  return view;
}
