# BACKLOG — galerie premium (consolidation vague 4 / recherche)

> Hub actionnable issu des 3 recherches documentées de la vague 4 :
> - [`01-quatre-directions.md`](./01-quatre-directions.md) — refonte premium des 4 prometteurs (Couloir, Faille, Roue, Livre).
> - [`02-mecaniques-volume.md`](./02-mecaniques-volume.md) — 38 mécaniques réelles sourcées (vivier de prototypes).
> - [`03-art-transition.md`](./03-art-transition.md) — standard de transition « smooth + temps d'arrêt ».
>
> **Décision utilisateur (vague 4)** : on NE retravaille PAS encore les 4 prometteurs ni le polish global → tout est **noté ici** en backlog. Volume cible du catalogue : **autant que possible, on triera**. Contraintes inchangées : React+TS, **MUI v6 + Framer Motion v11 PUR**, pas de WebGL/Three/Swiper/Embla/Lenis/GSAP/Tailwind/lucide, 1 seule `<video>` active, multiplicité perçue d'emblée, desktop wow / mobile correct, palette par vue, Inter, sans branding.

Légende priorité : **P0** socle transverse · **P1** fort impact + faisable + distinct · **P2** bon, à border · **P3** risqué / doublon à trancher.
Faisabilité = note /5 des recherches (Framer pur).

---

## P0 — Socle : `src/motion.ts` (standard de transition partagé)

**Problème constaté** (doc 03) : aucun token de motion partagé ; chaque vue redéclare son `const SPRING` (Corridor 90/24/0.6, Wheel 70/20/0.5, Rift 80/24/0.6, Book 90/22/0.6) ; **aucun `restDelta`, aucun snap, aucun dwell** → le focal change en continu sans jamais « se poser » = exactement le « pas au point » signalé.

**À créer** : `src/motion.ts` exportant des presets nommés, puis migrer les vues dessus. Valeurs chiffrées (ζ = damping/(2·√(stiffness·mass)), cible ζ≈0.85–1.0 = se pose sans rebond) :

| Preset | Valeurs | Usage |
|---|---|---|
| `springs.settle` | stiffness 120, damping 24, mass 1, restDelta 0.001 | défaut universel (geste/scroll posé) |
| `springs.gentle` | 90 / 26 / 1.1, restDelta 0.001 | grandes scènes, héros, palettes |
| `springs.snappy` | 220 / 26 / 1, restDelta 0.001 | hover, petits éléments |
| `springs.drag` | 300 / 32 / 1, restDelta 0.001 | objet manipulé (bras, tiroir) |
| `springs.scroll` | 100 / 30 / 1, restDelta 0.001, skipInitialAnimation | lissage de `scrollYProgress` |
| `eases.expoOut` | `[0.16,1,0.3,1]` | entrée premium (longue traîne douce) |
| `eases.decelerate` / `accelerate` | `[0,0,0.2,1]` / `[0.4,0,1,1]` | entrée / sortie |
| `eases.emphasizedDecelerate` | `[0.05,0.7,0.1,1]` | révélations (clip-path, masque) |
| `durations` | micro .16 / short .24 / medium .34 / long .5 / hero .7 | par type |
| helpers | `snapToIndex(mv,n)`, `onScrollRest(fn,140)`, `dwellIndex({...})`, `settleGreet` | snap + dwell + micro-accueil |

> Code complet prêt à coller : doc 03 §7. **C'est le prérequis du polish global** demandé sur toutes les vues.

### Les 5 règles d'or (doc 03 §9)
1. Ease-out pour l'entrée, ease-in court pour la sortie (sortie ≈ 70 % de l'entrée).
2. Un ressort premium se pose (ζ≈0.85–1.0), il ne rebondit pas : mass vers ~1, **toujours `restDelta:0.001`**.
3. Temps d'arrêt explicites = **snap** (au repos du scroll) + **dwell/hystérésis** (anti-clignotement du focal).
4. N'animer que `transform`/`opacity` (et `clip-path`/`scaleY` au lieu de `width`/`height`) ; flouter une seule couche de fond.
5. Orchestration calme (stagger 70–90 ms) ; `AnimatePresence mode="wait"` focal unique / `"popLayout"`+`layout` grilles ; jamais de scroll-jacking ; `useReducedMotion` = repli plat.

---

## P1 — Refonte premium des 4 prometteurs (doc 01)

> À NE PAS faire maintenant (décision utilisateur) — checklist prête pour quand on s'y met. Tous dépendent de P0.

### Couloir (CorridorView)
- [ ] `travel = useSpring(raw, springs.scroll)` (plus lourd que 90/24/0.6 → moins de mal de mer).
- [ ] **Peupler le point de fuite** : garder ≥4-5 panneaux dans le cône (traîne d'opacité longue `[-7Z,-5Z,0,FOCAL,1.6FOCAL]→[0,.35,1,1,0]`).
- [ ] **Plateau de redressement** rotateY=0 sur ±0.25·Z_STEP (dwell) + `settleGreet` à la pose.
- [ ] Snap salle-par-salle au `scrollend` (`snapToIndex`) ; sol en lignes de fuite défilantes ; brume de profondeur en couches.
- [ ] Safari : déporter le `filter` hors du nœud `preserve-3d`.

### Faille (RiftView)
- [ ] **Remplacer l'ouverture `height` par `clip-path: inset()`** (composité, gros gain smooth) — easing `cubic-bezier(0.77,0,0.175,1)`.
- [ ] Lèvres en 2 calques antagonistes (inset haut/bas) ; parallaxe interne du focal `+8%→0%`.
- [ ] **Élargir le plateau** `scaleY/opacity=1` sur center±pad (~30 % fenêtre) = temps de lecture ; snap par strate/`group`.
- [ ] Variante : 2-3 vignettes par strate (« carotte géologique » = plusieurs participants par couche).

### Grande Roue (WheelView)
- [ ] **Dériver le RADIUS** de la taille de carte : `radius=(h/2)/tan(θ/2)`, `θ=360/n`.
- [ ] **Drag `y` + scroll** ; **snap angulaire** sur multiple de θ au dragEnd (injecter `info.velocity`).
- [ ] Rotation `springs.scroll` (plus inertielle) ; **cran/détente** : sur-scale 1→1.04→1 (180 ms) à l'arrivée face caméra ; plateau « active nette » sur ±6°.
- [ ] Mobile : garder la roue en **drag tactile** (mécanique la plus à l'aise sur tél.).

### Grand Livre (BookView)
- [ ] **Voile d'ombrage dynamique** suivant `rotateY` (opacité 0→.45→0, max au profil 90°) — LE détail premium manquant.
- [ ] Ombre portée mouvante sur la page d'en-dessous ; reliure `box-shadow: 0 1px 4px rgba(0,0,0,.27), inset 0 0 40px rgba(0,0,0,.06)`.
- [ ] **Snap à la page entière** au `scrollend` ; hystérésis z-index à **-88°** (anti-flicker Safari) ; léger overshoot `springs` = « tac » de page.
- [ ] Safari : pas d'`overflow:hidden` sur le nœud `preserve-3d` du livre.

---

## P1 — Vivier de prototypes : à construire (nouveaux, distincts, faisables)

> Cible « autant que possible ». ⭐ = top recherche. Tous filtrés MUI+Framer pur.

| Réf | Nom | Axe | Faisab. | Multiplicité / signature |
|---|---|---|---|---|
| G1 ⭐ | **Morph grille → fiche** (`layoutId`/FLIP) | clic | 5/5 | part toujours de la grille complète ; point fort natif de Framer |
| E2 ⭐ | **Planche-contact argentique** (cadres + perfos + n°, loupe au survol) | survol+scroll | 5/5 | 20-40 vignettes d'un coup = multiplicité max, identité photo-lab |
| D2 ⭐ | **Grille élastique** (colonnes à inertie différenciée) | scroll | 4/5 | déformation sur toute la largeur, ressenti matière |
| B3 ⭐ | **Grid-tilt 3D collectif** (panneau incliné vers le curseur, parallaxe Z) | survol | 5/5 | panneau peuplé qui bouge ensemble |
| D1 ⭐ | **Assemblage épinglé** (tuiles éparpillées → grille au scroll, sticky) | scroll | 4/5 | la formation raconte « il y en a beaucoup » |
| A1 ⭐ | **Plan infini draggable** (pan 2D libre, zoom optionnel) | drag | 4/5 | grande archive explorable |
| C1 ⭐ | **Accordéon-stores** (lames plein-hauteur, l'active s'élargit) | survol/tap | 5/5 | N lames côte à côte = N participants comptables |
| B1 ⭐ | **Traînée d'images** (trail de vignettes sous le curseur) | souris | 4/5 | des dizaines de vignettes défilent en secondes |
| F1 ⭐ | **Profondeur de champ** (net/flou optique, plan focal au geste) | souris/scroll | 4/5 | plusieurs plans Z peuplés |
| E1 ⭐ | **Pinboard collage** (mur d'atelier draggable, rotations) | drag | 4/5 | chaos organisé habité |
| C4 | **Flip-cards damier** (retournement en vague rotateY) | scroll/survol | 5/5 | la vague traverse beaucoup de tuiles |
| D5 | **Wipe plein écran** (un projet à la fois, transition clip-path par bandes) | scroll-snap | 5/5 | compteur « 03/24 » + miniatures latérales |
| A3 | **Zoom dirigé** (table lumineuse, clic = zoom vers la cible) | clic | 4/5 | vue d'ensemble dézoomée + focus |
| A2 | **Mini-map + loupe géante** (overlay aperçu + carte de repérage) | survol | 4/5 | carte montre tout pendant l'inspection |
| C2 | **Pliage origami** (tuile qui se déplie en 3D) | clic | 3/5 | grille fermée lisible, dépliage isole |
| C3 | **Bloc-volume 3D** (tuiles à épaisseur, faces = thumbnail/détail/vidéo) | clic/drag | 3/5 | grille de cubes = matière dense |
| E3 | **Marquee croisé** (rangées à contre-sens, survol = fige) | auto+survol | 5/5 | flux continu = catalogue sans fin |
| E5 | **Tas étalable** (tuiles en tas → éventail/grille au geste) | clic/drag | 4/5 | masse tangible → révèle le nombre |
| D4 | **Kinetic type → image** (mots-portails qui révèlent au scroll) | scroll | 3/5 | chaque mot = un projet, index typographique |
| F3 | **Verre dépoli** (panneaux frosted, le survol « essuie ») | survol | 3/5 | mur de panneaux dépolis, mystère premium |
| B4 | **Peel de coin** (coin qui se soulève comme un autocollant) | survol | 4/5 | micro-interaction matière par tuile |
| G2 | **Expansion clip-path** (carte → large via forme géométrique) | clic | 4/5 | grille préservée autour |
| H1 | **Dérive ambiante** (tuiles flottent lentement au repos, le geste fige) | auto+geste | 4/5 | tout vivant = « ruche » contemplative |

### P3 — à trancher en revue (doublons potentiels / risque)
- **G3 Rideau** (transition `mask`/SVG entre vues) — plutôt une **couche de transition réutilisable** qu'une vue (complète D5/G1).
- **A4 Orbital** vs Wheel/Constellation · **B2 Tampon** vs Chambre noire/Lighthouse · **F2 Brume** vs Marée basse · **D3 Stacking-scroll** vs Stack · **E4 Index→reveal** vs EditorialList → ne retenir que si métaphore nettement distincte.
- **H2 Essaim/boids** — faisabilité 2/5 (coût par frame) → prototyper avec prudence, version « orientation » légère seulement.

---

## Garde-fous techniques transverses (récurrents dans les 3 docs)
- **Safari + `preserve-3d`** : jamais `filter`/`opacity`/`overflow`/`clip-path`/`mask` sur un nœud 3D dont les enfants doivent rester en 3D → déporter sur les feuilles internes.
- **Perf** : n'animer que `transform`/`opacity` ; `clip-path`/`scaleY` plutôt que `height`/`width` ; flou sur **une seule** couche de fond, rayon plafonné ; `will-change` ciblé et retiré hors anim.
- **`backface-visibility:hidden`** sur cartes/pages 3D ; hystérésis z-index aux passages à 90°.
- **1 seule `<video>` active** (contrat `ProjectTile playing`), **`useReducedMotion`** = repli plat complet partout.

---

## Ordre de bataille proposé (pour mémoire)
1. **P0** — créer `src/motion.ts` (socle) — débloque tout le polish.
2. **Vague de prototypes** — construire en parallèle les ⭐ P1 nouveaux (un lot par agent), en s'appuyant d'emblée sur `src/motion.ts` (donc « smooth + temps d'arrêt » intégré dès la naissance).
3. **Refonte des 4 prometteurs** (checklists P1 ci-dessus) une fois le socle en place.
4. Revue visuelle utilisateur → tri → finition des retenus → vrais médias/liens.
