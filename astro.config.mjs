// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Náhled na GitHub Pages běží v podsložce (např. /evera-web/).
 * Spuštění: BASE_PATH=evera-web npm run build
 * Ostrý web (evera.cz) se buildí bez BASE_PATH.
 */
// BASE_PATH stačí zadat bez lomítek (např. "evera-web"), Git Bash by „/…“ přepsal na cestu Windows
const BASE_NAME = (process.env.BASE_PATH || '').replace(/^.*[\/](?=[^\/]+[\/]?$)/, '').replace(/^\/+|\/+$/g, '');
const BASE = BASE_NAME ? `/${BASE_NAME}/` : '/';
const SITE = process.env.SITE_URL || 'https://evera.cz';

/** Po buildu doplní podsložku do všech odkazů začínajících „/“ (href, src, srcset…). */
function prefixRootLinks() {
  return {
    name: 'prefix-root-links',
    hooks: {
      'astro:build:done': ({ dir }) => {
        if (BASE === '/') return;
        const b = BASE.slice(0, -1); // "/evera-web"
        const root = fileURLToPath(dir);
        const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
        for (const f of walk(root)) {
          if (!f.endsWith('.html')) continue;
          let s = fs.readFileSync(f, 'utf8');
          // atributy s jednou cestou
          s = s.replace(/(\s(?:href|src|action|poster|data-href)=["'])\/(?!\/)/g, (m, p1) => `${p1}${b}/`);
          // srcset (více cest oddělených čárkou)
          s = s.replace(/(\ssrcset=["'])([^"']+)(["'])/g, (m, p1, list, p3) => p1 + list.replace(/(^|,\s*)\/(?!\/)/g, `$1${b}/`) + p3);
          // dvojité prefixy (pokud už Astro cestu doplnilo samo)
          s = s.split(`${b}${b}/`).join(`${b}/`);
          fs.writeFileSync(f, s);
        }
        fs.writeFileSync(path.join(root, '.nojekyll'), '');
      },
    },
  };
}

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  server: { port: 4321 },
  // Hosting EzyStudio běží na Cloudflare: adaptér je povinný. Web je celý statický (prerender).
  adapter: cloudflare({ imageService: 'compile' }),
  session: false,
  integrations: [prefixRootLinks()],
});
