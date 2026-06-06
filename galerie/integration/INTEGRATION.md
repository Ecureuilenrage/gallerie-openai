# Brancher la galerie dans le site `ereyes/openai_creativelab_2026`

Le site est un **site HTML statique** (Material Web + i18n FR/EN, header/footer
partagés). Sa page `galerie.html` est aujourd'hui un **placeholder réservé à la
galerie de Léon**. On y monte la galerie React (build Vite) comme un composant,
en gardant l'en-tête, le pied de page et la navigation du site.

## Étapes

1. **Builder la galerie** (dans ce dépôt-ci) :
   ```bash
   cd galerie
   npm install
   npm run build      # produit galerie/dist/
   ```
   `dist/` contient : `galerie.js`, `galerie.css`, `fonts/` (et un `index.html`
   de démo dont on n'a **pas** besoin pour l'intégration).

2. **Copier le build dans le repo du site**, dans un dossier `galerie-app/` à la
   racine (à côté de `galerie.html`, `assets/`, `index.html`) :
   ```
   openai_creativelab_2026/
     galerie.html          ← remplacé (voir étape 3)
     galerie-app/          ← nouveau
       galerie.js
       galerie.css
       fonts/
     assets/ …  index.html …
   ```
   Copier `galerie/dist/galerie.js`, `galerie/dist/galerie.css` et
   `galerie/dist/fonts/` dans `galerie-app/`. (Inutile de copier `dist/index.html`.)

3. **Remplacer `galerie.html`** du site par le fichier
   [`galerie.html`](./galerie.html) fourni ici. Il est identique à l'original
   (même en-tête / pied / nav / i18n) ; seule la section centrale `<main>` change :
   le placeholder est remplacé par `<div id="gallery-root"></div>` et les deux
   lignes qui chargent `./galerie-app/galerie.css` et `./galerie-app/galerie.js`.

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
