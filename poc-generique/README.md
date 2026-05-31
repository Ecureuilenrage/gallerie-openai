# POC — Galerie « Générique (titres) »

Une galerie de projets présentée comme un **générique de film qui défile au scroll** :
un ruban de cartons (rôle + nom de l'auteur + titre) remonte au défilement ; le bloc
arrivé **au centre** se révèle dans un **moniteur fixe** et y joue sa vidéo. Calme,
premium, fond noir, typo Inter.

Ce dossier est **autonome et exportable** : copiez-le tel quel dans un nouvel
emplacement, ou intégrez seulement `src/` dans un projet React existant.

## Lancer en autonome

```bash
cd poc-generique
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + build de production dans dist/
```

## Stack

React 18 + TypeScript · MUI v6 (`@mui/material`, `@mui/icons-material`, `@emotion`) ·
**Framer Motion v11**. Aucun WebGL, aucune autre dépendance. Vite.

## Structure

```
poc-generique/
  index.html  vite.config.ts  tsconfig.json  package.json
  src/
    main.tsx                 # ThemeProvider + CssBaseline + Inter, monte <App/>
    App.tsx                  # démo : <CreditsView projects={projects} /> plein écran
    theme.ts                 # thème MUI neutre (Inter)
    types.ts                 # type Project (le contrat de données) + GalleryViewProps
    motion.ts                # springsScroll (lissage scroll) + dwellIndex (anti-clignotement)
    data/projects.ts         # 9 projets de DÉMO (à remplacer par les vrais)
    hooks/useDragGuard.ts    # distingue clic vs drag (utilisé par ProjectTile)
    components/ProjectTile.tsx  # tuile/média réutilisable (image, aperçu vidéo, badge)
    CreditsView.tsx          # ⭐ LA vue « Générique (titres) »
```

## Intégrer dans un projet existant

1. Copiez `src/CreditsView.tsx`, `src/components/ProjectTile.tsx`,
   `src/hooks/useDragGuard.ts`, `src/types.ts` et `src/motion.ts` dans votre projet
   (gardez l'arborescence relative, ou ajustez les imports).
2. Installez les dépendances : `@mui/material @mui/icons-material @emotion/react @emotion/styled framer-motion`.
3. Rendez la vue avec vos données :

```tsx
import CreditsView from './CreditsView';
import type { Project } from './types';

const projects: Project[] = [/* vos projets */];

<CreditsView projects={projects} />
```

## Vos données — le type `Project`

```ts
type Project = {
  id: string;
  title: string;       // titre du projet
  author: string;      // nom affiché dans le générique
  thumbnail: string;   // image d'aperçu (poster)
  width: number;       // dimensions du thumbnail (ratio, sans préchargement)
  height: number;
  href: string;        // destination ouverte au clic (nouvel onglet)
  kind: 'site' | 'page';
  previewVideo?: string; // vidéo muette jouée sur la tuile au centre (facultatif)
};
```

Remplacez `src/data/projects.ts` par vos vrais projets. Sans `previewVideo`, le
moniteur affiche simplement le `thumbnail`.

## Notes de conception

- **Le scroll reste contenu dans la vue.** Le défilement est capté par un conteneur
  interne (`useScroll({ container })` + `overscroll-behavior: contain`) : la molette
  fait avancer le générique **sans faire défiler la page** autour. La vue occupe
  `100vh` ; placez-la dans un conteneur de cette hauteur.
- **Une seule `<video>` à la fois.** Seul le projet au centre monte sa vidéo
  (prop `playing` de `ProjectTile`) — léger, pas d'autoplay massif.
- **Point d'arrêt stable.** L'index focal est filtré par `dwellIndex` (hystérésis +
  vélocité) pour éviter le clignotement quand on flotte entre deux blocs ;
  `scroll-snap` léger par bloc.
- **Accessibilité / repli.** `prefers-reduced-motion` → liste statique lisible (pas
  de défilement piloté). Blocs focusables au clavier (Entrée/Espace ouvre le projet).
- **Mobile.** Le conteneur scrolle au doigt ; le moniteur s'adapte en largeur.

Les vidéos et images de `data/projects.ts` sont des **placeholders publics**
(picsum.photos + échantillons Google) — à remplacer par vos médias.
