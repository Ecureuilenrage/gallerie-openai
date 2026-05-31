# Vague 3 — Brainstorm SCAMPER (agent 01)

> Méthode : **SCAMPER** · Seed : **4173** · Mots aléatoires injectés : **lanterne, aimant, origami, marée, vinyle, ruche**
> Mission : inventer de l'INÉDIT — ressenti CALME / PREMIUM, audacieux mais maîtrisé.
> Stack pur React+TS+MUI v6+Framer Motion v11. Pas de WebGL/Swiper/GSAP/Tailwind. Outils : `useScroll`, `useTransform`, `useSpring`, `useMotionValue`, `drag`, `AnimatePresence`, `layout`/`layoutId`, CSS 3D, `clip-path`, `mask-image`, `mix-blend-mode`, filtres CSS.
> Ancrage repris du code : `ProjectTile` accepte `playing` (UNE seule `<video>` montée), `as="div"` + `useDragGuard` pour les vues gestuelles, `useReducedMotion()` et `(hover:none)` pour les replis. Données : `Project{ title, author, thumbnail, width, height, kind, previewVideo }`.

---

## Travail SCAMPER (les 7 lettres, montrées une à une)

### S — Substituer
- **Substituer le conteneur rectangulaire par un masque de forme.** Au lieu de cartes/rectangles, chaque projet vit dans une **fenêtre `clip-path`** (cercle, hexagone, fente verticale). Substitue la « bordure » par une **découpe**. → nourrit *Cimaise/Hublots* et *Ruche*.
- **Substituer le défilement vertical par une coordonnée temporelle/spatiale unique** : un seul `MotionValue` « tête de lecture » pilote TOUTE la scène (rotation, focus, vidéo active). Substitue « scroll = position dans une liste » par « scroll = position d'une tête de lecture sur un support continu ». → *VINYLE*.
- **Substituer le curseur par un objet physique** : le pointeur n'est plus une flèche mais une **lanterne** (cône de lumière) ou un **aimant** (champ de force). *Attention : Lighthouse existe déjà (faisceau + brume sombre)* → je dois TRANSCENDER : ma lanterne n'éclaire pas, elle **développe une image latente** (révélation chimique, pas illumination). → *Chambre noire*.

### C — Combiner
- **Combiner « pile au scroll » + « cartel de musée ».** Les cartes s'empilent (pattern adoré) mais chaque carte qui passe **dépose son cartel** (titre/auteur) sur une cimaise latérale qui s'allonge → on accumule visuellement la liste des participants pendant qu'on feuillette. La multiplicité reste lisible même quand une seule carte est grande.
- **Combiner coverflow 3D + marée.** Le déplacement n'est pas un drag sec mais une **houle** : `useSpring` très mou + une oscillation résiduelle (`useTransform` sin) qui fait respirer toute la rangée comme l'eau. → *MARÉE*.
- **Combiner origami + layoutId.** Une mosaïque de triangles repliés (`rotateX/Y` + `preserve-3d`) se **déplie** au survol pour révéler un projet plein cadre, puis se replie. → *ORIGAMI*.
- **Combiner ruche + magnétisme** : cellules hexagonales attirées vers le pointeur. *MagneticField existe* → je le transcende en donnant une **structure** (nid d'abeilles rigide) au lieu de particules libres. → *RUCHE*.

### A — Adapter
- **Adapter le tourne-disque / sillon de vinyle.** Une galette tourne ; les projets sont des sillons concentriques ; le « bras de lecture » survole un sillon → ce projet joue sa vidéo (UNE seule). Adapter la métaphore audio à une galerie visuelle. → *VINYLE*.
- **Adapter la chambre noire photo (bain révélateur).** Les thumbnails apparaissent **en négatif/sous-exposés** ; là où passe la « lanterne » du curseur, l'image se **développe** progressivement (filtre `invert`/`contrast`/`sepia` interpolé). Adapter un processus argentique. → *Chambre noire*.
- **Adapter la table lumineuse de l'éditeur photo** (light table / loupe) : planche-contact de tous les projets, une **loupe** magnétique agrandit + lit la vidéo sous elle. Adapter l'outil de tri éditorial.

### M — Modifier / Magnifier
- **Magnifier la profondeur Z.** Au lieu d'un coverflow plat-ish, créer un **couloir/tunnel** où les projets sont des panneaux jalonnant un corridor 3D ; le scroll = avancée dans le couloir (`translateZ` géant via `perspective`). On VOIT le fond peuplé de projets à venir → multiplicité immédiate. → *Galerie-couloir*.
- **Magnifier une seule pièce maîtresse** : une vidéo plein cadre, mais **encadrée** par une frise/ruban des autres participants qui défile lentement (vinyle/marée) — jamais « une seule vidéo perçue ».
- **Modifier l'échelle du cartel** : typographie Inter géante (numéro de salle, nom d'auteur en très gros) façon signalétique de musée, magnifiée au point de devenir le décor.

### P — Proposer un autre usage (Put to other use)
- **Le `mask-image` détourné en outil de développement photo** (pas en « trou de lumière » comme Lighthouse) : le masque module un **filtre**, pas l'opacité. Autre usage du même primitif.
- **Le `drag` détourné en bras de tourne-disque / en aimant** qu'on promène, pas en swipe de cartes (SwipeDeck existe). On manipule un OUTIL, pas les cartes.
- **`layoutId` détourné** : non pas pour une transition d'ouverture, mais pour faire **migrer un cartel** d'une carte vers une colonne-index persistante (combiné C).
- **La grille hexagonale (ruche) sert d'horloge/boussole** : la position angulaire encode l'ordre de soumission des projets.

### E — Éliminer
- **Éliminer les vignettes au repos** : ne montrer QUE les cartels (texte) ; le visuel n'apparaît qu'à la révélation (lanterne/loupe/développement). Galerie qui commence en **silence visuel**, très premium/calme. → renforce *Chambre noire*.
- **Éliminer les flèches, les points, toute chrome de carrousel** (banni de toute façon).
- **Éliminer le fond** : projets flottant dans le noir profond (cinéma) ou le blanc total (cimaise), aucune boîte.
- **Éliminer le défilement infini plat** : remplacer par une surface FINIE (galette, nid, couloir) qu'on parcourt → sensation d'objet, pas de flux.

### R — Réorganiser / Inverser
- **Inverser figure/fond** : au lieu d'images sur fond neutre, **fond = mur de projets**, et le focus est un **vide net** qu'on déplace (négatif de Spotlight).
- **Réorganiser en géométrie radiale/concentrique** plutôt qu'en grille cartésienne (vinyle, ruche, horloge).
- **Inverser le sens de la pile** : au lieu d'empiler vers nous, les cartes **s'enfoncent** dans la profondeur (couloir) et on les rattrape.
- **Inverser cause/effet du survol** : ce n'est pas la carte survolée qui grandit, c'est **tout le reste qui s'efface/s'éloigne** (révélation par soustraction).

---

## CONCEPTS

### Concept 1 — **Chambre noire** (« Les projets se développent sous la lumière »)
*Accroche : une planche-contact en négatif ; le curseur est une lanterne de labo qui révèle, projet par projet, l'image latente.*

- **Mécanique cœur** : grille/planche de tuiles affichées **en négatif sous-exposé** au repos (`filter: invert(1) brightness(.6) contrast(.8)`). Le pointeur pilote deux `useMotionValue` x/y lissés par `useSpring`. Un calque-révélateur en `position:absolute inset:0` porte un `mask-image: radial-gradient(circle at X Y, …)` piloté par `useTransform([x,y])` — MAIS, contrairement à Lighthouse, le masque ne perce pas un trou de lumière : il **borne la zone où le filtre négatif est retiré**. Chaque tuile calcule sa distance au curseur (`useTransform`) et interpole son propre filtre de `invert(1)…` → `invert(0) saturate(1)` : l'image « se développe » comme dans un bain. La tuile la plus proche (sous le seuil) reçoit `playing` → sa `<video>` se lit (UNE seule).
- **Multiplicité** : la planche-contact MONTRE d'emblée une dizaine de cadres en négatif, alignés façon film photo → on perçoit « beaucoup de projets » avant même de bouger. Les bords de chaque cadre + numéros (Inter mono) lus comme une pellicule.
- **Vidéo** : seule la tuile « la plus développée » (curseur dessus) monte sa vidéo via `playing`. Au tap mobile : toggle d'un `revealedIndex`.
- **Axe de navigation** : **survol/curseur** (desktop) ; tap (mobile).
- **Palette** : **sombre** (labo photo, lumière inactinique rouge ambrée discrète) → calme + premium + cinéma.
- **Repli mobile / reduced-motion** : `(hover:none)` ou `useReducedMotion()` → toutes les tuiles affichées **développées et nettes** (pas de négatif), révélation/vidéo au tap. Aucun mouvement de masque.
- **Pourquoi pas un cliché / inédit** : ce n'est PAS Lighthouse (qui éclaire/floute en cône). Ici le primitif `mask-image` pilote un **processus chimique de filtre** (négatif→positif), métaphore argentique jamais faite ; pas de parallaxe ni d'autoplay massif. Inversion E (silence visuel au repos).
- **Risque/difficulté** : interpoler un filtre par tuile selon la distance peut coûter cher si beaucoup de nœuds → limiter le filtre lourd à un anneau de tuiles proches (gate par `useTransform` seuillé) ; vérifier le contraste/lisibilité du négatif (a11y).

---

### Concept 2 — **Sillon** (« La galerie est un disque ; le bras de lecture choisit qui joue »)
*Accroche : un vinyle premium tourne lentement ; chaque sillon concentrique est un participant ; déposer le bras = lancer sa vidéo.*

- **Mécanique cœur** : une galette circulaire en rotation lente continue (`useMotionValue` `angle` animé, ou `useSpring`). Les projets sont disposés en **arcs concentriques** (sillons) ; chaque tuile est un secteur clippé en `clip-path` arc (ou une `<img>` posée le long du rayon avec `rotate`+`translate`). Un **bras de lecture** draggable (`drag` contraint sur un arc, `dragConstraints`) : l'angle/rayon du bras détermine le sillon sous la pointe → ce projet reçoit `playing`. `useTransform(angle → …)` répartit les secteurs. Le **label central** (Inter) affiche titre/auteur du sillon courant, façon étiquette de 45 tours.
- **Multiplicité** : tous les sillons sont visibles simultanément en couronnes concentriques — on lit instantanément « N participants » comme on lit les pistes d'un vinyle. La rotation lente fait scintiller les thumbnails (matière).
- **Vidéo** : la vidéo joue dans une **fenêtre ronde au centre** (le label) OU sur le secteur pointé par le bras — une seule `<video>` (le sillon sous la pointe).
- **Axe de navigation** : **drag** (bras) + survol secondaire ; molette = micro-rotation fine de la galette.
- **Palette** : **sombre**, feutré, reflets cuivre/anthracite (objet hi-fi premium) ; option claire (porcelaine) si on veut cimaise.
- **Repli mobile / reduced-motion** : pas de rotation auto ; la galette devient une **liste radiale statique** ; tap d'un sillon = focus + vidéo. `useReducedMotion()` coupe la houle de rotation.
- **Pourquoi pas un cliché / inédit** : pas un carrousel à flèches ni Wheel (la roue existante est une grande roue de tuiles ; ici c'est un **support continu sillonné + bras-outil**, métaphore audio détournée pour du visuel). Manipulation directe d'un outil, profondeur de matière. Inédit : navigation **radiale-temporelle**.
- **Risque/difficulté** : géométrie polaire fastidieuse (placement `cos/sin`, clip arcs) ; lisibilité des thumbnails déformés sur secteurs étroits → garder peu de sillons épais ou n'afficher la vraie image que sur le secteur actif (autres = teinte/initiale).

---

### Concept 3 — **Couloir** (« On avance dans une enfilade de salles ; les projets viennent à nous »)
*Accroche : un corridor de musée en perspective ; le scroll nous fait avancer, les œuvres glissent du fond vers nous et nous dépassent.*

- **Mécanique cœur** : vrai espace 3D. Conteneur `perspective: 1200px`, enfants en `transformStyle: preserve-3d`. Chaque projet = un panneau placé à un `z` croissant (mur gauche / droit en alternance, comme des cimaises). `useScroll` → `progress` ; `useTransform(progress → translateZ)` translate TOUT le couloir vers nous (`useSpring` pour la fluidité). Quand un panneau franchit le plan focal (z proche de 0), il se **redresse face caméra** (`rotateY` 70°→0 via `useTransform`) et reçoit `playing`. Les panneaux passés filent derrière (`backface-visibility:hidden`). Le sol/plafond = dégradé + lignes de fuite en CSS (mask-image) pour ancrer la perspective.
- **Multiplicité** : le **point de fuite est peuplé** : on voit la file de panneaux s'éloigner vers le fond → immédiatement « il y en a beaucoup, et il y en a encore devant ». Cimaises gauche/droite = double rangée.
- **Vidéo** : seul le panneau au **plan focal** (le plus proche, redressé) joue (`playing`) → UNE `<video>`. Les autres restent thumbnails inclinés.
- **Axe de navigation** : **scroll** (avancée) ; drag horizontal optionnel = micro-strafe (regarder à gauche/droite).
- **Palette** : **sombre cinéma** (galerie nocturne, spots) OU **claire/cimaise** (musée blanc, ombres douces) — réglable ; je propose **clair premium** ici pour varier (le concept 1 et 2 sont sombres).
- **Repli mobile / reduced-motion** : mobile = perspective réduite, panneaux empilés en **liste verticale snap** (scroll-snap) qui agrandit le panneau centré (re-projette la mécanique sans 3D lourde). `useReducedMotion()` → pas de translateZ animé, simple fondu/scale au scroll.
- **Pourquoi pas un cliché / inédit** : pas le Coverflow existant (rangée plate ±2). Ici **vraie profondeur traversée** (z infini peuplé), métaphore enfilade de salles. Pas de parallaxe décorative : la 3D EST la navigation. Magnifie l'axe Z (lettre M).
- **Risque/difficulté** : perf 3D si beaucoup de panneaux montés → ne garder en DOM 3D que ±N panneaux autour du focal (fenêtrage), les autres en placeholder ; gérer le mapping scroll↔z pour éviter le mal de mer (amortir avec `useSpring`).

---

### Concept 4 — **Pliure** (« Une mosaïque d'origami ; chaque pli déplie un participant »)
*Accroche : un papier plié couvre l'écran ; survoler une facette la déplie en grand, puis elle se replie quand on part.*

- **Mécanique cœur** : grille de **facettes triangulaires/losanges** en `preserve-3d` ; au repos chaque cellule est légèrement repliée (`rotateX`/`rotateY` ~±18°, `transform-origin` sur une arête) → relief de papier, ombres CSS portées. Au survol d'une facette : elle se **déplie à plat et grandit** (`layout` + `rotateX/Y → 0` + `scale`), les facettes voisines se replient davantage pour faire de la place (effet accordéon spatial). `AnimatePresence`/`layoutId` pour promouvoir la facette ouverte en panneau plein. `clip-path` polygonal donne la forme triangulaire.
- **Multiplicité** : la mosaïque pliée est **dense et visiblement multiple** (chaque facette = un projet, son thumbnail mappé dessus) ; le froissement collectif réagit au pointeur → on sent un patchwork de participants.
- **Vidéo** : la facette dépliée (active) reçoit `playing` → UNE `<video>` sur la facette à plat ; les autres = thumbnails sur papier plié.
- **Axe de navigation** : **survol** (déplier) + clic = ouvrir le lien ; drag léger = « plisser » la nappe (optionnel).
- **Palette** : **claire/neutre** (papier ivoire, ombres tendres) → calme, premium, tactile ; varie vs concepts sombres.
- **Repli mobile / reduced-motion** : `(hover:none)` → grille de cartes plates classiques, tap = ouverture ; `useReducedMotion()` → pas de rotation 3D, seulement fondu/scale au focus. Pli neutralisé.
- **Pourquoi pas un cliché / inédit** : pas HoverExpand (panneaux qui s'élargissent en 2D) — ici **3D origami** avec arêtes, ombres et repli des voisins, matière papier. Pas de grille statique : la nappe respire/se froisse. Métaphore origami jamais utilisée.
- **Risque/difficulté** : géométrie des plis + `transform-origin` par cellule = délicat ; mapper un thumbnail rectangulaire sur une facette triangulaire (`clip-path`) sans crop disgracieux ; garder les ombres CSS performantes.

---

### Concept 5 — **Marée haute** (« Une rangée de projets respire comme l'océan ; le scroll est le ressac »)
*Accroche : les tuiles montent et descendent en vague continue ; celle au sommet de la vague s'ouvre et joue.*

- **Mécanique cœur** : rangée (ou champ) de tuiles dont chaque hauteur/`y` suit une **onde sinusoïdale** : `useTransform(phase → sin(i*k + phase)*amp)` où `phase` est un `useMotionValue` piloté par le scroll horizontal/vertical (`useScroll`) + une **dérive lente continue** (marée de fond). `useSpring` mou = inertie liquide. La tuile dont la phase atteint la **crête** (sin≈1) passe au premier plan : `scale↑`, `z↑`, `playing`. Un dégradé bas façon ligne d'eau + `mask-image` pour l'écume. Le ressac : `onDragEnd`/`onWheel` injecte de l'énergie qui s'amortit (`animate` decay → retour à la marée de fond).
- **Multiplicité** : toute la **houle de tuiles** est visible simultanément, décalées en vague → lecture immédiate de N participants ondulant ensemble (cohésion + pluralité). Aucune impression de « une seule vidéo ».
- **Vidéo** : tuile en crête = `playing` (UNE `<video>`). À mesure que la vague avance, la vidéo « passe » à la tuile suivante (montage/démontage propre via index dérivé).
- **Axe de navigation** : **scroll** (pilote la phase) + **drag** (donne un coup de ressac qui s'amortit) — mix gestuel.
- **Palette** : **sombre bleu-nuit/cinéma** (océan nocturne, reflets) — calme hypnotique premium.
- **Repli mobile / reduced-motion** : `useReducedMotion()` → pas d'onde continue ; scroll-snap simple, la tuile centrée s'agrandit + joue. Mobile = vague d'amplitude réduite, perf-friendly (transform only).
- **Pourquoi pas un cliché / inédit** : ce n'est pas la parallaxe décorative bannie (le mouvement EST la navigation et révèle le projet actif), ni un carrousel. L'onde sinusoïdale collective + l'inertie de ressac (decay) est une mécanique de navigation inédite vs l'existant. Profondeur via crête/z.
- **Risque/difficulté** : doser amplitude/fréquence pour rester **calme** et pas « gadget » ; le mouvement perpétuel peut fatiguer → amplitude faible + dérive très lente ; bien gérer le passage de `playing` d'une tuile à l'autre (éviter flicker vidéo).

---

### Concept 6 — **Ruche** (« Un nid d'abeilles de projets ; l'attention essaime de cellule en cellule »)
*Accroche : une grille hexagonale dense ; la cellule sous le pointeur s'illumine et bourdonne, ses voisines s'écartent légèrement.*

- **Mécanique cœur** : pavage **hexagonal** (CSS `clip-path: polygon(...)` hexagone, décalage de rangées). Le pointeur agit en **aimant doux** : `useMotionValue` x/y → chaque cellule calcule un déplacement radial atténué (`useTransform` distance→offset, façon répulsion/attraction légère) pour « respirer » autour du curseur, façon essaim. La cellule la plus proche : `scale↑`, perte de teinte (révèle le thumbnail couleur), `playing`. Transition d'ouverture plein écran via `layoutId` (l'hexagone → panneau). Au repos, **micro-frémissement** désynchronisé par cellule (offsets aléatoires seedés 4173) = bourdonnement subtil.
- **Multiplicité** : le nid **est** la multiplicité — des dizaines de cellules identiques en structure, chacune un projet ; lecture instantanée « collectif / ruche de participants ». Très lisible et original.
- **Vidéo** : cellule active (sous pointeur / focus) = `playing`, UNE `<video>` clippée dans l'hexagone. Le reste = thumbnails teintés monochromes (calme).
- **Axe de navigation** : **survol/curseur** (essaimage) + clic = ouverture ; drag = panoramique si la ruche dépasse l'écran.
- **Palette** : **claire miel/ambre OU sombre** ; je propose **claire ambrée chaude** pour le côté ruche, varie vs les sombres.
- **Repli mobile / reduced-motion** : `(hover:none)` → grille d'hexagones statique, tap = ouverture/vidéo ; `useReducedMotion()` coupe l'essaimage et le frémissement. Hexagones simplifiés en cartes si trop coûteux sur petit écran.
- **Pourquoi pas un cliché / inédit** : pas MagneticField (particules libres) — ici **structure rigide hexagonale** (pavage cohérent) + révélation couleur + bourdonnement seedé. Pas de grille rectangulaire plate (lettre R : géométrie réorganisée). Inédit : tessellation vivante.
- **Risque/difficulté** : pavage hexagonal responsive + `clip-path` sur média (crop) ; coût du calcul de distance pour chaque cellule au `mousemove` → gate sur un voisinage, throttle via `useMotionValue` (pas de re-render React, tout en transform). Lisibilité du texte dans un hexagone.

---

## Classement (du plus fort au plus risqué)

1. **Couloir** — le plus WOW desktop, profondeur traversée inédite, multiplicité au point de fuite très forte ; risque perf maîtrisable par fenêtrage. *Top.*
2. **Chambre noire** — concept premium/calme le plus distinctif et le plus simple techniquement (proche du moteur Lighthouse mais détourné en développement photo) ; fort effet « wow silencieux ».
3. **Marée haute** — mécanique de navigation neuve (onde + ressac decay), très élégante si dosée sobre ; risque « gadget » si trop d'amplitude.
4. **Sillon** — métaphore mémorable et manipulation directe d'un outil, mais géométrie polaire + lisibilité des secteurs = chantier.
5. **Pliure (origami)** — superbe matière, mais le mapping thumbnail→facette triangulaire et les plis 3D sont délicats à rendre propres.
6. **Ruche** — très lisible/original mais le plus risqué en perf (calcul par cellule) + responsive hexagonal + texte dans hexagone.

**TOP 2 : Couloir & Chambre noire.**

## Hypothèses & questions ouvertes
- **Hypothèse** : le jeu de données reste ~6–12 projets (vu `projects.ts`) → le fenêtrage 3D (Couloir) et le pavage (Ruche) restent légers ; à revalider si le catalogue gonfle à 30+.
- **Hypothèse** : `previewVideo` peut ne pas exister pour tous les projets → toutes les mécaniques retombent proprement sur le thumbnail (le `playing` est gated par `Boolean(previewVideo)` dans `ProjectTile`).
- **Hypothèse** : une seule `<video>` montée à la fois est non négociable → chaque concept ne donne `playing` qu'à l'unique tuile focale ; transitions d'index gérées pour éviter le flicker (clé stable + court fondu).
- **Question ouverte** : palette par vue — j'ai volontairement panaché (Couloir clair, Chambre noire/Sillon/Marée sombres, Pliure/Ruche claires) pour le catalogue ; à arbitrer selon la cohérence d'ensemble souhaitée.
- **Question ouverte** : tolérance au mouvement perpétuel (Marée, Sillon rotation, Ruche frémissement) vs exigence « CALME » — prévoir amplitude minimale par défaut + respect strict de `useReducedMotion()`.
- **Question ouverte** : faut-il un cartel/texte toujours lisible (a11y, noms des participants) même en mode sombre/négatif (Chambre noire) ? Je recommande un overlay texte persistant léger indépendant du filtre image.
