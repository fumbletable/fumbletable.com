import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

/*
 * Legacy Jekyll URLs that exist only as meta-refresh stubs (see
 * src/pages/[...redirect].astro). Read straight from the posts'
 * `redirect_from` frontmatter so this list can never drift from the stubs
 * that actually get built.
 *
 * Excluded from the sitemap: they carry noindex, and submitting a noindex
 * URL earns a Search Console warning.
 */
function legacyRedirectPaths() {
  const dir = path.resolve('./src/content/posts');
  const paths = new Set();
  if (!fs.existsSync(dir)) return paths;

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const frontmatter = raw.split(/^---\s*$/m)[1];
    if (!frontmatter) continue;

    // Matches both `redirect_from: /foo/` and a `- /foo/` YAML list beneath it.
    const block = frontmatter.match(/^redirect_from:\s*(.*(?:\r?\n\s+-.*)*)/m);
    if (!block) continue;

    for (const m of block[1].matchAll(/\/?[\w./-]+/g)) {
      const clean = m[0].replace(/^[-\s]+/, '').replace(/^\/|\/$/g, '');
      if (clean) paths.add(clean);
    }
  }
  return paths;
}

const LEGACY = legacyRedirectPaths();

export default defineConfig({
  site: 'https://fumbletable.com',
  output: 'static',

  integrations: [
    sitemap({
      filter: (url) => {
        const p = new URL(url).pathname.replace(/^\/|\/$/g, '');

        // Tag pages: 119 thin, unstyled pages. Index bloat, no search value.
        if (p === 'tags' || p.startsWith('tags/')) return false;

        // /categories/* are now noindex redirects to the section pages.
        if (p === 'categories' || p.startsWith('categories/')) return false;

        // Legacy redirect stubs — noindex, so keep them out of the sitemap.
        if (LEGACY.has(p)) return false;

        return true;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
