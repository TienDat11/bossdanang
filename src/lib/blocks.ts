/**
 * Structured-block → HTML renderer shared by every family view.
 *
 * Every text node is escaped here, so a family view can only produce markup by
 * composing these helpers — raw captured HTML is never injected.
 */
import type { ContentBlock, ContentFamily } from '@/content/types';
import type { PageRecord } from '@/data/pages/types';
import { mediaPath } from '@/lib/media';
import { pageByPath } from '@/data/pages';
import { withBase } from '@/data/site';

export const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const tag = (name: string, value: string): string => `<${name}>${escapeHtml(value)}</${name}>`;

/** An internal link, or plain text when the target route is not integrated yet. */
export function link(href: string, label: string, className?: string): string {
  const path = `/${href.replace(/^\//, '')}`;
  const attribute = className ? ` class="${escapeHtml(className)}"` : '';
  if (!pageByPath.has(path)) return `<span${attribute}>${escapeHtml(label)}</span>`;
  return `<a${attribute} href="${escapeHtml(withBase(path))}">${escapeHtml(label)}</a>`;
}

/**
 * `src` for a captured source URL, or `null` when the file is deliberately absent
 * from the replica (the capture marks those: soft-404 HTML, missing source art).
 * Absent art is announced to assistive tech, never silently dropped.
 */
export function imageTag(
  sourceUrl: string,
  alt: string,
  options: { className?: string; loading?: 'lazy' | 'eager'; width?: number; height?: number; reveal?: 'fade' | 'zoom' } = {},
): string {
  const { className, loading = 'lazy', width, height, reveal } = options;
  const classAttribute = className ? ` class="${escapeHtml(className)}"` : '';
  const altAttribute = alt ? escapeHtml(alt) : '';
  const placeholder = alt ? '' : ' role="img"';
  const dimensions = width && height ? ` width="${width}" height="${height}"` : '';
  const revealAttribute = reveal ? ` data-reveal="${reveal}"` : ''; 
  try {
    return `<img src="${escapeHtml(withBase(mediaPath(sourceUrl)))}" alt="${altAttribute}"${classAttribute}${dimensions}${revealAttribute} loading="${loading}" decoding="async"${placeholder} />`;
  } catch {
    const caption = alt || 'Hình ảnh chưa được cung cấp trong bản dựng';
    return `<span class="image-missing" role="img" aria-label="${escapeHtml(caption)}"></span>`;
  }
}

export function renderBlock(block: ContentBlock): string {
  switch (block.type) {
    case 'h2':
    case 'h3':
      return block.text ? tag(block.type, block.text) : '';
    case 'p':
      return block.text
        ? `<p>${block.href ? link(block.href, block.text) : escapeHtml(block.text)}</p>`
        : '';
    case 'ul':
    case 'ol':
      return `<${block.type}>${block.items.map((item) => tag('li', item)).join('')}</${block.type}>`;
    case 'table':
      return [
        '<div class="table-scroll">',
        '<table>',
        `<thead><tr>${block.headers.map((cell) => tag('th', cell)).join('')}</tr></thead>`,
        `<tbody>${block.rows.map((row) => `<tr>${row.map((cell) => tag('td', cell)).join('')}</tr>`).join('')}</tbody>`,
        '</table>',
        '</div>',
      ].join('');
    case 'quote':
      return `<blockquote><p>${escapeHtml(block.text)}</p>${block.name ? `<footer>${escapeHtml([block.name, block.role].filter(Boolean).join(' — '))}</footer>` : ''}</blockquote>`;
    case 'img':
      return `<figure>${imageTag(block.url, block.alt, { width: block.width, height: block.height })}</figure>`;
    case 'article':
    case 'album': {
      const title = link(block.href, block.title);
      return `<article class="teaser"><h3>${title}</h3></article>`;
    }
  }
}

/** Standard long-form body used by the prose-shaped page kinds. */
export function prose(blocks: ContentBlock[]): string {
  return `<div class="prose">${blocks.map(renderBlock).join('')}</div>`;
}

/**
 * Look up a family's own blocks by `contentRef`, or throw.
 *
 * Lives here rather than in the family aggregator: a family module is loaded BY
 * that aggregator, so calling back into it during a family's own module
 * evaluation is an import cycle and fails at render time with a TDZ error that
 * points nowhere useful.
 */
export function requireContent(record: PageRecord, content: ContentFamily): ContentBlock[] {
  const blocks = content[record.contentRef];
  if (!blocks) {
    throw new Error(
      `[content] no blocks for "${record.contentRef}" (${record.path}). ` +
        `Add that key to the family's content map.`,
    );
  }
  return blocks;
}
