import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Build pensé pour être **embarqué** dans le site hôte (HTML statique ereyes) :
 * - `base: './'` → chemins d'assets relatifs (fonctionne en sous-dossier, ex.
 *   GitHub Pages de projet) ;
 * - noms de sortie **stables** (`galerie.js` / `galerie.css`) pour que la page
 *   hôte puisse les référencer sans connaître les hashes ;
 * - `cssCodeSplit: false` → une seule feuille CSS (`galerie.css`).
 * Les polices restent versionnées (hash) dans `fonts/`, référencées par le CSS.
 *
 * En dev (`npm run dev`), rien ne change : montage dans `#root` (voir main.tsx).
 */
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'galerie.js',
        chunkFileNames: 'galerie-[name].js',
        assetFileNames: (info) => {
          const name = info.name ?? '';
          if (name.endsWith('.css')) return 'galerie.css';
          return 'fonts/[name]-[hash][extname]';
        },
      },
    },
  },
});
