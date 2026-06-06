# Galerie des participants — trois vues, bilingue

Galerie des participants de l'atelier Sora/OpenAI. **Trois vues** d'une même
donnée, basculables via un sélecteur en bas à droite (« Vue alternative ») :

1. **Générique (titres)** — vue principale, plein écran : une vidéo à la fois au
   centre, **nom** du créateur superposé, voisins atténués au-dessus/en dessous.
   Le défilement (molette, swipe, flèches) avance d'**un projet à la fois**. Clic =
   lecture dans une **lightbox**, avec une barre vers les ressources (2ᵉ vidéo,
   document, prompts, lien).
2. **Banc de montage** — éditeur façon NLE : règle temporelle, tête de lecture,
   clips sur 2 pistes ; scrub molette/drag/clic, flèches clavier. Clic → même
   lecteur Drive que le Générique.
3. **Traînée d'images** — vignettes qui « pop » sous le curseur ; clic → lecteur.
   Repli **grille calme** en mobile / `prefers-reduced-motion`.

Les vues 2 et 3 sont issues de la shortlist du brainstorm, **branchées sur les
mêmes participants** et le **même lecteur** (`VideoLightbox`/`DocLightbox`).
Calme, minimaliste, fond noir, typo Inter. App autonome dérivée de
`../poc-generique` (laissé intact comme référence).

## Bilingue FR/EN

Tous les libellés visibles sont traduits (ex. « Lien » → « Link »). La langue se
**synchronise avec le site hôte** (`ereyes/openai_creativelab_2026`), dont le
toggle FR/EN pose `localStorage['ocl-language']` + `document.documentElement.lang`
sans émettre d'événement : on observe donc l'attribut `lang` du `<html>`
(`MutationObserver`) et l'event `storage`. Un **mini-toggle FR/EN** interne (en
haut à droite) sert au mode autonome et reste cohérent avec l'hôte. Tout passe
par `i18n/index.tsx` (`LangProvider` + `useI18n()` → `{ lang, setLang, t }`).

## Données — fetch dynamique depuis le Google Sheet (CSV)

La **source de vérité** est un Google Sheet publié en CSV. La galerie le
`fetch` au chargement : **éditer la feuille met à jour la galerie** au prochain
rafraîchissement, sans rebuild ni redéploiement.

- URL par défaut codée dans `src/lib/csv.ts` (`CSV_URL`), surchargeable via la
  variable d'environnement Vite `VITE_CSV_URL` (fichier `.env`).
- Colonnes attendues : `num, participant, lien, pdf, prompts, video_01, video_02, vignette`.
- **Vidéos = Google Drive.** Les liens Drive (formats `/file/d/ID/view`,
  `/preview` ou `?id=ID`) sont normalisés : l'identifiant pilote l'embed du
  lecteur (`/preview` dans la lightbox) et la **vignette** (`drive.google.com/thumbnail`).
  Les fichiers Drive doivent être partagés « **tout utilisateur disposant du lien** ».
- **Vignette.** Colonne `vignette` si renseignée, sinon poster auto de la vidéo
  héros, sinon image de démonstration. Les vignettes sont rapatriées localement
  dans `public/vignettes/` (script `npm run vignettes`).
- **Repli hors-ligne.** Si le `fetch` échoue (réseau, CORS, feuille dépubliée),
  la galerie retombe sur un instantané du CSV embarqué dans
  `src/data/participants.ts` et affiche une pastille « Données hors-ligne ».
  Pour rafraîchir l'instantané : recoller le contenu du CSV dans ce fichier.

### Publier / mettre à jour la feuille

Dans Google Sheets : *Fichier → Partager → Publier sur le web → (cette feuille,
format CSV)*. Coller l'URL obtenue dans `CSV_URL` (ou `VITE_CSV_URL`).

## Lancer

```bash
cd galerie
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + build de production dans dist/
```

## Stack

React 18 + TypeScript · MUI v6 (`@mui/material`, `@mui/icons-material`, `@emotion`) ·
**Framer Motion v11** · Vite. Aucun WebGL.

## Structure

```
galerie/
  index.html  vite.config.ts  tsconfig.json  package.json
  src/
    main.tsx                       # ThemeProvider + Inter + <LangProvider> + <App/>
    App.tsx                        # ⭐ shell : bascule des 3 vues + switcher + toggle + lightbox alt
    theme.ts                       # thème MUI neutre (Inter)
    types.ts                       # Project (+ Resource), GalleryViewProps, ViewMode
    motion.ts                      # standard de transitions (springs/tweens/helpers)
    vite-env.d.ts                  # typage de import.meta.env (VITE_CSV_URL)
    i18n/
      index.tsx                    # ⭐ LangProvider + useI18n + dictionnaire FR/EN + synchro hôte
    lib/
      csv.ts                       # ⭐ fetch + parse CSV → Project[] (+ CSV_URL)
      drive.ts                     # extraction d'ID Google Drive + URLs embed/vignette
    hooks/
      useParticipants.ts           # ⭐ fetch live + repli hors-ligne
      useDragGuard.ts              # distingue clic vs drag
    data/
      participants.ts              # instantané CSV de secours (FALLBACK)
      vignettes.ts                 # manifeste des vignettes locales (généré)
    components/
      ProjectTile.tsx              # tuile/média (vignette, badge, onActivate)
      VideoLightbox.tsx            # ⭐ lecteur Google Drive + barre de ressources
      DocLightbox.tsx              # visionneuse PDF Drive intégrée
      ViewSwitcher.tsx             # sélecteur de vue (bas-droite)
      LangToggle.tsx               # mini-toggle FR/EN (haut-droite)
      AltLightboxHost.tsx          # useAltLightbox() : lightbox partagée des vues alt
    CreditsView.tsx                # ⭐ vue « Générique (titres) »
    views/
      TimelineEditorView.tsx       # vue alternative — Banc de montage (NLE)
      ImageTrailView.tsx           # vue alternative — Traînée d'images
```

## Notes de conception

- **Trois vues, une donnée.** `App` détient l'état `ViewMode` et rend la vue
  active ; toutes reçoivent le même `projects: Project[]`. Les vues alternatives
  reçoivent en plus `onOpenProject(project)` pour ouvrir le lecteur partagé.
- **Navigation par pas (Générique).** Chaque geste avance d'exactement un projet :
  impossible de sauter un projet sans le voir, donc chaque transition est animée.
  La vue occupe `100vh` et capte la molette (pas de scroll natif de page).
- **Lecture en lightbox (partagée).** Clic/Entrée ouvre une modale qui lit la vidéo
  Drive (`/preview`) ; fermeture par Échap/clic-dehors → iframe démontée, son coupé.
  Une barre sous la vidéo expose les ressources (Vidéo 2, document, prompts, lien).
  Les vues alternatives réutilisent ce même lecteur via `useAltLightbox`.
- **Clavier.** Générique : flèches, Entrée/Espace, Home/End. Banc de montage :
  flèches ←/→ (clip précédent/suivant) + Entrée (ouvre le lecteur). La Traînée
  est un geste souris (pas de clavier dédié ; sa grille calme reste accessible).
- **Accessibilité / repli.** `prefers-reduced-motion` → Générique en liste statique,
  Traînée en grille calme, Banc de montage sans scrub animé. Éléments focusables.
```
