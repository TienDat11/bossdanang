/**
 * Block shapes mirrored from the capture files
 * (`.scratch/capture/*.json` → `routes[].blocks`).
 */
export type ParagraphBlock = { type: 'p'; text: string; href?: string };
export type HeadingBlock = { type: 'h2' | 'h3'; text: string };
export type ListBlock = { type: 'ul' | 'ol'; items: string[] };
export type TableBlock = { type: 'table'; headers: string[]; rows: string[][]; note?: string };
export type QuoteBlock = {
  type: 'quote';
  text: string;
  name?: string;
  role?: string;
  avatar?: string | null;
  heading?: string;
};
/** `url` is the captured SOURCE url (provenance only) — resolve it via `@/lib/media`. */
export type ImageBlock = {
  type: 'img';
  url: string;
  alt: string;
  role: string;
  href?: string;
  width?: number;
  height?: number;
};
export type ArticleBlock = {
  type: 'article';
  title: string;
  href: string;
  image: string;
  alt: string;
  excerpt?: string;
  date?: string;
};
export type AlbumBlock = {
  type: 'album';
  title: string;
  href: string;
  image: string;
  alt: string;
};

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | TableBlock
  | QuoteBlock
  | ImageBlock
  | ArticleBlock
  | AlbumBlock;

export type ContentFamily = Record<string, ContentBlock[]>;
