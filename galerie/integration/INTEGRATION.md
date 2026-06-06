# Brancher la galerie dans le site `ereyes/openai_creativelab_2026`

Le site est un **site HTML statique** (Material Web + i18n FR/EN, header/footer
partagés). Sa page `galerie.html` est aujourd'hui un **placeholder réservé à la
galerie de Léon**. On y monte la galerie React (build Vite) comme un composant,
en gardant l'en-tête, le pied de page et la navigation du site.

## Le plus simple : copier `galerie-build/`

Un **build prêt à coller** est versionné à la racine de ce dépôt :
[`../../galerie-build/`](../../galerie-build/). Il contient déjà `galerie.html`,
`galerie-app/` (code) et `vignettes/` (images). Il suffit de copier **son
contenu** à la racine du repo du site (en écrasant `galerie.html`) — aucun build
côté site. Voir [`galerie-build/README.md`](../../galerie-build/README.md).

Le reste de ce document décrit comment **régénérer** ce build et ce qu'il contient.

## Étapes (régénération)

1. **Builder la galerie** (dans ce dépôt-ci) :
   ```bash
   cd galerie
   npm install
   npm run build      # produit galerie/dist/
   ```
   `dist/` contient : `galerie.js`, `galerie.css`, `fonts/`, `vignettes/` (et un
   `index.html` de démo dont on n'a **pas** besoin pour l'intégration).

2. **Copier le build dans le repo du site** : un dossier `galerie-app/` (code) à
   la racine, **plus** un dossier `vignettes/` (images) à la racine également :
   ```
   openai_creativelab_2026/
     galerie.html          ← remplacé (voir étape 3)
     galerie-app/          ← nouveau (code)
       galerie.js
       galerie.css
       fonts/
     vignettes/            ← nouveau (images des participants)
     assets/ …  index.html …
   ```
   Copier `galerie/dist/galerie.js`, `galerie/dist/galerie.css`,
   `galerie/dist/fonts/` dans `galerie-app/`, et `galerie/dist/vignettes/` dans
   `vignettes/`. (Inutile de copier `dist/index.html`.)

   > **Pourquoi `vignettes/` à la racine et pas dans `galerie-app/` ?** Les
   > vignettes sont référencées en relatif `./vignettes/…` (résolu par rapport à
   > `galerie.html`). Elles doivent donc être au même niveau que `galerie.html`.

3. **Remplacer `galerie.html`** du site par le fichier
   [`galerie.html`](./galerie.html) fourni ici. Il est identique à l'original
   (même en-tête / pied / nav / i18n) ; seule la section centrale `<main>` change :
   le placeholder est remplacé par
   `<div id="gallery-root" data-home-href="./index.html"></div>` et les deux
   lignes qui chargent `./galerie-app/galerie.css` et `./galerie-app/galerie.js`.
   L'attribut `data-home-href` alimente le **bouton « Retour »** (haut-gauche) de
   la galerie vers l'accueil du site.

4. **Vérifier en local** (le `fetch` du CSV et les iframes Drive ont besoin d'un
   serveur HTTP, pas d'un `file://`) :
   ```bash
   # depuis la racine du repo du site
   python -m http.server 8000
   # puis ouvrir http://localhost:8000/galerie.html
   ```

## Points d'attention

- **Chemins relatifs.** Le build utilise `base: './'` → fonctionne aussi sous un
  sous-chemin (GitHub Pages de projet, ex. `…github.io/openai_creativelab_2026/`).
  Si tu déposes `galerie-app/` ailleurs, ajuste les deux `href`/`src` dans
  `galerie.html` en conséquence.
- **Vignettes.** Les images locales des participants sont servies en relatif
  (`./vignettes/…`, via `import.meta.env.BASE_URL`). Garde le dossier `vignettes/`
  à la racine, **à côté de `galerie.html`**. Si elles manquent, la galerie retombe
  silencieusement sur les posters Google Drive (qualité moindre).
- **Bouton « Retour ».** Le `<div id="gallery-root">` porte
  `data-home-href="./index.html"` : la galerie affiche un bouton retour (haut-
  gauche) vers cette cible. En mode autonome (montage sur `#root`, sans cet
  attribut), le bouton est masqué.
- **Données = CSV en direct.** La galerie lit le Google Sheet publié à chaque
  chargement (voir `galerie/src/lib/csv.ts`, `CSV_URL`). Éditer la feuille met à
  jour la galerie sans rebuild. Pour pointer un autre CSV sans toucher au code :
  builder avec `VITE_CSV_URL=… npm run build`.
- **Partage Drive.** Les fichiers vidéo Google Drive doivent être partagés
  « **Tout utilisateur disposant du lien** », sinon vignettes et lecteur restent
  vides pour les visiteurs.
- **Mise à jour du build.** Après toute modif de la galerie : refaire `npm run
  build` et recopier `galerie-app/`. Les noms `galerie.js` / `galerie.css` sont
  **stables** (pas de hash), donc `galerie.html` n'a jamais besoin d'être retouché.
- **i18n.** Le site est bilingue (FR/EN) ; la galerie est en français. Les
  libellés de la galerie (Document, Prompts, « défilez »…) ne suivent pas le
  sélecteur FR/EN pour l'instant — à internationaliser plus tard si besoin.
