import type { APIRoute } from 'astro';

/** /robots.txt – ostrý web povolí vše a ukáže na sitemapu; náhled v podsložce zakáže indexaci. */
export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const preview = import.meta.env.BASE_URL !== '/';
  const lines = preview
    ? ['User-agent: *', 'Disallow: /', '']
    : ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap.xml', site).href}`, ''];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
