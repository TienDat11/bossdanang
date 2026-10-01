import type { APIRoute } from 'astro';
import { absoluteUrl, publish } from '@/data/site';

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    publish ? 'Allow: /' : 'Disallow: /',
    '',
    // The source points at https://example.com/sitemap.xml — a bug, not reproduced.
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
