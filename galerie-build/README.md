# `galerie-build/` — build prêt à coller dans le site statique

Ce dossier est le **build compilé** de la galerie (`../galerie/`), prêt à être
déposé tel quel dans le site statique
[`ereyes/openai_creativelab_2026`](https://github.com/ereyes/openai_creativelab_2026)
(servi sous `https://ereyes.github.io/openai_creativelab_2026/`).

> Ne pas éditer à la main : ce dossier est **régénéré** depuis `../galerie/`.
> Voir « Regénérer » plus bas.

## Quoi copier

Copier **le contenu** de `galerie-build/` à la **racine** du repo
`openai_creativelab_2026` (à côté de `index.html`, `about.html`, `assets/`…),
en **écrasant** le `galerie.html` existant :

```
openai_creativelab_2026/
  galerie.html          ← REMPLACÉ par celui-ci
  galerie-app/          ← AJOUTÉ (galerie.js, galerie.css, fonts/)
  vignettes/            ← AJOUTÉ (images des participants)
  index.html  about.html  credits.html  assets/  …   ← inchangés
```

En PowerShell, depuis ce dossier :

```powershell
$dest = "C:\chemin\vers\openai_creativelab_2026"
Copy-Item -Recurse -Force .\galerie-app  $dest
Copy-Item -Recurse -Force .\vignettes    $dest
Copy-Item -Force          .\galerie.html $dest
```

C'est tout — aucun build n'est nécessaire côté site.

## Pourquoi ça marche partout (y compris en sous-chemin)

- **Chemins relatifs.** Le build utilise `base: './'` et les vignettes sont
  référencées en relatif (`./vignettes/…` via `import.meta.env.BASE_URL`). Tout
  fonctionne donc même sous le sous-chemin `…github.io/openai_creativelab_2026/`.
- **Noms stables.** `galerie-app/galerie.js` et `galerie-app/galerie.css` n'ont
  pas de hash : `galerie.html` ne change jamais d'un build à l'autre.
- **Bouton « Retour ».** `galerie.html` porte `data-home-href="./index.html"` sur
  `#gallery-root` : la galerie affiche un bouton retour (haut-gauche) vers l'accueil.
- **Données en direct.** La galerie lit le Google Sheet publié (CSV) à chaque
  chargement : éditer la feuille met à jour la galerie sans rebuild.

## Regénérer ce dossier

Après toute modification de la galerie :

```bash
cd ../galerie
npm install        # première fois seulement
npm run build      # produit galerie/dist/
```

puis recopier `dist/galerie.js`, `dist/galerie.css`, `dist/fonts/` dans
`galerie-app/`, et `dist/vignettes/` dans `vignettes/` (le `galerie.html` vient de
`../galerie/integration/galerie.html`).

Détails complets : [`../galerie/integration/INTEGRATION.md`](../galerie/integration/INTEGRATION.md).
