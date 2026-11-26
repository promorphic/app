import { cpSync, existsSync, mkdirSync, copyFileSync, createReadStream, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Every screen has an address of its own. GitHub Pages serves files, not routes, so the built page is
// copied to each address; anything else gets the same page as 404.html and the app shows "not found".
export const ROUTES = ['portfolio', 'orders', 'activity', 'agent', 'mandates', 'wallets', 'login', 'signup', 'test', 'auth/verify', 'terms', 'privacy'];

// data/ and static/chains/ stay where the chain listers write them, outside public/.
// This serves them as they are while developing and copies them into the build.
const KEPT = ['data', 'static/chains'];
const TYPES: Record<string, string> = { '.json': 'application/json', '.svg': 'image/svg+xml', '.md': 'text/markdown' };

function keptFolders(): Plugin {
  let out = 'dist';
  return {
    name: 'promorphic-kept-folders',
    configResolved(c) { out = resolve(c.root, c.build.outDir); },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = decodeURIComponent((req.url || '').split('?')[0]);
        if (!KEPT.some((d) => path.startsWith('/' + d + '/')) || path.includes('..')) return next();
        const file = join(server.config.root, path);
        if (!existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader('Content-Type', TYPES[extname(file)] || 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-cache');
        createReadStream(file).pipe(res);
      });
    },
    closeBundle() {
      if (!existsSync(join(out, 'index.html'))) return;
      for (const d of KEPT) cpSync(d, join(out, d), { recursive: true });
      for (const r of ROUTES) {
        mkdirSync(join(out, r), { recursive: true });
        copyFileSync(join(out, 'index.html'), join(out, r, 'index.html'));
      }
      copyFileSync(join(out, 'index.html'), join(out, '404.html'));
    },
  };
}

export default defineConfig({
  plugins: [react(), keptFolders()],
  server: { port: 5210, strictPort: false },
  preview: { port: 5210 },
});
