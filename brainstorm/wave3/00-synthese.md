# Vague 3 — SYNTHÈSE AGRÉGÉE (agent 00)

> Source : les 5 documents de brainstorm (`01-scamper`, `02-six-chapeaux`, `03-mind-mapping`, `04-reverse`, `05-synectics`).
> 30 concepts générés (6 par agent). Mission : célébrer PLUSIEURS participants, ressenti CALME / PREMIUM, audacieux mais maîtrisé, INÉDIT vs les 24 vues existantes.
> Contrat technique confirmé dans le code (`src/types.ts`, `ProjectTile.tsx`, `CoverflowView.tsx`) :
> - `Project { id, title, author, thumbnail, width, height, href, kind, previewVideo? }` — AUCUNE métadonnée de regroupement (cohorte/thème/relation) n'existe.
> - `ProjectTile` accepte `playing` (UNE `<video>` montée et contrôlée par la vue), `previewOnHover`, `as="div"`, `overlayTitle`, `onActivate`. La `<video>` est gated par `Boolean(previewVideo)`.
> - Une vue = `({ projects }: GalleryViewProps)` enregistrée dans un `registry.*.ts`, famille `Concepts (hors-piste)`.
> - Stack : MUI v6 + Framer Motion v11 PUR (`useScroll/useTransform/useSpring/useMotionValue/animate/drag/AnimatePresence/layout/layoutId/useReducedMotion`, CSS 3D, `clip-path`, `mask-image`, `mix-blend-mode`, filtres). Pas de WebGL, pas de nouvelle dépendance.
> - 24 vues déjà construites : Grid, Bento, Masonry, JustifiedRows, EditorialList, Stack, MasonryParallax, HorizontalScroll, RevealOnScroll, ZoomScroll, Carousel, Coverflow, HoverExpand, SwipeDeck, SpotlightFocus, Book, Wheel, Lighthouse, MaterialAwaken, MagneticField, Confetti, Loom, Tuning.

---

## 1. PANORAMA — les 30 concepts

| # | Méthode | Nom | Accroche (1 ligne) | Axe nav | Palette |
|---|---------|-----|--------------------|---------|---------|
| 1 | SCAMPER | **Chambre noire** | Planche-contact en négatif ; le curseur-lanterne « développe » l'image latente. | Survol | Sombre (labo, ambre) |
| 2 | SCAMPER | **Sillon** | Vinyle premium qui tourne ; le bras de lecture choisit le projet qui joue. | Drag (bras) | Sombre cuivre/anthracite |
| 3 | SCAMPER | **Couloir** | Corridor de musée en perspective ; on avance, les œuvres viennent à nous. | Scroll (+drag) | Claire/cimaise |
| 4 | SCAMPER | **Pliure (origami)** | Nappe de papier plié ; survoler une facette la déplie en grand. | Survol | Claire ivoire |
| 5 | SCAMPER | **Marée haute** | Rangée qui ondule comme l'océan ; la tuile en crête s'ouvre et joue. | Scroll + drag | Sombre bleu-nuit |
| 6 | SCAMPER | **Ruche** | Nid d'abeilles ; la cellule sous le pointeur s'illumine, les voisines s'écartent. | Survol | Claire miel/ambre |
| 7 | 6 CHAPEAUX | **Brume (Depth Fog)** | On avance dans un brouillard de projets ; ce qu'on approche devient net. | Scroll/drag (Z) | Sombre cinéma |
| 8 | 6 CHAPEAUX | **Échafaudage** | Charpente visible ; une travée se détache au centre et s'anime. | Scroll + survol | Claire béton/graphite |
| 9 | 6 CHAPEAUX | **Constellation** | Astres draggables en 2.5D ; approcher un astre l'allume et le nomme ; liens = communauté. | Drag | Sombre ciel profond |
| 10 | 6 CHAPEAUX | **Tiroirs** | Mur de tiroirs ; on en tire un (drag) et la vidéo apparaît dans la cavité. | Drag | Claire bois/métal |
| 11 | 6 CHAPEAUX | **Soie (Voile)** | Voile translucide qu'on déplace au curseur ; le projet apparaît sous la traîne. | Survol | Variable (laiteux/fumé) |
| 12 | 6 CHAPEAUX | **Écho (Resonance)** | Un focal central, les autres en anneaux concentriques qui s'estompent. | Scroll/drag | Sombre cinéma |
| 13 | MIND MAP | **Prisme** | Une raie de lumière se réfracte en spectre ; chaque bande = un projet. | Scroll + survol | Sombre quasi-noir |
| 14 | MIND MAP | **Marée basse** | Galerie sous l'eau ; la marée se retire au scroll et découvre les projets. | Scroll | Sombre→claire évolutive |
| 15 | MIND MAP | **Horloge** | Cadran géant ; les participants sont les heures, on tourne l'aiguille. | Drag rotatif + scroll | Claire ivoire/encre |
| 16 | MIND MAP | **Racine (Arbre)** | Système racinaire qui pousse au scroll ; chaque feuille = un participant. | Scroll + survol | Sombre terre/or pâle |
| 17 | MIND MAP | **Faille (strates)** | Bloc de roche stratifié ; un séisme ouvre la faille et révèle les couches. | Drag/scroll vert. | Sombre roche/magma |
| 18 | MIND MAP | **Pollen** | Nuage de spores ; le geste les attire, elles s'agglutinent et révèlent. | Survol/drag | Claire laiteux/poudré |
| 19 | REVERSE | **Dissipe (fumée)** | Brouillard premium ; le curseur/scroll est un souffle qui dissipe et révèle. | Survol + scroll | Sombre anthracite + néon |
| 20 | REVERSE | **Palier (ascenseur)** | Immeuble ; chaque étage = un projet plein-cadre, portes vitrées sur les voisins. | Scroll | Claire alu + néon |
| 21 | REVERSE | **Calque (papier calque)** | Feuilles translucides empilées ; on en glisse une, les pairs transparaissent. | Drag | Claire ivoire/graphite |
| 22 | REVERSE | **Dédale (labyrinthe)** | Plan de salles vu de dessus ; on navigue, une minimap dit où on est. | Drag (pan) | Sombre blueprint + néon |
| 23 | REVERSE | **Gravier** | Grains éparpillés qui s'agrègent sous le geste pour former une tuile. | Survol + scroll | Sombre grains lumineux |
| 24 | REVERSE | **Lisière (néon)** | Frise horizontale ; le focal s'élargit avec liseré néon, voisins en calque nommés. | Scroll/drag horiz. | Sombre éditoriale + néon |
| 25 | SYNECTICS | **Banc** | Tuiles en formation de banc ; le curseur-prédateur les écarte, elles se recomposent. | Survol | Sombre aquatique |
| 26 | SYNECTICS | **Faille (douce)** | Deux plaques glissent en sens opposés ; à la ligne de faille, le sol s'ouvre. | Scroll | Claire pierre / sombre faille |
| 27 | SYNECTICS | **Métronome** | Balancier unique qui cadence ; un seul projet « sur le temps fort » joue. | Scroll | Claire horlogère |
| 28 | SYNECTICS | **Sève** | Feuilles d'un même arbre reliées par des veines ; la sève irrigue et épanouit. | Scroll + survol | Sombre bioluminescent |
| 29 | SYNECTICS | **Douane (seuils)** | Couloir de guichets ; chaque projet se « tamponne » (clip-path) puis on franchit. | Scroll/drag (Z) | Claire marbre + encre |
| 30 | SYNECTICS | **Kaléidoscope** | Symétrie radiale de secteurs ; la lumière d'une vidéo teinte les reflets. | Drag rotatif | Sombre verre/lumière |

---

## 2. REGROUPEMENT EN FAMILLES

Les 30 concepts convergent vers **8 familles** (+ 1 cas isolé). Pour chaque famille : le motif récurrent, et la **meilleure incarnation** (le concept le plus abouti, fusionnant les bonnes idées des autres).

### Famille A — PROFONDEUR / BROUILLARD (navigation en Z dans un volume habité)
Concepts : **Brume (7)**, **Dissipe (19)**, **Couloir (3)**, **Douane (29)**.
- **Ce qui revient** : un axe Z porteur d'info (net devant / flou-désaturé derrière) ; la multiplicité lue au « point de fuite » peuplé ; flou maîtrisé (rayon plafonné, posters basse-déf) ; révélation par approche.
- **Sous-clivage net** : (A1) *traverser un volume 3D* (Couloir, Douane) — perspective + translateZ + redressement face caméra ; (A2) *dissiper un voile de flou* (Brume, Dissipe) — `filter: blur` + `mask-image` au geste.
- **MEILLEURE INCARNATION** :
  - **A1 → COULOIR** (3) : la vraie traversée 3D, point de fuite peuplé, cimaises gauche/droite = double rangée. Plus structuré que Douane (qui ajoute un rituel de tampon `clip-path` réutilisable comme bonus, mais le couloir est l'ossature commune). Fusionne le « tampon » de Douane comme transition d'ouverture optionnelle.
  - **A2 → DISSIPE** (19) : le souffle au curseur + balayage automatique au scroll (mix) + repli mobile pensé ; supérieur à Brume sur la mécanique de masque, équivalent sur la profondeur. Fusionne de Brume l'idée des *plusieurs plans Z* simultanés sous le voile pour renforcer la pluralité.

### Famille B — VOILE / CALQUE / RÉVÉLATION PAR SURFACE (révélation interactive 2D)
Concepts : **Soie (11)**, **Calque (21)**, **Chambre noire (1)**.
- **Ce qui revient** : une couche posée sur la grille (voile, calque, négatif) qu'on perturbe localement pour révéler le contenu net/coloré dessous ; pluralité = champ entier deviné en transparence ; `mask-image` + `mix-blend-mode` + filtres.
- **MEILLEURE INCARNATION** : **CHAMBRE NOIRE (1)** comme variante survol la plus *inédite* (le masque module un FILTRE — négatif→positif chimique — pas l'opacité, donc se distingue franchement de Lighthouse/Spotlight) ; ET **CALQUE (21)** comme variante DRAG la plus distincte (transparence superposée permanente + glissement de feuilles, métaphore atelier, perf légère sans blur). Soie (11) est le plus faible : dépend du survol, repli mobile affaibli, compositing lourd → on le **fusionne dans Chambre noire** (le voile = le bain révélateur).

### Famille C — STRATES / FAILLE (ouverture mécanique d'un volume comprimé)
Concepts : **Faille/strates (17, mind-map)**, **Faille douce (26, synectics)**.
- **Ce qui revient** : projets comprimés en couches/bandes ; une faille `clip-path` s'ouvre et décompresse les strates ; chaleur/magma qui guide l'œil ; tout dérivé d'un seul `scrollYProgress`.
- **MEILLEURE INCARNATION** : **FAILLE** = fusion. Prendre des **deux bandes antagonistes** de Synectics (26) (subduction, tension narrative, anti-parallaxe net) + la **décompression de strates** `scaleY 0.15→1` du Mind-Map (17) + le contraste **surface claire / faille sombre+magma**. C'est la fusion la plus riche du lot.

### Famille D — ORGANIQUE CONNECTÉ (graphe/arbre, célèbre la communauté)
Concepts : **Racine (16)**, **Sève (28)**.
- **Ce qui revient** : tuiles reliées par des veines/branches SVG ; `pathLength` (Racine) ou `mask` qui circule (Sève) ; le SEUL groupe qui *raconte explicitement* « plusieurs participants, une origine commune (le lab) » → fort alignement mission.
- **MEILLEURE INCARNATION** : **RACINE (16)**. Le `pathLength` 0→1 piloté au scroll est une primitive Framer pure inexploitée par les 24 vues, et la croissance « au scroll » colle au pattern adoré. On y greffe de **Sève** le *flux animé* (gradient/`mask` qui irrigue la branche active + reflux des voisines) comme couche de vie au repos. **Réserve commune** : aucune métadonnée de relation dans `Project` → l'arbre/réseau sera *esthétique* (dérivé de l'index), pas une vraie taxonomie.

### Famille E — RADIAL / ROTATIF (lecture circulaire, snap polaire)
Concepts : **Sillon (2)**, **Horloge (15)**, **Métronome (27)**, **Écho (12)**, **Kaléidoscope (30)**, **Prisme (13, semi-radial)**.
- **Ce qui revient** : disposition en arc/anneau/secteurs ; rotation pilotée drag/scroll ; snap polaire sur l'élément actif ; un seul élément « actif » au sommet/sous l'aiguille/au centre joue.
- **Risque de redite interne** : famille très peuplée ET proche de Wheel/Carousel existants → n'en garder qu'1–2, bien différenciés.
- **MEILLEURE INCARNATION** :
  - **MÉTRONOME (27)** : la notion de *tempo* (balancier qui oscille, snap rythmique, « temps fort ») est la métaphore la plus neuve et la plus calme du groupe ; distincte de Wheel (rotation continue) par l'oscillation bornée. Top de la famille.
  - **SILLON (2)** comme alternative *drag-objet* (bras de lecture = outil manipulé, support continu sillonné) — plus original que Horloge, et c'est un axe DRAG que la shortlist a besoin de couvrir. Horloge (15), Écho (12, proche Wheel), Kaléidoscope (30, lisibilité risquée) sont déclassés. Prisme (13) traité à part (famille H).

### Famille F — ESSAIM / PARTICULES (comportement collectif émergent)
Concepts : **Pollen (18)**, **Gravier (23)**, **Banc (25)**.
- **Ce qui revient** : multiplicité *incarnée* (un essaim = « beaucoup » par définition) ; attraction/répulsion au curseur ; ressorts par item ; risque perf (animer N items en continu) ; risque « gadget/ça bouge trop » → calme = dérive lente + amplitude faible.
- **Proximité avec l'existant** : MagneticField existe → tout concept doit être un comportement *collectif* (pas attraction point-par-point).
- **MEILLEURE INCARNATION** : **BANC (25)**. Le comportement de banc (cohésion + répulsion du *seul* curseur, pas de physique N-corps) est le plus défendable en perf ET le plus distinct de MagneticField (répulsion+cohésion de groupe vs attraction individuelle). Gravier (23, agrégation/décomposition de grains) est le plus spectaculaire mais le plus lourd (100+ grains) → garder en *réserve, perf-first*. Pollen (18) ≈ Banc en plus risqué → fusionner sa dérive douce dans Banc.

### Famille G — SPATIAL HABITÉ / TOPOLOGIE (étages, salles, charpente, drawers)
Concepts : **Palier (20)**, **Dédale (22)**, **Échafaudage (8)**, **Tiroirs (10)**, **Constellation (9)**.
- **Ce qui revient** : une *structure* lisible (immeuble, plan, charpente, mur, ciel) qui montre l'ampleur de la collection ; navigation par déplacement dans/parmi la structure ; souvent besoin d'une boussole (minimap, n° d'étage).
- **MEILLEURE INCARNATION** :
  - **CONSTELLATION (9)** : interface spatiale draggable, *tactile-native* (mobile excellent sans repli à inventer), liens = communauté explicite (renforce la mission). C'est le meilleur axe DRAG « espace ouvert » du catalogue. (Recoupe Racine sur les « liens » mais la mécanique est différente : pan/parallaxe vs croissance.)
  - **TIROIRS (10)** : la manipulation directe (drag + `dragSnapToOrigin`) la plus *satisfaisante* et la révélation en Z par cavité (`mask-image`) est inédite vs HoverExpand/SwipeDeck. Bonne réserve drag clair/matière.
  - Palier (20) = risque « full-page scroller » ; Échafaudage (8) = lisibilité ossature délicate ; Dédale (22) = audacieux mais désorientation/complexité élevées → réserves.

### Famille H — OPTIQUE / SPECTRE (transformation de la lumière)
Concept isolé : **Prisme (13)**.
- **Ce qui revient** : pas de cluster — concept unique. Réfraction d'une raie en spectre, sémantique couleur (chaque bande = un projet), éventail radial.
- **MEILLEURE INCARNATION** : **PRISME (13)** lui-même. Inédit (aucune vue n'exploite `hue-rotate`+`screen` comme métaphore optique de tri), mais risque de *fidélité des couleurs* (le `hue-rotate` trahit les vraies teintes des thumbnails) → atténuer fortement l'intensité, réelle couleur restituée sur la bande active.

### Cas écartés d'emblée (doublons avec l'existant ou trop risqués)
- **Écho (12)** ≈ Wheel + radial ; **Kaléidoscope (30)** lisibilité des reflets non garantie ; **Horloge (15)** ≈ Wheel ; **Soie (11)** dépend du survol + compositing lourd, couvert par Chambre noire. Gardés en banc de réserve, pas en shortlist.

---

## 3. NOTATION (0-5 par axe, sur les concepts retenus comme « meilleure incarnation » + challengers)

Axes : **PrCa** Premium/Calme · **Inéd** Inédit (vs 24 vues) · **Mult** Multiplicité lisible d'emblée · **Frmr** Faisabilité Framer-pur · **Anti** Anti-cliché (vs bannis). Total /25. Trié décroissant.

| Concept | Famille | PrCa | Inéd | Mult | Frmr | Anti | **Total** |
|---------|---------|:----:|:----:|:----:|:----:|:----:|:---------:|
| **Chambre noire (1)** | B | 5 | 5 | 4 | 4 | 5 | **23** |
| **Couloir (3)** | A1 | 4 | 5 | 5 | 4 | 5 | **23** |
| **Faille (17+26 fusion)** | C | 4 | 5 | 5 | 4 | 5 | **23** |
| **Calque (21)** | B | 5 | 4 | 5 | 5 | 4 | **23** |
| **Constellation (9)** | G | 4 | 4 | 5 | 4 | 5 | **22** |
| **Métronome (27)** | E | 5 | 4 | 4 | 5 | 4 | **22** |
| **Racine (16)+Sève** | D | 4 | 5 | 5 | 3 | 5 | **22** |
| **Dissipe (19)** | A2 | 4 | 4 | 4 | 4 | 5 | **21** |
| **Marée basse (14)** | C/A | 5 | 5 | 4 | 3 | 4 | **21** |
| **Tiroirs (10)** | G | 4 | 4 | 5 | 4 | 4 | **21** |
| **Sillon (2)** | E | 4 | 5 | 4 | 3 | 5 | **21** |
| **Banc (25)** | F | 4 | 4 | 5 | 3 | 4 | **20** |
| **Lisière (24)** | E/scroll | 5 | 3 | 5 | 5 | 3 | **21** |
| **Prisme (13)** | H | 4 | 5 | 4 | 3 | 4 | **20** |
| **Pliure/origami (4)** | (matière 3D) | 4 | 4 | 4 | 3 | 4 | **19** |
| **Marée haute (5)** | F/onde | 4 | 3 | 4 | 4 | 4 | **19** |
| **Palier (20)** | G | 4 | 3 | 4 | 5 | 3 | **19** |
| **Échafaudage (8)** | G | 4 | 4 | 4 | 3 | 4 | **19** |
| **Gravier (23)** | F | 3 | 4 | 4 | 2 | 4 | **17** |
| **Dédale (22)** | G | 3 | 4 | 4 | 2 | 4 | **17** |
| **Ruche (6)** | F/grille | 3 | 3 | 5 | 3 | 3 | **17** |
| **Kaléidoscope (30)** | E | 3 | 4 | 3 | 2 | 3 | **15** |

*Notes de barème* : Marée basse perd 1 en Frmr (mask ondulé + bascule de palette à coordonner) mais gagne en PrCa/Inéd (changement d'état de matière). Racine perd en Frmr (layout d'arbre non trivial). Gravier/Dédale plombés par la faisabilité (perf particules / désorientation). Lisière haut en PrCa/Mult/Frmr mais bas en Inéd (proche de l'ancre coverflow transcendée).

---

## 4. RECOMMANDATION DE CONSTRUCTION — SHORTLIST (7 concepts)

Critères de sélection : pas de redondance entre eux NI avec les 24 existants ; couvre les **3 axes de navigation** ; mix **palettes claires/sombres** ; on confie chaque concept à l'agent qui l'a inventé.

Couverture visée :
- **Scroll** : Couloir, Faille, Marée basse, Racine.
- **Drag** : Constellation, Sillon, (Couloir = drag secondaire).
- **Survol** : Chambre noire, (Racine = survol secondaire).
- **Palettes** : sombres → Chambre noire, Couloir(option)/Faille(faille), Constellation, Racine, Sillon ; claires → Couloir (cimaise), Marée basse (à marée basse), Faille (surface).

| # | Nom final | Pitch | Axe nav | Palette | Agent (origine) |
|---|-----------|-------|---------|---------|-----------------|
| 1 | **Chambre noire** | Planche-contact en négatif ; le curseur-lanterne *développe* chimiquement l'image (le masque module un FILTRE, pas l'opacité — anti-Lighthouse). Silence visuel premium au repos. | Survol | Sombre | **01-SCAMPER** |
| 2 | **Couloir** | Vraie traversée 3D d'un corridor de cimaises ; le scroll avance, les œuvres se redressent face caméra au plan focal ; point de fuite peuplé = multiplicité instantanée. | Scroll (+drag strafe) | Claire/cimaise | **01-SCAMPER** |
| 3 | **Constellation** | Champ d'astres draggable en 2.5D ; approcher un astre l'allume + le nomme ; liens SVG intra-grappe = la communauté du lab rendue visible. Tactile-natif. | Drag | Sombre | **02-SIX CHAPEAUX** |
| 4 | **Marée basse** | La marée se retire au scroll et découvre les projets comme un estran ; la palette bascule **sombre→claire** en récompense ; révélation continue et réversible. | Scroll | Évolutive sombre→claire | **03-MIND MAPPING** |
| 5 | **Racine (+ flux de sève)** | Système racinaire qui *pousse* au scroll (`pathLength`) ; chaque feuille = un participant ; un flux irrigue la feuille active. Seule vue qui raconte « une origine, N participants ». | Scroll + survol | Sombre terre/or | **03-MIND MAPPING** |
| 6 | **Faille** | Deux plaques antagonistes glissent en sens opposés ; à la ligne de faille le sol s'ouvre (`clip-path`) et décompresse les strates ; surface claire vs faille magma. | Scroll (+drag) | Claire surface / sombre faille | **05-SYNECTICS** |
| 7 | **Métronome** | Un balancier unique cadence la galerie ; un seul projet « sur le temps fort » joue, snap rythmique ; tempo *visuel et silencieux*. | Scroll | Claire horlogère | **05-SYNECTICS** |

### Répartition par agent builder (~1-2 concepts chacun)

| Agent builder | Concepts assignés | Justification |
|---------------|-------------------|---------------|
| **01 — SCAMPER** | **Chambre noire** + **Couloir** | Les a inventés ; maîtrise le détournement `mask-image→filtre` et la 3D `preserve-3d`/`perspective`. Deux palettes opposées (sombre + claire). |
| **02 — SIX CHAPEAUX** | **Constellation** | Seul concept drag « espace ouvert » de la shortlist ; couvre l'axe drag + le repli mobile natif. (1 concept car le plus exigeant côté topologie/recentrage.) |
| **03 — MIND MAPPING** | **Marée basse** + **Racine** | Les a inventés ; expert du `pathLength`/SVG (Racine) et du masque de niveau partagé (Marée). Couvre la bascule de palette + l'axe « communauté ». |
| **04 — REVERSE** | **Dissipe** *(suppléant)* — voir note | Reverse a surtout produit des variantes de familles déjà mieux incarnées ailleurs (Dissipe≈Chambre noire/Brume, Calque≈Calque/B, Lisière≈coverflow). On lui confie **Dissipe** SI on veut un 8e concept (souffle de fumée au scroll, sombre+néon) ; sinon réaffecter sa capacité en renfort sur Faille/Couloir. |
| **05 — SYNECTICS** | **Faille** + **Métronome** | Les a inventés (et Faille fusionne sa version 26 + la 17 du mind-map) ; maîtrise `scrollYProgress`→clip-path/rotateX et `useSpring` d'angle. Deux palettes (claire+faille / horlogère). |

> **Décision shortlist 7 vs 8** : la shortlist resserrée à **7** évite la redondance (Dissipe partage la mécanique masque/profondeur avec Chambre noire ET Couloir). **Recommandation** : construire les 7 d'abord ; n'ajouter **Dissipe** (8e, agent 04) que si l'on veut une 2e incarnation « voile sombre + néon » distincte — sinon donner à l'agent 04 un rôle de *renfort perf/3D* sur Couloir et Faille (les deux plus risqués techniquement). Banc (agent 04 pourrait aussi le porter) reste en réserve si l'on veut absolument couvrir la famille « essaim ».

---

## 5. NOTES TECHNIQUES TRANSVERSES

### Architecture commune à mutualiser
1. **UNE `<video>` active, swap de `src` recommandé.** Tous les concepts désignent UN élément focal. Deux stratégies vues dans les docs : (a) montage/démontage conditionnel d'une `<video>` (ce que fait `ProjectTile` via `playing` — le plus simple, déjà supporté) ; (b) un unique élément `<video>` dont on change `src`. **Recommandation** : s'appuyer sur le contrat existant `playing` (une seule tuile reçoit `playing={true}`) ; ProjectTile gate déjà sur `Boolean(previewVideo)`. Le swap manuel de `src` n'est utile que si le flicker au remontage gêne (Marée, Faille, Métronome où le focal change souvent) → prévoir une clé stable + court fondu `AnimatePresence`.
2. **Moteur de profondeur/drag mutualisé ?** Plusieurs concepts (Couloir, Constellation, Brume/Dissipe, Tiroirs) partagent : pointeur/scroll → `useMotionValue` x/y/z lissé par `useSpring`, puis `useTransform` par item (distance→scale/opacity/blur/translateZ). **Recommandation** : extraire un petit hook utilitaire `useDepthField`/`useInertialPointer` (mapping distance→propriétés + spring) plutôt que dupliquer la logique 5×. Non bloquant pour un premier proto, mais à factoriser dès le 2e concept de la famille A/G.
3. **Métadonnées de regroupement : ABSENTES.** `Project` n'a ni cohorte, ni thème, ni relation parent/enfant. Concepts impactés : **Racine** (arbre), **Constellation** (grappes), **Faille** (strates = années), **Sève** (organisme). Ils dériveront leur structure de l'**index/ordre** (esthétique, déterministe par seed) — pas une vraie taxonomie. **Question/décision** : faut-il étendre `Project` avec un champ optionnel `group?: string` (cohorte/thème) pour donner un *sens réel* à ces vues ? Fort potentiel, faible coût ; à arbitrer avant de figer Racine/Constellation/Faille.
4. **Scroll-jacking — garder une sortie native.** Concepts pilotés scroll (Couloir, Marée basse, Racine, Faille, Métronome) transforment le scroll en machine d'état. Risques signalés par tous : deltas trackpad/molette hétérogènes, frustration si mal calibré. **Recommandation** : normaliser les deltas, amortir via `useSpring`, et toujours permettre un scroll natif d'évasion (pas de capture totale). Respect **strict** de `useReducedMotion()` — déjà présent dans le code (`CoverflowView`) : reduced-motion = vue plate, complète, navigable (jamais une page morte).
5. **Budget perf des flous/filtres.** `filter: blur()` animé est le coût n°1 (signalé par 4 agents sur 5). Mitigations consensuelles : flouter **une seule couche de fond** (pas N items), rayon plafonné, posters basse-déf, `will-change: transform`, gate du filtre lourd à un voisinage proche (Chambre noire, Dissipe, Brume, Marée). `mix-blend-mode` + `mask-image` + 3D empilés = risque compositing Safari (z-fighting, blend cassé) → tester tôt sur Safari, désactiver la 3D pendant les transitions `layout`.
6. **Particules en DOM/Framer.** Banc/Pollen/Gravier : plafonner ~20-24 items animés, throttle pointermove via MotionValue natif (pas de re-render React), pauser hors-écran, `requestAnimationFrame`. Gravier (100+ grains) = à prototyper perf-first AVANT d'investir.
7. **Géométrie polaire/SVG.** Sillon/Horloge/Métronome (placement `cos/sin`, drag rotatif `atan2`) et Racine/Sève (layout d'arbre sans chevauchement + `pathLength`) = chantiers algorithmiques à pré-calculer de façon déterministe (seed).
8. **Lisibilité texte = règle d'or.** Tous insistent : titre+auteur **toujours lisibles**, en overlay net jamais flouté/masqué, même en mode sombre/négatif/transparent. Encadré opaque local derrière le nom (Calque, Chambre noire).

### Questions ouvertes communes (à trancher avant la vague de construction)
- **Volume N de projets ?** (6 ? 12 ? 30 ? 100 ?) — détermine la densité de Couloir (fenêtrage 3D), Constellation, Prisme (largeur éventail), Banc/Gravier (nb de grains), Racine (profondeur d'arbre). Hypothèse partagée : ~6-30 ; dégrader gracieusement au-delà.
- **Étendre `Project` avec `group?`** (cohorte/thème) ? → débloque le *sens* de Racine/Constellation/Faille/Sève (voir point 3).
- **Pluralité visible = silhouettes floues suffisent, ou titres/auteurs lisibles dès le repos ?** (impacte Dissipe, Brume, Gravier, Chambre noire).
- **Palette « varie par vue »** : la vue pose-t-elle son propre fond local, ou la `GalleryShell` anime-t-elle la transition de palette à l'entrée ? (impacte surtout Marée basse, dont la bascule sombre→claire EST le concept). Hypothèse : la vue gère son fond.
- **Tolérance au scroll-jacking** : garde-t-on toujours un scroll natif d'évasion ?
- **Cible perf** : desktop WOW seul, ou laptops modestes ? → arbitre Gravier/Dédale/Banc et l'amplitude des flous.
- **`previewVideo` présent pour tous ?** Sinon retombée propre sur thumbnail (déjà gérée par le gate `Boolean(previewVideo)`).

---

## 6. MON AVIS « AVEC CE QUE JE SAIS » (tranché)

### Les 3 plus prometteurs (à construire en priorité)
1. **CHAMBRE NOIRE** — le meilleur ratio premium/inédit/faisabilité. La trouvaille « le masque module un FILTRE (négatif→positif), pas l'opacité » est ce qui la sépare proprement de Lighthouse/Spotlight, qui sinon serait le piège n°1 (on a déjà un cône de lumière sur brume). Le « silence visuel au repos » est exactement le ressenti CALME/PREMIUM demandé, et c'est techniquement proche d'un moteur déjà éprouvé (Lighthouse) → faisable vite. **Piège** : interpoler un filtre lourd par tuile coûte cher → gate sur un anneau de tuiles proches ; vérifier le contraste du négatif (a11y) avec overlay texte persistant.
2. **COULOIR** — c'est le « DESKTOP WOW » du brief. Aucune vue existante ne fait une *vraie* traversée Z (Coverflow est une rangée plate ±2, ZoomScroll un zoom 2D). Le point de fuite peuplé résout élégamment « 1 vidéo / N participants ». **Piège** : le mal de mer (amortir scroll↔z par `useSpring`) et la perf 3D (fenêtrer ±N panneaux montés, le reste en placeholder). À ne pas confondre avec Douane (même ossature : Douane = Couloir + rituel de tampon ; je garde Couloir et récupère le tampon comme transition d'ouverture optionnelle).
3. **FAILLE** (fusion 17+26) — la métaphore la plus *audacieuse mais maîtrisée*, et la fusion la plus riche des 30 idées (deux plaques antagonistes + décompression de strates + contraste surface/magma). Anti-parallaxe net (le mouvement est *opposé et narratif*). Tout dérive d'un seul `scrollYProgress` → très Framer-pur. **Piège** : coordonner `clip-path` + `rotateX` + deux translations opposées sans à-coups ni mal de mer (vitesses douces, springs) ; proximité conceptuelle avec Stack → bien marquer la *compression en tranches* pour différencier.

### Le pari à fort sens : RACINE
Hors top-3 sur le total brut (faisabilité du layout), mais c'est **le seul concept qui raconte la mission** (« une origine commune, N participants »). Pour une galerie d'un *lab × université*, cette charge narrative vaut le risque. Je le garde dans la shortlist, en acceptant que l'arbre soit esthétique tant que `Project.group` n'existe pas. **Piège** : layout d'arbre sans chevauchement (pré-calcul déterministe par N) + perf `pathLength` (limiter la profondeur).

### À ÉCARTER (et pourquoi)
- **Kaléidoscope (30)** — la lisibilité des participants n'est pas garantie sous les reflets ; on admire un motif, on ne comprend pas « qui a fait quoi » (anti-A15). Faisabilité Framer-pur faible. Écarté.
- **Écho (12)** et **Horloge (15)** — trop proches de **Wheel** existant (radial 1D/rotation) ; n'ajoutent pas de dimension neuve suffisante. Écartés au profit de Métronome (qui, lui, apporte le *tempo/oscillation bornée*, vraiment distinct).
- **Soie (11)** — bel effet desktop mais s'effondre au tactile (cœur = survol) et compositing lourd ; sa valeur est déjà captée par Chambre noire (le voile = le bain). Écarté.
- **Gravier (23)** et **Dédale (22)** — pépites potentielles mais les deux plus risqués (perf 100+ particules DOM ; désorientation). Pas en première vague ; à prototyper isolément si budget.
- **Lisière (24)** — la plus *sûre* mais la moins inédite (coverflow transcendé) ; en cataloguer une de plus ne fait pas avancer la mission « inventer de l'inédit ». Réserve.
- **Ruche (6)**, **Palier (20)**, **Échafaudage (8)**, **Pollen (18)**, **Marée haute (5)**, **Tiroirs (10)**, **Sillon (2)**, **Prisme (13)**, **Banc (25)** — tous corrects, mais redondants avec une meilleure incarnation de leur famille déjà dans la shortlist, ou un cran en-dessous. **Sillon, Tiroirs et Banc** sont les meilleurs suppléants (axe drag / matière / essaim) si l'on veut élargir au-delà de 7.

### Pièges d'implémentation transverses à anticiper (mon insistance)
- **Le flou animé tuera la perf** si on l'applique naïvement par item. Floue UNE couche de fond, jamais 40 éléments. Vrai pour Chambre noire, Dissipe, Brume, Marée basse.
- **`mix-blend-mode` + `mask-image` + `preserve-3d` empilés cassent sur Safari.** Tester Safari dès le proto pour Chambre noire, Faille, Couloir.
- **Le scroll-jacking est le risque UX n°1.** Normaliser les deltas, garder une évasion native, et faire de `useReducedMotion` un *vrai* repli plat et complet (pas une coquille vide) — le code existant montre déjà la bonne pratique.
- **Ne jamais sacrifier titre+auteur à l'effet.** C'est une galerie qui *célèbre des gens* : un overlay texte net, persistant, indépendant du filtre/voile, sur toutes les vues.
- **Décider tôt `Project.group?`** : c'est la décision la plus structurante (débloque le sens de 3-4 concepts) pour un coût trivial.
