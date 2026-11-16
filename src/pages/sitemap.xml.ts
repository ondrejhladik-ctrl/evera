import type { APIRoute } from 'astro';

/** /sitemap.xml – veřejné stránky webu (statický seznam, prerender). */
export const prerender = true;

const PAGES = ['/', '/setkani-v-pohybu/', '/setkani-v-pohybu/prezentujici/', '/kondept2/', '/kondept2/prezentujici/', '/gestalt-lasky/'];

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const urls = PAGES.map((p) => `  <url><loc>${new URL(base + p, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
