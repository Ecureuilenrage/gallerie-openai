# Vague 3 — Brainstorm MIND MAPPING (carte heuristique)

> Agent : **Mind Mapping** · Seed : **6650** · Méthode : nœud central → branches majeures → sous-branches → concepts aux feuilles.
> Mots aléatoires injectés (chacun connecté + tracé) : **racine, prisme, marée basse, horloge, pollen, faille**.
> Contraintes : React + TS + MUI v6 + Framer Motion v11 PUR. Pas de WebGL/3D-lib/dépendance nouvelle. CSS 3D autorisé. Une seule `<video>` active, mais pluralité TOUJOURS visible.
> Hypothèse de travail : je consomme `projects: Project[]` (titre, author, thumbnail, w/h, href, kind, previewVideo) via une nouvelle vue dans la famille `Concepts (hors-piste)`, comme les vues existantes. Je NE reduplique PAS les 24 vues listées.

---

## 1. LA CARTE HEURISTIQUE

```
                                  ┌──────────────────────────────────────────┐
                                  │   NŒUD CENTRAL                            │
                                  │  « Galerie premium qui RÉVÈLE             │
                                  │    PLUSIEURS participants »               │
                                  └──────────────────────────────────────────┘
                                                    │
   ┌───────────────┬───────────────┬───────────────┼───────────────┬───────────────┬───────────────┐
   │               │               │               │               │               │               │
[ESPACE]        [LUMIÈRE]       [MATIÈRE]        [TEMPS]         [GESTE]       [MÉTAPHORE]      [VIVANT]*
   │               │               │               │               │               │               │
   │               │               │               │               │               │               │
 profondeur      réfraction      grain/liquide    rythme         pilotage       analogie        organique
 vs surface       /faisceau       /papier         /cycle          direct          du monde       /croissance
   │               │               │               │               │               │               │
   ├─ chambres     ├─ PRISME ★     ├─ pâte/encre    ├─ HORLOGE ★    ├─ pousser      ├─ RACINE ★     ├─ POLLEN ★
   │  empilées     │  décompose    │  qui se forme  │  cadran =     │  /tirer une   │  arbre des    │  graines qui
   │  en Z (axe    │  la lumière   │  (sédiment)    │  index temps  │  masse molle  │  filiations   │  s'agglutinent
   │  caméra)      │  en spectre   │                │               │               │               │
   │               │               │               │               │               │               │
   ├─ pièces       ├─ chaque       ├─ MARÉE         ├─ frise        ├─ lancer       ├─ FAILLE ★      ├─ essaim
   │  adjacentes   │  projet =     │  BASSE ★ qui   │  /timeline    │  /inertie     │  géologique :  │  /nuée qui
   │  (latéral)    │  une bande    │  découvre les  │  cinématique  │  /ressort     │  strates qui   │  s'oriente
   │               │  du spectre   │  projets       │               │               │  se décalent   │  vers le geste
   │               │               │               │               │               │               │
   └─ vitrine      └─ halo qui     └─ vernis qui    └─ sablier      └─ rotation     └─ couches      └─ floraison
      muséale         se diffracte    se craquelle     /compteur       d'un volume     révélées par      au survol
      (alcôves)        au survol       au passage       à rebours       au drag          un séisme
```

### Légende des branches majeures (logique de déploiement)

- **ESPACE** — la profondeur n'est pas un parallaxe : c'est un *volume habitable*. On déplace la caméra DANS la scène (axe Z) plutôt que de glisser des plans. → mène à *chambres empilées*, *vitrine muséale*.
- **LUMIÈRE** — non pas « éclairer » (déjà fait : Lighthouse, Spotlight) mais **décomposer / réfracter**. La lumière comme outil de tri. → mène à **PRISME ★**.
- **MATIÈRE** — la galerie a un état physique : liquide, sédiment, vernis. L'image n'est pas posée, elle *émerge d'une substance*. → mène à **MARÉE BASSE ★**.
- **TEMPS** — le temps comme axe de navigation explicite (pas le scroll-as-time cliché) : un **mécanisme** (horloge) qui *indexe* les participants. → mène à **HORLOGE ★**.
- **GESTE** — manipulation directe d'une *masse* (pas d'une carte) : on pétrit, on pousse, on fracture. → alimente Faille, Marée, Pollen.
- **MÉTAPHORE** — le monde réel donne une structure de navigation lisible : un **arbre** (racine), une **faille** géologique. → mène à **RACINE ★** et **FAILLE ★**.
- **VIVANT** (\*branche bonus issue du croisement Matière×Geste) — comportement organique, agrégation, orientation collective. → mène à **POLLEN ★**.

> Les ★ = feuilles retenues comme concepts. Chacune connecte au moins un mot aléatoire de la seed. Récap des connexions : **prisme** (Prisme), **marée basse** (Marée Basse), **horloge** (Horloge), **racine** (Racine/Arbre), **faille** (Faille — fusionnée), **pollen** (Pollen). Les 6 mots sont donc tous des feuilles vivantes.

---

## 2. LES CONCEPTS

### CONCEPT A — **PRISME** (branche LUMIÈRE)
> *« Une raie de lumière blanche frappe le bord de l'écran et se déploie en spectre : chaque couleur du spectre est un projet. »*

- **Mécanique cœur.** Une barre lumineuse verticale (le « rai ») entre par la gauche. Au scroll (`useScroll` → `scrollYProgress`), elle se **réfracte** : les projets, d'abord empilés en une fine ligne blanche surexposée, **s'écartent en éventail** comme un spectre (rouge → violet). Chaque tuile = `motion.div` dont `rotate` + `y` + `x` sont dérivés par `useTransform(progress)` avec un offset par index (éventail). Une couche `mix-blend-mode: screen` + `filter: hue-rotate()` par bande teinte chaque tuile d'une dominante spectrale subtile (réversible au survol → couleur réelle du thumbnail). Au survol d'une bande, elle se **redresse à l'horizontale** et reprend sa couleur native (`useSpring` sur `rotate`/`filter`).
- **Multiplicité.** Le spectre EST la pluralité : on voit d'un coup toutes les bandes côte à côte, en dégradé continu — impossible de croire à un projet unique. Le nombre de bandes = nombre de participants.
- **Vidéo.** La bande survolée (ou centrale au repos) « capte la lumière » : son `previewVideo` se monte (`playing`), le reste reste image teintée. Une seule `<video>` active = la bande éclairée.
- **Axe de navigation.** MIX : scroll pour ouvrir/fermer l'éventail (réfraction), survol pour redresser/lire une bande, clic ouvre `href`.
- **Palette.** **Sombre** (fond quasi-noir) : indispensable pour que le spectre lumineux et le `screen`/`hue-rotate` ressortent. Premium, calme, contemplatif.
- **Repli mobile / reduced-motion.** Mobile : spectre figé en éventail léger, tap déplie une bande. reduced-motion : pas de réfraction animée — bandes directement écartées et droites, teinte spectrale statique douce, lecture vidéo au tap.
- **Pourquoi PAS un cliché banni + inédit.** Pas de flèches, pas de parallaxe (le mouvement est une *transformation optique*, pas un défilement de plans), pas de grille plate (éventail radial). Inédit vs existant : Coverflow incline des cartes autour d'un centre ; ici on *déploie un continuum* avec sémantique couleur — autre métaphore, autre géométrie.
- **Risque/difficulté.** `hue-rotate` peut trahir les vraies couleurs des thumbnails (atténuer l'intensité). L'éventail doit rester lisible avec 6 ET 30 projets (clamp de l'angle total + scroll interne si trop de bandes).

---

### CONCEPT B — **MARÉE BASSE** (branche MATIÈRE × GESTE)
> *« La galerie est sous l'eau. La marée se retire au scroll et découvre les projets comme des trésors sur l'estran. »*

- **Mécanique cœur.** Un plan d'« eau » (couche `motion.div` avec `background` dégradé bleu-vert + `mask-image` à bord ondulé animé) recouvre une nappe de projets disposés à des profondeurs variées (z simulé par `scale`/`opacity`/`blur`). `useScroll` pilote le **niveau de la marée** (`useTransform` → `height`/`y` du plan d'eau, lissé par `useSpring`). À mesure que l'eau descend, les tuiles **émergent** : leur `filter: blur()` + désaturation + voile bleu s'estompent du haut vers le bas (chaque tuile lit le niveau d'eau relatif à sa position via un `useTransform` partagé). Les tuiles encore immergées ondulent légèrement (`y` sinusoïdal subtil).
- **Multiplicité.** Même à marée haute on devine plusieurs formes floues sous la surface (silhouettes) ; à marée basse, tout l'estran est couvert de projets émergés. La pluralité est l'argument visuel du concept (un littoral, pas un objet).
- **Vidéo.** La tuile la plus « émergée et centrée » (la plus proche de l'œil, hors d'eau) reçoit `playing` : sa vidéo coule comme une flaque vivante. Une seule à la fois ; en remontant le scroll (marée monte) la vidéo se démonte quand elle replonge.
- **Axe de navigation.** Scroll = marée (vertical, naturel). Survol = nettoyer une tuile (essuyer le voile humide localement via un petit `mask` radial au curseur). Clic = `href`.
- **Palette.** **Sombre→claire ÉVOLUTIVE** : bleu-nuit profond immergé qui s'éclaircit vers un sable clair lumineux à marée basse. Le changement de palette EST la récompense du scroll (premium, sensoriel).
- **Repli mobile / reduced-motion.** Mobile : marée pilotée par le scroll natif, ondulations coupées. reduced-motion : pas d'ondulation ni de transition d'eau — on présente directement les tuiles « émergées » nettes, voile statique très léger ; tap = vidéo.
- **Pourquoi PAS un cliché banni + inédit.** Le scroll ne défile pas des cartes : il change l'ÉTAT d'une matière (révélation progressive globale). Pas de parallaxe multi-couches cliché — une seule surface masquante. Inédit vs RevealOnScroll (qui anime des items un par un à l'entrée) : ici la révélation est *continue, réversible et fondée sur un niveau physique partagé*.
- **Risque/difficulté.** Coordonner le `mask-image` ondulé performant (préférer un dégradé + `clip-path`/`mask` simple animé que des SVG lourds). Lisibilité du texte sur tuiles semi-immergées.

---

### CONCEPT C — **HORLOGE** (branche TEMPS)
> *« Un cadran géant. Les participants sont les heures. Tourner l'aiguille balaie la collection comme on lit le temps. »*

- **Mécanique cœur.** Les tuiles sont disposées en **arc/cadran** (positionnées par `useTransform` sur un angle = `index / n * spread`, converties en `x`/`y` via cos/sin, plus `rotate` pour orienter chaque tuile vers le centre). Une **aiguille** (la ligne de lecture) est fixe en haut ; on fait tourner le cadran entier (un `rotate` global piloté par drag circulaire ou scroll → `useMotionValue` `angle`, `useSpring`). La tuile passant sous l'aiguille devient « l'heure courante » : elle s'avance (`scale`/`z`), se redresse, s'illumine. `onDragEnd` snappe à l'heure la plus proche (comme le snapping d'index de Coverflow, mais en polaire).
- **Multiplicité.** Le cadran montre toutes les « heures » (participants) en couronne simultanément — un panorama circulaire. On compte les projets comme on lit des graduations.
- **Vidéo.** Seule l'heure sous l'aiguille porte `playing`. En tournant, la vidéo se transfère d'heure en heure (une seule `<video>`).
- **Axe de navigation.** MIX : drag rotatif (geste premium « molette ») + scroll (fait avancer le temps) ; clic sur l'heure courante = `href`, clic sur une autre = la fait tourner sous l'aiguille.
- **Palette.** **Claire**, papier ivoire + encre (cadran d'horloger, éditorial), avec l'heure active en contraste sombre. Calme, premium, horloger.
- **Repli mobile / reduced-motion.** Mobile : demi-cadran (180°) + swipe pour avancer l'heure ; pas de rotation continue. reduced-motion : pas de rotation animée — liste verticale ordonnée avec un marqueur « courant », tap pour activer.
- **Pourquoi PAS un cliché banni + inédit.** Aucune flèche (on tourne le cadran), pas de grille, pas de parallaxe. Inédit vs Wheel/Carousel : la Wheel existante fait défiler ; ici la métaphore *temps/lecture* donne une aiguille fixe + snapping polaire + sémantique « heure courante » — navigation par rotation absolue, pas relative.
- **Risque/difficulté.** Drag circulaire = calcul d'angle (atan2 autour du centre) à coder soigneusement ; ergonomie tactile du geste rotatif. Disposition lisible si n est grand (cadran dense → réduire le spread visible + rotation continue).

---

### CONCEPT D — **RACINE** (branche MÉTAPHORE)
> *« Un système racinaire descend de la racine commune (le lab) ; chaque ramification s'ouvre sur un participant. »*

- **Mécanique cœur.** Une **arborescence organique** part d'un nœud-racine en haut. Au scroll (`useScroll`), les branches **poussent** (tracé SVG `<path>` animé via `pathLength` 0→1 dérivé de `scrollYProgress`, primitive Framer pure) et déposent à leurs extrémités des **tuiles-feuilles**. Chaque tuile arrive avec un `scale`/`opacity` séquencé (offset par profondeur dans l'arbre). Au survol d'une feuille, sa branche **s'épaissit et s'illumine** (`strokeWidth`/`filter` via `useSpring`) et la feuille grossit — révélant le lien entre participant et tronc commun.
- **Multiplicité.** L'arbre EST la collégialité : on voit la racine unique se diviser en N feuilles. La structure raconte « plusieurs participants, une origine » — pile la mission « célébrer plusieurs participants ».
- **Vidéo.** La feuille survolée (ou la plus avancée dans le viewport) reçoit `playing` ; sève qui « coule » dans sa branche. Une seule active.
- **Axe de navigation.** Scroll = croissance (descente dans l'arbre), survol = mise en lumière d'une branche, clic = `href`. Drag latéral optionnel pour recentrer sur une sous-branche.
- **Palette.** **Sombre**, fond terre/encre profonde, branches en filaments lumineux (or pâle / vert phosphorescent ténu) — racines vues « sous terre », contemplatif et premium.
- **Repli mobile / reduced-motion.** Mobile : arbre vertical simplifié (une colonne de branchements), croissance liée au scroll natif. reduced-motion : branches déjà tracées (pas d'animation de `pathLength`), feuilles statiques, tap pour vidéo.
- **Pourquoi PAS un cliché banni + inédit.** Pas de grille/carrousel/parallaxe : navigation par *structure narrative ramifiée*. Inédit total vs les 24 vues : aucune n'exploite un graphe/arbre ni le tracé `pathLength`. C'est la seule vue qui *explique visuellement la relation lab→participants*.
- **Risque/difficulté.** Layout algorithmique de l'arbre (positionnement des nœuds sans chevauchement) — non trivial ; prévoir un layout pré-calculé déterministe selon n. SVG + perf du `pathLength` sur beaucoup de branches (limiter la profondeur, regrouper).

---

### CONCEPT E — **FAILLE** (branche MÉTAPHORE × GESTE)
> *« La collection est un bloc de roche stratifié. Un séisme l'ouvre : la faille révèle les projets enfouis dans les couches. »*

- **Mécanique cœur.** Les projets sont empilés en **strates horizontales** comprimées (vue de coupe géologique, tuiles écrasées en fines bandes). Au drag vertical (ou scroll), une **faille s'ouvre** : `clip-path` polygonal animé sépare le bloc en deux moitiés qui s'écartent (`x`/`y` opposés via `useTransform` sur la position du drag), et les strates au niveau de la faille se **décompressent** (`scaleY` 0.15→1 + `opacity`) pour révéler les tuiles en pleine taille dans l'ouverture. Décalage latéral des strates (`x` par couche, type décrochement tectonique) pour l'effet de glissement de plaques.
- **Multiplicité.** On voit toutes les strates empilées dès le départ (= tous les participants en tranches), et la faille en révèle plusieurs d'un coup dans l'ouverture. Aucune ambiguïté : c'est un mille-feuille de projets.
- **Vidéo.** La strate centrée dans la faille (la plus décompressée) reçoit `playing`. En déplaçant la faille, la vidéo se transfère à la strate révélée.
- **Axe de navigation.** Drag/scroll vertical = ouvrir/déplacer la faille (geste = écarter la roche). Survol = pré-décompresser une strate. Clic = `href`.
- **Palette.** **Sombre**, gris-roche/basalte avec une *lueur chaude* (magma) émanant de la faille ouverte. Contraste dramatique mais maîtrisé ; la chaleur guide l'œil vers le contenu révélé.
- **Repli mobile / reduced-motion.** Mobile : faille pilotée par swipe vertical, décrochements réduits. reduced-motion : pas d'écartement animé — strates présentées déjà décompressées en liste de tranches cliquables ; tap = vidéo.
- **Pourquoi PAS un cliché banni + inédit.** La Stack existante empile/défile des cartes pleines ; ici les éléments sont *comprimés en strates* et la nav consiste à *ouvrir une fissure* (clip-path + décrochement) — métaphore et géométrie inédites, manipulation directe d'un volume, zéro flèche/parallaxe/grille.
- **Risque/difficulté.** `clip-path` animé + plusieurs strates : surveiller la perf (limiter les couches simultanément animées). Risque de proximité conceptuelle avec « Stack/Book » — bien marquer la compression en tranches pour différencier.

---

### CONCEPT F — **POLLEN** (branche VIVANT)
> *« Un nuage de spores en suspension. Le geste les attire, elles s'agglutinent, se posent et révèlent les projets. »*

- **Mécanique cœur.** Les tuiles flottent en miniatures dispersées (grains de pollen) animées d'une dérive douce (`useMotionValue` + boucle légère / `animate` répété, ou `y`/`x` sinusoïdaux). Le curseur (ou le geste de drag) est un **attracteur** : chaque grain calcule sa distance au curseur (`useTransform` sur des MotionValues x/y partagés) et se rapproche, grossit et se redresse (`scale`/`x`/`y` via `useSpring`, ressort doux). Au-delà d'un seuil de proximité, le grain « se pose » : il se fixe au premier plan en pleine tuile lisible. Effet de **nuée** : les grains voisins suivent partiellement (champ d'attraction dégradé → mouvement collectif organique).
- **Multiplicité.** Un essaim = pluralité immédiate et littérale : on voit des dizaines de grains-projets flotter ensemble avant même d'interagir. La densité communique « beaucoup de participants ».
- **Vidéo.** Le grain posé au plus près du curseur (celui qui s'est « fixé ») reçoit `playing` : il devient la fleur ouverte. Une seule `<video>` ; en déplaçant le curseur, elle se transfère au nouveau grain posé.
- **Axe de navigation.** Survol/déplacement curseur = attraction (desktop WOW) ; drag tactile = souffle qui pousse les grains. Clic sur grain posé = `href`.
- **Palette.** **Claire**, fond laiteux/poudré (pollen, lumière diffuse), grains aux teintes douces ; le grain posé en contraste net. Aérien, calme, premium.
- **Repli mobile / reduced-motion.** Mobile : pas d'attraction continue — grains posés en petite grille flottante, tap pour fixer+lire. reduced-motion : pas de dérive ni de champ d'attraction — disposition statique douce, focus/tap pour agrandir et lire.
- **Pourquoi PAS un cliché banni + inédit.** Pas de grille (positions organiques mouvantes), pas de carrousel, pas de parallaxe. Inédit vs MagneticField (qui fait *repousser/réagir* localement des items en place) : ici les grains *dérivent librement, s'agrègent en nuée et se posent* — comportement collectif émergent, pas un effet ponctuel. Le geste fait *converger une foule*.
- **Risque/difficulté.** Perf si beaucoup de grains animés en continu (limiter le nombre actif, pauser hors-écran, throttle de la dérive). Risque d'illisibilité « ça bouge trop » → calme = dérive très lente + ressort amorti ; éviter le chaos.

---

## 3. CLASSEMENT + HYPOTHÈSES / QUESTIONS OUVERTES

### Classement (du plus fort au plus risqué)

1. **MARÉE BASSE (B)** — ★ TOP. Le changement d'état de matière + bascule de palette sombre→claire au scroll = WOW premium, calme, totalement inédit, et la révélation continue colle au pattern « révélation interactive » adoré. Risque maîtrisable.
2. **RACINE (D)** — ★ TOP. Seul concept qui *raconte la collégialité* (racine commune → N participants) : pile dans la mission « célébrer plusieurs participants ». Le `pathLength` est une primitive Framer pure inexploitée. Très distinctif. (Risque layout = le seul vrai point dur.)
3. **PRISME (A)** — Spectacle optique fort, sémantique couleur élégante, MIX de gestes riche. Léger risque de fidélité des couleurs.
4. **HORLOGE (C)** — Métaphore lisible, snapping polaire premium ; proche conceptuellement de Wheel (à bien différencier par l'aiguille fixe + sémantique temps).
5. **FAILLE (E)** — Très dramatique et tactile ; risque de proximité avec Stack/Book et coût perf du clip-path multi-couches.
6. **POLLEN (F)** — Le plus organique et joueur ; risque « ça bouge trop » + perf, à dompter pour rester CALME.

### Hypothèses posées (non bloquantes)

- J'assume que chaque concept devient **une vue** `({ projects })` dans `Concepts (hors-piste)`, ajoutée à son `registry.*.ts`, sans toucher `ProjectTile` (j'utilise `playing`/`previewOnHover`/`onActivate`/`overlayTitle`).
- J'assume que `Project` ne change pas : pas de champ « famille/catégorie/relation parent » disponible → **Racine** et **Horloge** dériveraient leur structure de l'ordre/index, pas de vraies métadonnées (arbre purement esthétique pour l'instant).
- J'assume « pluralité visible » = au moins ~6 items perceptibles d'emblée sans interaction ; chaque concept y répond par construction.
- J'assume desktop WOW prioritaire (survol/curseur central pour Prisme/Pollen/Lighthouse-like), mobile = repli tap/scroll natif acceptable.

### Questions ouvertes

- **Y a-t-il des métadonnées de regroupement** (cohorte, thème, université vs externe) ? Si oui, **Racine** et **Faille** (strates) gagneraient un sens réel (branches = cohortes, strates = années) — fort potentiel.
- Combien de projets au total attendus (6 ? 30 ? 100 ?) ? Détermine Horloge (densité du cadran), Pollen (nombre de grains), Prisme (largeur de l'éventail).
- Le **changement de palette par vue** (sombre↔claire) doit-il être animé à l'entrée de la vue dans la GalleryShell, ou la vue gère son propre fond ? (J'assume : la vue pose son propre fond local.)
- Tolérance perf cible (desktop seulement pour le WOW, ou laptops modestes ?) → arbitre Pollen/Faille.
```
