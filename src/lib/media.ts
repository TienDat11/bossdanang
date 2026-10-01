/**
 * Source-URL → local public path resolver.
 *
 * Captured blocks keep the original source URL as provenance; nothing in the
 * built site may hotlink it, so every consumer goes through here. A miss throws
 * at build time rather than shipping a remote <img src>.
 */
import { mediaByUrl } from '@/data/media';

export function mediaPath(sourceUrl: string): string {
  const entry = mediaByUrl[sourceUrl];
  if (!entry) {
    throw new Error(
      `No local file for captured media "${sourceUrl}". ` +
        'Run `npm run fetch-media` (scripts/fetch-media.mjs) so the manifest covers it; ' +
        'the replica never hotlinks the source origin.',
    );
  }
  return entry.path;
}

/** First candidate that exists locally — for artwork the source serves at several sizes/URLs. */
export function anyMediaPath(...sourceUrls: string[]): string {
  for (const url of sourceUrls) {
    const entry = mediaByUrl[url];
    if (entry) return entry.path;
  }
  throw new Error(
    `No local file for any of the captured source URLs: ${sourceUrls.join(', ')}. ` +
      'Run `npm run fetch-media` (scripts/fetch-media.mjs); the replica never hotlinks the source origin.',
  );
}
