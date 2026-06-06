# POC — Galerie « Banc de montage »

Une galerie de projets présentée comme un **banc de montage vidéo (NLE)** : une
**règle temporelle** graduée (timecodes), une **tête de lecture** draggable, et des
**pistes** (V1 / V2) où les projets sont posés en **clips** alignés sur la frise.
On **scrubbe** la tête (glisser, cliquer sur la règle, ou scroller) ; le clip sous la
tête devient focal, s'agrandit dans le **moniteur** de prévisualisation et joue sa
vidéo. Au relâché, la tête **snappe** sur le centre du clip le plus proche.
Esprit Premiere / Final Cut : graphite/anthracite, accent bleu lecture.

Ce dossier est **autonome et exportable** : copiez-le tel quel ailleurs, ou
intégrez seulement `src/` dans un projet React existant.

## Lancer en autonome

```bash
cd "03 banc de montage"
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + build de production dans dist/
```

## Stack

React 18 + TypeScript · MUI v6 (`@mui/material`, `@mui/icons-material`, `@emotion`) ·
**Framer Motion v11**. Aucun WebGL, aucune autre dépendance. Vite.

## Structure

```
03 banc de montage/
  index.html  vite.config.ts  tsconfig.json  package.json
  src/
    main.tsx                    # ThemeProvider + CssBaseline + Inter, monte <App/>
    App.tsx                     # démo : <TimelineEditorView projects={projects} />
    theme.ts                    # thème MUI neutre (Inter)
    types.ts                    # type Project (contrat de données) + GalleryViewProps
    motion.ts                   # standard de transitions partagé (springs, scroll, snap)
    data/projects.ts            # 9 projets de DÉMO (à remplacer par les vrais)
    hooks/useDragGuard.ts       # distingue clic vs drag (scrub de la tête)
    components/ProjectTile.tsx  # tuile/média réutilisable (image, aperçu vidéo, badge)
    TimelineEditorView.tsx      # ⭐ LA vue « Banc de montage »
```

## Vos données — le type `Project`

```ts
type Project = {
  id: string;
  title: string;       // titre du projet
  author: string;      // auteur
  thumbnail: string;   // image d'aperçu (poster du clip)
  width: number;       // dimensions du thumbnail (ratio, sans préchargement)
  height: number;
  href: string;        // destination ouverte au clic (nouvel onglet)
  kind: 'site' | 'page';
  previewVideo?: string; // vidéo muette jouée dans le moniteur (facultatif)
};
```

Remplacez `src/data/projects.ts` par vos vrais projets. Sans `previewVideo`, le
moniteur affiche simplement le `thumbnail`.

## Notes de conception

- **Trois moyens de scrubber qui coexistent** : glisser la tête de lecture
  (`useDragGuard` + pointer capture), cliquer sur la règle, ou scroller (conteneur
  de scroll interne `useScroll({ container })` lissé par `useSpring`, mappé sur la
  position de la tête). La page derrière ne défile pas (`overscroll-behavior: contain`).
- **Une seule `<video>` à la fois.** Seul le clip sous la tête monte sa vidéo
  (prop `playing` de `ProjectTile`) — léger, pas d'autoplay massif.
- **Snap au repos.** Au relâché / à l'arrêt du scroll, la tête se cale sur le centre
  du clip le plus proche (`springs.settle`), clips de durées irrégulières gérés.
- **Accessibilité / repli.** `prefers-reduced-motion` → sélection au tap, la tête se
  pose sans transition. Les clips sont focusables au clavier (flèches / Entrée / Espace).
- **Mobile.** La frise déborde et défile horizontalement ; tap d'un clip pour le lire.

Les vidéos et images de `data/projects.ts` sont des **placeholders publics**
(picsum.photos + échantillons Google) — à remplacer par vos médias.
