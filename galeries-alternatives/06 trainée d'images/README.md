# POC — Galerie « Traînée d'images »

Une galerie de projets où, en **balayant la scène à la souris**, une **traînée de
vignettes** se dessine le long du tracé (un participant **différent** à chaque pop →
multiplicité perçue en quelques secondes) puis **s'efface** (scale + fade). Survoler
une vignette la **fige** et lance son aperçu vidéo (une seule `<video>` active à la
fois). Fond éditorial sobre.

Ce dossier est **autonome et exportable** : copiez-le tel quel ailleurs, ou
intégrez seulement `src/` dans un projet React existant.

## Lancer en autonome

```bash
cd "06 trainée d'images"
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + build de production dans dist/
```

## Stack

React 18 + TypeScript · MUI v6 (`@mui/material`, `@mui/icons-material`, `@emotion`) ·
**Framer Motion v11**. Aucun WebGL, aucune autre dépendance. Vite.

## Structure

```
06 trainée d'images/
  index.html  vite.config.ts  tsconfig.json  package.json
  src/
    main.tsx                    # ThemeProvider + CssBaseline + Inter, monte <App/>
    App.tsx                     # démo : <ImageTrailView projects={projects} />
    theme.ts                    # thème MUI neutre (Inter)
    types.ts                    # type Project (contrat de données) + GalleryViewProps
    motion.ts                   # standard de transitions partagé (springs, tweens)
    data/projects.ts            # 9 projets de DÉMO (à remplacer par les vrais)
    hooks/useDragGuard.ts       # distingue clic vs drag (utilisé par ProjectTile)
    components/ProjectTile.tsx  # tuile/média réutilisable (image, aperçu vidéo, badge)
    ImageTrailView.tsx          # ⭐ LA vue « Traînée d'images »
```

## Vos données — le type `Project`

```ts
type Project = {
  id: string;
  title: string;       // titre du projet
  author: string;      // auteur
  thumbnail: string;   // image d'aperçu (vignette de la traînée)
  width: number;       // dimensions du thumbnail (ratio, sans préchargement)
  height: number;
  href: string;        // destination ouverte au clic (nouvel onglet)
  kind: 'site' | 'page';
  previewVideo?: string; // vidéo muette jouée sur la vignette figée (facultatif)
};
```

Remplacez `src/data/projects.ts` par vos vrais projets. Sans `previewVideo`, la
vignette figée affiche simplement le `thumbnail`.

## Notes de conception

- **Pas de `setState` par mousemove.** La position du pointeur vit dans deux
  `MotionValue` ; on capte le mouvement via `useMotionValueEvent`. Une vignette ne
  « pop » que lorsque le curseur a parcouru plus d'un seuil (`STEP`) depuis le pop
  précédent. Chaque vignette s'auto-retire après un court délai (`AnimatePresence`).
- **Une seule `<video>` à la fois.** Seule la vignette survolée (figée) monte sa
  vidéo (prop `playing` de `ProjectTile`) — léger, pas d'autoplay massif.
- **Plafond d'items.** Au plus `MAX_TRAIL` vignettes simultanées (perf).
- **Accessibilité / repli.** `prefers-reduced-motion` **ou** absence de survol
  (`(hover:none)`, mobile) → grille **calme** statique, aperçu vidéo au survol/tap.
  La traînée est désactivée dans ce mode.

Les vidéos et images de `data/projects.ts` sont des **placeholders publics**
(picsum.photos + échantillons Google) — à remplacer par vos médias.
