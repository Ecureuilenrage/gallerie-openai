# Contexte — Galerie des participants Sora/OpenAI

> Document de reprise. À fournir en début de conversation pour éviter de ré-explorer le projet.
> Dernière mise à jour : 2026-06-06 (3 vues : Générique + Banc de montage + Traînée d'images ;
> sélecteur de vue ; bilingue FR/EN synchronisé au site hôte ; **build prêt à coller
> `galerie-build/` + bouton « Retour » + vignettes en chemins relatifs**).

---

## 1. Vue d'ensemble

Application **React 18 + Vite 5 + TypeScript** affichant les participants d'un atelier
Sora/OpenAI. **Trois vues** d'une même donnée, basculables via un sélecteur en bas à droite :

1. **Générique (titres)** — vue principale, plein écran : une seule vidéo au centre à la fois,
   nom du créateur superposé. Navigation **pilotée par pas** (molette, swipe, flèches) — chaque
   geste avance d'exactement un projet, transitions animées (Framer Motion).
2. **Banc de montage** — éditeur NLE (règle, tête de lecture, clips sur 2 pistes, scrub
   molette/drag/clic, flèches clavier). Vue alternative de la shortlist du brainstorm.
3. **Traînée d'images** — vignettes qui « pop » sous le curseur (souris), repli grille « calme »
   en mobile/reduced-motion. Vue alternative de la shortlist.

Les deux vues alternatives sont **alimentées par les mêmes participants** et ouvrent le **même
lecteur Drive** (`VideoLightbox`/`DocLightbox`) que le Générique. L'app est **bilingue FR/EN**.

- **Répertoire app** : `C:\Dev\PRJET\p8\gallerie-openai\galerie\`
- **Stack** : React 18.3, Vite 5.4, TypeScript 5.6, MUI 6.1 (`@mui/material`, `@mui/icons-material`),
  Emotion, Framer Motion 11, `@fontsource/inter`.
- **Lancer** : `cd galerie ; npm install ; npm run dev` → http://localhost:5173
- **Builder** : `npm run build` (= `tsc && vite build`) → `dist/` (noms stables `galerie.js`, `galerie.css`).
- **Intégration** : la galerie est conçue pour être embarquée dans le site statique
  `ereyes/openai_creativelab_2026`. Un **build compilé prêt à copier-coller** est versionné à
  la racine du dépôt dans **`galerie-build/`** (`galerie.html` + `galerie-app/` + `vignettes/`) :
  copier son contenu à la racine du repo du site, aucun build côté site. Guide :
  `galerie/integration/INTEGRATION.md` ; mode d'emploi : `galerie-build/README.md`. Tous les
  chemins sont **relatifs** (`base: './'` + vignettes via `import.meta.env.BASE_URL`) → marche
  sous le sous-chemin `…github.io/openai_creativelab_2026/`.
- Le dépôt contient aussi `poc-generique/` (POC initial), `participants/` (dossiers sources des
  participants, **sans fichiers vidéo/image web**), `backlog.md`.

### Intégration au site statique — `galerie-build/` (points d'attention)

Le site hôte est **statique** (aucun outil de build) : on lui livre le **build compilé**
`galerie-build/` (à la racine du dépôt). Voir `galerie-build/README.md` pour le détail.

- **Quoi copier** : le **contenu** de `galerie-build/` à la racine du repo
  `openai_creativelab_2026`, en **écrasant** `galerie.html`. Soit **deux dossiers**
  (`galerie-app/` = code, `vignettes/` = images) **plus** `galerie.html`.
- **Vignettes à la racine, à côté de `galerie.html`** (jamais dans `galerie-app/`) :
  elles sont référencées en relatif `./vignettes/…` par rapport à la page hôte.
- **Chemins relatifs partout** (`base: './'` + `import.meta.env.BASE_URL`) → marche sous
  le sous-chemin `…github.io/openai_creativelab_2026/` (sinon les vignettes faisaient 404).
- **Bouton « Retour »** (haut-gauche) piloté par `data-home-href="./index.html"` sur
  `#gallery-root` ; masqué en mode autonome (montage `#root`).
- **Partage Drive** : vidéos partagées « Tout utilisateur disposant du lien », sinon lecteurs
  vides. Les vignettes locales s'affichent dans tous les cas.
- **Régénérer** après une modif : `npm run build` puis recopier `dist/` dans `galerie-build/`.
- **Repo cible non versionné ici** : ce dépôt prépare le build ; le copier-coller dans
  `openai_creativelab_2026` reste manuel (commande PowerShell dans `galerie-build/README.md`).

---

## 2. Source de données (CSV Google Sheet)

**Source de vérité** : un Google Sheet publié en CSV.
URL (dans `galerie/src/lib/csv.ts`, surchargeable via `VITE_CSV_URL`) :
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2J9znISYyRj69-SBMjGL1oYQgAJkZeZi4i0yeWDr_h5mDD7FNYVNB9m62xctahL3pBk2GP5YOCyst/pub?gid=0&single=true&output=csv
```

**8 colonnes** : `num, participant, lien, pdf, prompts, video_01, video_02, vignette`
- `num` (A) : ordre d'affichage (1–9)
- `participant` (B) : nom du créateur
- `lien` (C) : site/dépôt externe (optionnel)
- `pdf` (D) : document (souvent Drive, parfois URL externe)
- `prompts` (E) : lien des prompts (Drive, optionnel)
- `video_01` (F) : vidéo principale (Drive) — pilote vignette de secours + lecteur
- `video_02` (G) : 2ᵉ vidéo (Drive, optionnel)
- `vignette` (H) : **image poster** (URL Drive `.../preview`) — image affichée au défilement

### Données actuelles des 9 participants (récapitulatif)
| # | Participant | lien | pdf | prompts | video_02 | vignette |
|---|-------------|------|-----|---------|----------|----------|
| 1 | Samuel DA SILVA | – | Drive | – | – | Drive |
| 2 | Rosa CINELLI | – | Drive | **Drive** | – | Drive |
| 3 | Everardo REYES | **github.com/ereyes/sora** | URL externe (.pdf) | – | **Drive** | Drive |
| 4 | Arthur GILLIER | **seg1-exe.github.io/openai-sora-research** | – | – | – | Drive |
| 5 | Jéssica NICOLETTI | – | Drive | – | **Drive** | Drive |
| 6 | Kilyan SZMIDT | – | Drive | – | **Drive** | Drive |
| 7 | Klein LÉON | **openai.exoniq.io** | – | – | – | Drive |
| 8 | Federico BIGGIO | – | Drive | **Drive** | – | Drive |
| 9 | Khanh Dan TRAN | – | Drive | – | – | Drive |

- **Liens externes** : Reyes (3), Gillier (4), Klein (7).
- **Prompts** : Rosa Cinelli (2), Federico Biggio (8).
- **2ᵉ vidéo** : Reyes (3), Nicoletti (5), Szmidt (6).

Le CSV complet (avec les ID Drive) est embarqué dans `galerie/src/data/participants.ts` (`SNAPSHOT`).

---

## 3. Pipeline de données

```
CSV (live)  ──fetchParticipants()──┐
                                   ├─► rowToProject() ─► Project[] ─► CreditsView
SNAPSHOT local (participants.ts) ──┘
```

- **`galerie/src/lib/csv.ts`**
  - `parseCsv(text)` : parseur CSV robuste (guillemets, échappements, retours-ligne).
  - `rowToProject(row)` : transforme une ligne en `Project`. Construit `resources[]`
    (Vidéo 2 → PDF → Prompts → Site), calcule la vignette, expose `link` et `promptsHref`.
  - `fetchParticipants(url)` : fetch live, tri par `num`, throw si vide.
- **`galerie/src/lib/drive.ts`**
  - `driveId(url)` : extrait l'ID d'une URL Drive (`/d/ID/` ou `?id=ID`).
  - `drivePreview(id)` = `https://drive.google.com/file/d/{id}/preview` (lecteur vidéo ET visionneuse PDF).
  - `driveThumb(id)` = `https://drive.google.com/thumbnail?id={id}&sz=w1280` (image poster).
- **`galerie/src/data/participants.ts`** : `SNAPSHOT` (CSV en chaîne) → `FALLBACK: Project[]`
  dérivé via `rowToProject`. C'est la **copie locale** affichée immédiatement.
- **`galerie/src/data/vignettes.ts`** *(généré)* : manifeste `VIGNETTES` (slug → chemin **relatif**
  `vignettes/<slug>.<ext>`, sans `/` initial). Préfixé par `import.meta.env.BASE_URL` dans
  `rowToProject` (dev → `/vignettes/…` ; build → `./vignettes/…`, résolu par rapport à la page
  hôte → OK en sous-chemin). Produit par le script ci-dessous ; **ne pas éditer à la main**.

### Vignettes : images LOCALES (et comment les rafraîchir)
Google bloque le hotlink `<img>` vers `drive.google.com/thumbnail` (le `curl` passe, le
navigateur non). On rapatrie donc chaque vignette dans le dépôt et on la sert par chemin local.

- **Images** : `galerie/public/vignettes/<slug>.<ext>` (servies à la racine par Vite, copiées dans
  `dist/` au build). Une image par participant, nommée par son slug (ex. `samuel-da-silva.png`).
- **Script** : `galerie/scripts/fetch-vignettes.mjs` (lancé par `npm run vignettes`). Il lit le CSV
  publié (même URL que l'app, surchargeable via `VITE_CSV_URL`), télécharge la vignette de la
  colonne H (`thumbnail?id=…&sz=w1280`), **régénère** `public/vignettes/` et réécrit le manifeste
  `src/data/vignettes.ts`. Repli automatique sur le **poster de la vidéo héros** si la vignette
  Drive est absente/non partagée (cas Klein LÉON, dont l'ID vignette renvoie 404).
- **Quand le CSV change** : relancer `npm run vignettes`, puis `npm run build`.
- **Priorité de `thumbnail`** (dans `rowToProject`) : image locale `VIGNETTES[id]` → `driveThumb`
  de la colonne → `driveThumb` du héros → chaîne vide. **Plus de placeholder picsum** : si rien
  n'est disponible, `ProjectTile` affiche un fond sombre uni (`#0c0d10`).
- **`galerie/src/hooks/useParticipants.ts`** : initialise l'état avec `FALLBACK` (`loading:false`,
  affichage instantané, pas de splash), puis **rafraîchit silencieusement** depuis le live ;
  échec live = on garde le local, sans erreur affichée.

---

## 4. Types (`galerie/src/types.ts`)

```ts
type ResourceKind = 'video' | 'pdf' | 'prompts' | 'site';
type Resource = { kind: ResourceKind; label: string; href: string; driveId?: string };
type Project = {
  id: string; num: number; title: string; author: string;
  thumbnail: string;            // URL image vignette
  width: number; height: number;
  href: string;                 // destination au clic en mode lien
  kind: 'video' | 'site';
  videoId?: string;             // ID Drive de la vidéo principale
  link?: string;                // colonne `lien` (bouton)
  promptsHref?: string;         // colonne `prompts` (bouton)
  resources: Resource[];        // Vidéo 2, PDF, Prompts, Site
  previewVideo?: string;        // héritage POC, non utilisé
  group?: string;               // non utilisé
};

// Vues disponibles (cf. App.tsx) :
type ViewMode = 'credits' | 'timeline' | 'trail';
// Les vues alt reçoivent `GalleryViewProps & { onOpenProject?: (p: Project) => void }`.
```

---

## 5. Composants

- **`App.tsx`** : `useParticipants()` → `<CreditsView projects={...}>`. `Splash` (ne s'affiche
  plus car `loading` démarre à `false`) et `OfflineBadge` (affiché si `error`, désormais jamais).
- **`CreditsView.tsx`** (vue principale) :
  - Navigation par pas : `step()`, molette (`WHEEL_THRESHOLD=28`, `STEP_COOLDOWN=430ms`), swipe,
    clavier (flèches, PageUp/Down, Home, End, Enter).
  - Scène : nom précédent (haut, cliquable) / vidéo centrale + nom / nom suivant (bas, cliquable).
  - **Survol** de la vidéo centrale (`hovering`) → monte une **iframe Drive** (`drivePreview`)
    pour lecture inline (le nom s'efface). Démontée à la sortie (coupe le son). Réinitialisé
    au changement de `focal`. ⚠️ Drive n'autorise pas l'autoplay → lecture manuelle.
  - **Icône agrandir** (haut-droite, `OpenInFullRounded`) : visible **au survol uniquement**,
    ouvre le lecteur plein écran.
  - **`ActionRail`** (colonne verticale **à droite de la vidéo, hors incrustation** ; entrée animée
    en décalé `staggerChildren`/`delayChildren`, rejouée à chaque changement de projet via `key`) :
    boutons Vidéo 2 / Document / Prompts / Lien selon disponibilité. Style « étiquette de générique »
    (proposition n°5) : monospace espacé, filets fins, tiret marqueur au survol, index numéroté.
    Constante de style : `railItemSx(horizontal)`. La vidéo est recentrée par une cale invisible
    (même largeur `RAIL_WIDTH`) à gauche, masquée en `xs`.
    - Vidéo 2 → ouvre le lecteur sur cette vidéo (`playVideo`).
    - Document → si PDF Drive : `DocLightbox` (`setDocId`) ; sinon (PDF externe) : nouvel onglet.
    - Prompts / Lien → nouvel onglet.
  - `NameOverlay` (nom centré + voile), prop `dimmed` (s'efface au survol).
  - Repli `useReducedMotion` : liste statique verticale + même `ActionRail` (horizontal).
  - Lecteurs montés en bas : `<VideoLightbox>` + `<DocLightbox>`.
  - Style des boutons du rail : constante `railItemSx` (étiquette monospace, filets, proposition n°5).
- **`components/ProjectTile.tsx`** : image vignette (`<img src={project.thumbnail}>`) + icône
  play centrale (si `kind !== 'site'`) + badge rond top-right (masquable via prop **`showBadge`**,
  mis à `false` dans la galerie) + légende optionnelle. Modes `as='a' | 'div'`.
- **`components/VideoLightbox.tsx`** : modale `Dialog` noire, iframe `drivePreview(videoId)` +
  barre de ressources (Vidéo 2 rejoue dans la modale ; **PDF Drive → `onOpenDoc`** ouvre la
  visionneuse intégrée ; Prompts/Site → nouvel onglet). Prop `onOpenDoc?`.
- **`components/DocLightbox.tsx`** *(créé)* : modale `Dialog` noire avec iframe `drivePreview(driveId)`
  pour afficher un **PDF Drive intégré**. Props `{ driveId, title?, onClose }`.

### Vues alternatives & sélecteur (ajout 2026-06-06)
- **`App.tsx`** = shell : `useState<ViewMode>('credits')` (`'credits' | 'timeline' | 'trail'`), rendu
  conditionnel des 3 vues, monte `<ViewSwitcher>` + `<LangToggle>` + la lightbox partagée.
  Les vues alternatives sont rendues dans un conteneur sombre avec padding (le Générique reste plein écran).
- **`views/TimelineEditorView.tsx`** *(Banc de montage)* : adapté du prototype `galeries-alternatives/
  03 banc de montage`. Importe le `Project` riche (`../types`), réutilise `ProjectTile`/`useDragGuard`/
  `motion.ts`. Clic moniteur/Entrée → `onOpenProject` (lecteur Drive). Flèches ←/→ au niveau vue
  (`onKeyDown` gardé par `target === currentTarget` pour ne pas doubler les chips). Titre + note
  shortlist intégrés à la barre de titre. Plus de lecture inline (pas de `previewVideo` sur les vrais
  `Project`) ; label `SITE/VIDEO` au lieu de `SITE/PAGE`.
- **`views/ImageTrailView.tsx`** *(Traînée d'images)* : adapté de `galeries-alternatives/06 trainée
  d'images`. Vignettes via `ProjectTile` (`onActivate={onOpenProject}`). Couleurs passées en sombre
  (`#0c0d10`) pour coller au shell. Titre + note shortlist **au-dessus du canevas**. Pas de clavier
  (geste souris) ; repli `CalmGrid` pour mobile/reduced-motion. La traînée est **désactivée** quand
  `reduce || (hover:none) || projects.length === 0`.
- **`components/ViewSwitcher.tsx`** : sélecteur bas-droite (`zIndex 11`). Sur le Générique : libellé
  « Vue alternative » + 2 boutons. Sur une vue alt : « ← Retour » + les 2 boutons (actif surligné).
- **`components/AltLightboxHost.tsx`** : hook `useAltLightbox()` → `{ open, node }`. `open(project)` ouvre
  `VideoLightbox` si `project.videoId`, sinon `window.open(href)`. `node` = les 2 modales à monter.
  Évite d'extraire l'état complexe du rail de `CreditsView` (qui garde ses propres lightboxes).

### i18n FR/EN (ajout 2026-06-06)
- **`i18n/index.tsx`** : `LangProvider` + `useI18n()` → `{ lang, setLang, t }`. Dictionnaire FR/EN
  plat (clés `app.*`, `credits.*`, `rail.*`, `lightbox.*`, `tile.*`, `switcher.*`, `timeline.*`,
  `trail.*`, `shortlist.note`). `t(key, params?)` interpole `{x}`, repli FR.
- **Synchro site hôte** (`ereyes/openai_creativelab_2026`) : sa langue vit dans
  `localStorage['ocl-language']` + `document.documentElement.lang`, **sans événement custom**. On
  observe donc l'attribut `lang` du `<html>` (`MutationObserver`) + l'event `storage`. `getInitialLang()`
  privilégie la préférence stockée ; **pas de `sync()` au montage** (n'écrase pas la préférence).
  Notre `setLang` réécrit `lang` + `localStorage` → cohérent dans les deux sens.
- **`components/LangToggle.tsx`** : mini-toggle FR/EN (haut-droite, `zIndex 11`) pour le mode autonome.
- **`components/BackButton.tsx`** *(ajout)* : bouton « Retour » (haut-gauche, `zIndex 11`, miroir du
  LangToggle, libellé i18n `nav.back`). Cible lue depuis `data-home-href` sur `#gallery-root` (ex.
  `./index.html`, posé par le `galerie.html` du site) ; **masqué en mode autonome** (montage `#root`,
  attribut absent). Monté dans `App.tsx` à côté de `<LangToggle />`.
- Tous les libellés visibles sont passés par `t(...)` dans `App`, `CreditsView` (dont rail : Lien→Link),
  `VideoLightbox`, `DocLightbox`, `ProjectTile`, et les 2 vues alternatives.
- **`motion.ts`** : était une version réduite (`springsScroll` + `dwellIndex`). Restauré en version
  **complète** (ajout `springs`, `eases`, `durations`, `tweens`, `orchestration`, `snapToIndex`,
  `onScrollRest`, `settleGreet`) car les vues alternatives en dépendent.

---

## 6. Interactions implémentées (historique des 2 itérations)

**Itération 1** — d'après le besoin initial :
- Vignette = colonne H au défilement.
- Survol → lecture inline (iframe Drive).
- Clic / agrandir → lecteur plein écran ; 2ᵉ vidéo via bouton bascule dans le lecteur.
- PDF → visionneuse iframe intégrée ; Prompts → nouvel onglet.
- Boutons Prompts (Rosa, Federico) et Lien (Reyes, Gillier, Klein).

**Itération 2** — correctifs après essai :
- Correctif vignette : conversion URL Drive `.../preview` → `driveThumb()` (image).
- Données : local instantané + refresh silencieux (plus de splash/attente réseau).
- Suppression du badge rond décoratif de `ProjectTile` (prop `showBadge=false`).
- Icône agrandir visible au survol uniquement.
- Tous les boutons d'action déplacés dans un **rail vertical à droite** (`ActionRail`),
  apparition animée en décalé à l'arrivée sur le projet.

### Décisions actées (Q/R commanditaire)
- Survol : iframe Drive (pas de MP4 locaux). **Pas d'autoplay** (limite Drive) — accepté.
- Clic : ouvre le lecteur plein écran (via l'icône agrandir au survol).
- PDF : iframe intégrée ; Prompts : nouvel onglet.
- 2ᵉ vidéo : bouton dans le rail (ouvre le lecteur).
- Données : copie locale + refresh arrière-plan.

---

## 7. État actuel & problèmes connus

✅ Build OK (`tsc && vite build`), galerie.js ~433 kB / galerie.css ~11.7 kB.

✅ **Vignettes** : résolu. Images **téléchargées localement** (`public/vignettes/`) et servies par
chemin local — vérifié dans le navigateur (les 9 s'affichent, captures Chrome headless). Voir §3.

✅ **Rail de boutons** : résolu. Déplacé **hors de l'incrustation**, dans une colonne **à droite**
de la vidéo (cale invisible de gauche pour garder la vidéo centrée sur desktop), animation d'entrée
**ralentie** (`delayChildren: 0.55`, `staggerChildren: 0.22`, items 0.6 s + léger flou), et **style
proposition n°5** (« étiquette de générique » : libellé monospace espacé, filets fins, tiret
marqueur au survol, index numéroté bleu). Cf. `CreditsView.tsx` → `ActionRail` / `railItemSx`.

⚠️ **Klein LÉON** : sa vignette Drive (colonne H) renvoie 404 (fichier non partagé). Le script
retombe sur le poster de sa vidéo héros — image **basse résolution** (~8 Ko). À remplacer si une
vraie vignette est fournie dans le Sheet (puis relancer `npm run vignettes`).

---

## 8. Corrections en attente (prochaine session)

- (Rien de bloquant.) Éventuellement : fournir une vraie vignette pour Klein LÉON dans le Sheet,
  vérifier le rendu mobile (xs) du rail à côté de la vidéo (largeurs responsives déjà posées).

---

## 9. Fichiers clés
| Rôle | Fichier |
|------|---------|
| Shell : bascule de vues + hôtes (switcher, toggle, lightbox alt) | `galerie/src/App.tsx` |
| Vue principale (scène, survol, rail, lecteurs) | `galerie/src/CreditsView.tsx` |
| Vue alternative — Banc de montage (NLE) | `galerie/src/views/TimelineEditorView.tsx` |
| Vue alternative — Traînée d'images | `galerie/src/views/ImageTrailView.tsx` |
| Sélecteur de vue (bas-droite) | `galerie/src/components/ViewSwitcher.tsx` |
| Lightbox partagée des vues alt (`useAltLightbox`) | `galerie/src/components/AltLightboxHost.tsx` |
| i18n FR/EN (provider, dictionnaire, `t`) + synchro hôte | `galerie/src/i18n/index.tsx` |
| Mini-toggle FR/EN (haut-droite) | `galerie/src/components/LangToggle.tsx` |
| Bouton « Retour » (haut-gauche, `data-home-href`) | `galerie/src/components/BackButton.tsx` |
| Standard de transitions (springs/tweens/helpers) | `galerie/src/motion.ts` |
| Tuile / vignette | `galerie/src/components/ProjectTile.tsx` |
| Lecteur vidéo + ressources | `galerie/src/components/VideoLightbox.tsx` |
| Visionneuse PDF | `galerie/src/components/DocLightbox.tsx` |
| Parsing CSV → Project | `galerie/src/lib/csv.ts` |
| Helpers Drive | `galerie/src/lib/drive.ts` |
| Téléchargement vignettes (script) | `galerie/scripts/fetch-vignettes.mjs` (`npm run vignettes`) |
| Manifeste vignettes locales (généré) | `galerie/src/data/vignettes.ts` |
| Images vignettes (locales) | `galerie/public/vignettes/<slug>.<ext>` |
| Copie locale (SNAPSHOT/FALLBACK) | `galerie/src/data/participants.ts` |
| Chargement (local + refresh) | `galerie/src/hooks/useParticipants.ts` |
| Types | `galerie/src/types.ts` |
| Entrée app | `galerie/src/App.tsx` |
| Proposition de style boutons | `galerie/test-boutons.html` |
| Template page hôte (à poser dans le site) | `galerie/integration/galerie.html` |
| **Build prêt à coller** (racine du dépôt) | `galerie-build/` (+ `galerie-build/README.md`) |
```
```
