# Galerie — Sora API Creative Lab × Paris 8

Ce dépôt contient **une moitié** d'un projet réalisé **à deux mains** avec
**Everardo Reyes** : la vitrine du *Sora API Creative Lab* mené avec les
étudiant·es en Humanités numériques de Paris 8.

Le projet complet se compose de deux parties complémentaires :

| Partie | Dépôt | Rôle |
|--------|-------|------|
| **Le site vitrine (statique)** — *Everardo Reyes* | [`ereyes/openai_creativelab_2026`](https://github.com/ereyes/openai_creativelab_2026) · [site en ligne](https://ereyes.github.io/openai_creativelab_2026/) | Coquille du site : accueil, à propos, crédits, navigation, bilingue FR/EN, design system. |
| **La galerie des participants (cette partie)** | ce dépôt | Application React/Vite : trois vues d'exploration des projets, lecteur vidéo Drive, bilingue. |

## Comment les deux parties s'assemblent

Le site d'Everardo Reyes prévoit une page `galerie.html` **réservée** à la galerie.
La galerie de ce dépôt y est **embarquée** comme un composant : elle se monte dans
`<div id="gallery-root">`, en conservant l'en-tête, le pied de page et la navigation
du site hôte.

Comme le site hôte est **statique** (sans outil de build), on lui livre un **build
compilé prêt à copier-coller**, versionné ici dans **[`galerie-build/`](./galerie-build/)** :
il suffit de copier son contenu à la racine du repo du site. Le détail du geste est
dans [`galerie-build/README.md`](./galerie-build/README.md) et le guide complet dans
[`galerie/integration/INTEGRATION.md`](./galerie/integration/INTEGRATION.md).

## Contenu de ce dépôt

- **[`galerie/`](./galerie/)** — le code source de la galerie (React 18 + Vite + TypeScript).
  Voir son [README](./galerie/README.md) et son [contexte](./galerie/contexte.md).
- **[`galerie-build/`](./galerie-build/)** — le build compilé prêt à intégrer dans le site d'Everardo Reyes.
- `poc-generique/`, `galeries-alternatives/`, `brainstorm/` — POC initial, prototypes des vues et notes de conception.

## Démarrer (développement)

```bash
cd galerie
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production → dist/ (puis copié dans ../galerie-build/)
```

---

Réalisé à deux mains avec **Everardo Reyes** — *Sora API Creative Lab × Paris 8*.
