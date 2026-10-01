import type { APIRoute } from 'astro';
import { indexablePages } from '@/data/pages';
import { absoluteUrl } from '@/data/site';

const escapeXml = (value: string): string =>
  value.replace(/[<>&'"]/g, (char) => `&#${char.codePointAt(0)};`);

export const GET: APIRoute = () => {
  const urls = indexablePages
    .map((page) => `  <url><loc>${escapeXml(absoluteUrl(page.path))}</loc></url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
