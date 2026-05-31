# Wave 3 — Reverse Brainstorming (brainstorming inversé)

> **Agent** : 04-reverse · **Méthode** : Reverse Brainstorming · **Seed** : 3308
> **Mots aléatoires imposés** : labyrinthe · fumée · ascenseur · gravier · néon · papier calque
> **Brief** : galerie de projets finaux (lab OpenAI × université), CALME/PREMIUM, audacieux mais maîtrisé, INÉDIT, MIX scroll/drag/survol, desktop WOW + mobile correct, palette varie par vue, Inter seul, MUI v6 + Framer Motion v11 PUR.
> **Contrainte clé vidéo** : une seule `<video>` active à la fois ; la pluralité des participants doit être perçue d'emblée.
> **Patterns ancres à TRANSCENDER** : pile au scroll · coverflow piloté scroll · panneaux au survol.
> **Ne PAS rebâtir** : Grid, Bento, Masonry, JustifiedRows, EditorialList, Stack, MasonryParallax, HorizontalScroll, RevealOnScroll, ZoomScroll, Carousel, Coverflow, HoverExpand, SwipeDeck, SpotlightFocus, Book, Wheel, Lighthouse, MaterialAwaken, MagneticField, Confetti, Loom, Tuning.

---

## Étape 1 — Anti-idées : comment RATER complètement cette galerie ?

Objectif inversé : « rendons-la ennuyeuse, illisible, qui cache les participants, qui rame, qui ressemble à tout le monde, qui trahit le calme premium ». Je liste sans filtre.

| # | Anti-idée (le pire) |
|---|---|
| A1 | Tout afficher d'un bloc figé, rien ne bouge ni ne réagit au geste → mort, plat. |
| A2 | Une seule grande vidéo qui prend tout l'écran : on croit à UN projet, pas à un lab collectif. |
| A3 | Cacher les auteurs (juste des miniatures muettes, noms en hover seulement) → on célèbre personne. |
| A4 | Autoplay de 12 vidéos simultanées → ça rame, le ventilo hurle, c'est anxiogène (anti-calme). |
| A5 | Reprendre flèches-carrousel / parallaxe verticale cliché → « déjà vu mille fois ». |
| A6 | Un seul chemin linéaire imposé : flèche droite, flèche droite, flèche droite → aucune agence, aucune surprise. |
| A7 | Surcharge visuelle : néons clignotants, 8 couleurs, effets partout → criard, fatigant, pas premium. |
| A8 | Aucune profondeur : tout sur un seul plan Z, aucune hiérarchie → impossible de savoir où regarder. |
| A9 | Navigation labyrinthique GRATUITE : on se perd, on ne retrouve pas un projet, pas de carte mentale. |
| A10 | Transitions brutales / coupures sèches → cheap, casse le sentiment de matière premium. |
| A11 | Mobile = exactement le desktop rétréci → effets 3D illisibles, gestes impossibles, ça casse. |
| A12 | Ignorer `prefers-reduced-motion` → certains ont la nausée, d'autres voient une page morte. |
| A13 | Le survol révèle TOUT immédiatement → plus aucune tension, aucune récompense à explorer. |
| A14 | Densité uniforme : 40 tuiles identiques, même taille, même rythme → bouillie, aucun point d'entrée. |
| A15 | Effet « gadget » sans info : on joue 5 s puis on ne sait toujours pas QUI a fait QUOI. |
| A16 | Charger les 40 thumbnails + métadonnées au mount → écran blanc 4 s, abandon. |

---

## Étape 2 — Inversion de CHAQUE anti-idée en principe positif

| # | Inversion → principe positif |
|---|---|
| A1→P1 | **Vie au repos minimale, intensité au geste.** Une micro-respiration ambiante (lente), l'énergie se débloque au scroll/drag/survol. |
| A2→P2 | **La vidéo unique vit DANS une foule de pairs.** Le plein-cadre est toujours encadré/bordé par des fragments des autres projets. |
| A3→P3 | **Auteur = donnée de premier rang, toujours lisible**, intégrée typographiquement (Inter), jamais cachée derrière un hover. |
| A4→P4 | **Une seule `<video>` active**, le reste = posters statiques nets + indices de mouvement non-vidéo (transform, mask). |
| A5→P5 | **Geste continu signifiant**, pas de flèche ; le mouvement raconte la position dans la collection. |
| A6→P6 | **Liberté guidée** : plusieurs trajets possibles mais toujours une boussole (où suis-je / combien restent). |
| A7→P7 | **Une accent-couleur par vue, sobriété autour.** Le néon est un ACCENT rare, jamais le fond. |
| A8→P8 | **Profondeur intentionnelle** (axe Z = hiérarchie) : focus net devant, contexte flou/atténué derrière. |
| A9→P9 | **Topologie lisible** : si labyrinthe, alors labyrinthe AVEC plan/minimap et fil d'Ariane. |
| A10→P10 | **Transitions matières continues** (spring, masques, fondus de matière) — jamais de cut sec. |
| A11→P11 | **Repli mobile RÉINVENTÉ** par geste natif (swipe/tap), pas le desktop rétréci. |
| A12→P12 | **reduced-motion = première classe** : version calme équivalente, jamais une page morte. |
| A13→P13 | **Révélation progressive/graduée** : le survol dévoile par paliers, la récompense se mérite. |
| A14→P14 | **Rythme contrasté** : tailles/densités variées, points d'entrée évidents, vallées et pics. |
| A15→P15 | **Chaque interaction délivre de l'INFO** (titre + auteur + nature), le jeu sert la compréhension. |
| A16→P16 | **Apparition orchestrée et légère** : poster d'abord, vidéo à la demande, chargement progressif. |

---

## Étape 3 — Principes → leviers concepts (synthèse avant catalogue)

Trois familles de leviers émergent, et je les marie aux **6 mots aléatoires** :

- **Topologie spatiale lisible** (P6+P9) → métaphore **labyrinthe** plan-en-main, **ascenseur** vertical par étages.
- **Profondeur & matière** (P8+P10+P13) → **fumée** qui se dissipe pour révéler, **papier calque** translucide qui empile les pairs, **gravier** granulaire qui s'agrège.
- **Accent maîtrisé & info** (P3+P7+P15) → **néon** comme liseré d'accent rare + nom d'auteur toujours gravé.

Distillé wave3 respecté : **mouvement réactif au geste**, **profondeur/3D**, **révélation interactive** — sans redupliquer les 24 vues existantes.

---

## CATALOGUE DE CONCEPTS

---

### Concept 1 — « DISSIPE » (fumée)
**Accroche** : un brouillard premium recouvre la collection ; ton curseur/scroll est un souffle qui dissipe la fumée et révèle les projets dessous, net par net.

- **Mécanique cœur** :
  - Couche `mask-image` (radial-gradient) pilotée par un `useMotionValue` de position curseur (`onMouseMove` → `mvX/mvY` + `useSpring` lourd, stiffness ~80 damping ~30 pour la trainée « souffle »).
  - Le « masque de netteté » est un `radial-gradient` dont le centre suit le spring : sous le centre, `filter: blur(0)` + `opacity:1` ; autour, `filter: blur(8px)` + voile `backgroundColor` semi-opaque (la fumée).
  - Les tuiles dessous sont une **grille irrégulière dense** (positions figées) de posters ; seules celles « touchées » par le souffle gagnent netteté et liseré.
  - Au scroll, le souffle balaie automatiquement en bande horizontale (`useScroll` → `useTransform` sur la position X du masque) : exploration mains-libres.
  - Transition d'ouverture : `AnimatePresence` + `clip-path` qui se referme comme de la fumée qui reprend sa place.
- **Multiplicité** : dès le premier frame, on devine **des dizaines de cartes** sous le voile (silhouettes floues + grain) — la foule est visible avant même d'être nette. On ne révèle jamais une seule carte isolée : le souffle a un rayon qui touche toujours 3–6 voisins.
- **Vidéo** : la carte la PLUS nette (centre du souffle, au repos > 600 ms) monte sa `<video>` preview ; quitter la zone démonte la balise. Une seule active par construction (un seul centre de souffle).
- **Axe de navigation** : **MIX** — survol = souffle local ; scroll = balayage automatique ; clic carte nette = ouverture.
- **Palette** : **sombre** (anthracite/charbon) pour que la fumée claire (gris perle) et le **néon** d'accent du liseré net ressortent. Calme et théâtral.
- **Repli mobile / reduced-motion** : mobile = pas de curseur → le souffle suit le **scroll** (bande qui descend) + tap pour figer-révéler une zone. reduced-motion = pas de blur animé : on affiche tout net d'emblée en grille, le « souffle » devient un simple highlight de focus statique.
- **Pourquoi PAS un cliché banni + inédit** : ni carrousel, ni parallaxe, ni autoplay massif. Révélation par MASQUE de netteté (pas un simple fade RevealOnScroll, ici c'est un champ continu piloté au geste, granulaire). Différent de SpotlightFocus (qui éclaire) : ici on **dé-voile une matière**, la profondeur vient du flou-de-foule.
- **Risque/difficulté** : `filter: blur` animé est coûteux GPU → limiter le nb de cartes floutées simultanément (flouter une seule couche de fond, pas 40 éléments). Doser le voile pour ne pas frustrer (P13 vs lisibilité P15).

---

### Concept 2 — « PALIER » (ascenseur)
**Accroche** : la collection est un immeuble ; tu prends l'ascenseur et chaque ÉTAGE est un projet plein-cadre, mais les portes vitrées laissent voir les étages voisins défiler.

- **Mécanique cœur** :
  - Conteneur vertical `useScroll({ offset })` ; chaque étage = une section `100vh`. Un `useTransform` mappe le scroll → translation Y d'une **cabine** centrale (le cadre net) tandis que le **décor d'étages** défile à vitesse différente (deux plans Z, profondeur P8).
  - Un **indicateur d'étage** type ascenseur (numéro qui s'incrémente + barre verticale) piloté par `useTransform(scrollYProgress, …)` (boussole P6/P9).
  - Entre deux étages, un léger « passage » : les bords haut/bas montrent en `clip-path` le bas de l'étage suivant et le haut du précédent → on sent la **continuité verticale**, jamais un cut (P10).
  - `useSpring` sur la position cabine pour le ralenti feutré « arrivée d'étage » (snap doux, stiffness ~120 damping ~26).
- **Multiplicité** : le cadre actif est **bordé en haut ET en bas** par une tranche visible de l'étage voisin (autre projet, autre auteur) — on voit toujours au moins 3 projets superposés verticalement. Mini-plan latéral « tous les étages » (liste auteurs scrollable, P3).
- **Vidéo** : seul l'étage **centré** (cabine alignée) monte sa `<video>`. Au passage à l'étage suivant, l'ancienne se démonte avant que la nouvelle se monte (un seul `<video>` garanti par l'index actif unique).
- **Axe de navigation** : **scroll** principal (montée/descente = ascenseur), + clic sur un numéro d'étage = saut animé (`animate` vers l'offset).
- **Palette** : **claire** (blanc cassé/aluminium brossé, Apple premium) avec liseré **néon** discret sur l'indicateur d'étage actif. Sensation propre, institutionnelle, calme.
- **Repli mobile / reduced-motion** : mobile = scroll snap natif (`scroll-snap-type: y mandatory`) un étage par swipe, indicateur conservé. reduced-motion = saut instantané d'étage sans translation de décor, vidéo remplacée par poster + bouton lecture.
- **Pourquoi PAS un cliché banni + inédit** : ce n'est PAS la « pile au scroll » (pas d'empilement de cartes qui se chevauchent) ni un HorizontalScroll : c'est une **métaphore d'élévateur** avec deux plans de profondeur et boussole d'étage. La tranche voisine visible est la signature inédite.
- **Risque/difficulté** : le scroll-snap plein écran peut frustrer si trop rigide → garder un snap doux. Veiller à ne pas confondre avec un simple full-page scroller : la profondeur 2-plans + tranches voisines fait la différence.

---

### Concept 3 — « CALQUE » (papier calque)
**Accroche** : les projets sont des feuilles de papier calque empilées ; tu en fais glisser une et tu vois les pairs **transparaître** à travers, comme un atelier d'archi.

- **Mécanique cœur** :
  - Pile de feuilles semi-translucides (`opacity` ~0.55 + `mix-blend-mode: multiply` ou `screen` selon palette) légèrement décalées (offset X/Y croissant) → on voit **toute la pile transparaître** (P2/P8).
  - `drag="x"` sur la feuille du dessus : la glisser révèle la suivante dessous. `onDragEnd` → `animate` qui la fait soit revenir, soit partir et passer la suivante au-dessus (`zIndex` réordonné, `layout` pour le réagencement fluide).
  - Survol d'une feuille = elle gagne en opacité (`whileHover` → opacity 1, légère élévation `boxShadow`), les autres restent calque → révélation graduée (P13).
  - `layoutId` partagé entre la feuille empilée et sa version « plan de travail » étalée → transition continue quand on demande « tout voir » (réagencement en éventail via `layout`).
- **Multiplicité** : par essence, **toutes les feuilles sont visibles en simultané** (transparence), titres+auteurs lisibles en filigrane sur chaque calque (Inter, P3). Impossible de croire à un projet unique.
- **Vidéo** : seule la feuille **complètement opaque** (celle du dessus ou survolée stabilisée) monte sa `<video>`, vue « à travers » les calques au-dessus si re-empilée — mais une seule active.
- **Axe de navigation** : **drag** principal (faire glisser les feuilles) + survol pour densifier + clic = ouvrir.
- **Palette** : **claire** (papier ivoire, encre graphite) car le calque vit de la transparence sur fond clair ; accent **néon** comme « trait de stylo » de surlignage sur la feuille active. Atelier premium, calme.
- **Repli mobile / reduced-motion** : mobile = swipe pour défiler les calques (geste natif, pas de drag fin). reduced-motion = pas de glisse animée ; tap pour amener une feuille devant (changement de zIndex instantané), transparence conservée (statique, non animée).
- **Pourquoi PAS un cliché banni + inédit** : pas de flèches, pas de parallaxe. À distinguer de Stack (pile opaque) et SwipeDeck (cartes pleines) : ici la **transparence du calque** rend la pile entière lisible en permanence — la profondeur est faite de translucidité superposée, signature inédite. Pas d'autoplay (une seule vidéo).
- **Risque/difficulté** : `mix-blend-mode` + transparence peut nuire à la lisibilité du texte → garantir contraste suffisant des titres (encadré opaque local derrière le nom). Gérer le `zIndex`/`layout` reordering proprement.

---

### Concept 4 — « DÉDALE » (labyrinthe)
**Accroche** : un plan en vue de dessus où les projets sont des salles ; tu navigues de salle en salle, et une **minimap** te montre toujours où tu es dans la collection.

- **Mécanique cœur** :
  - Grand plan 2D (canvas DOM, pas WebGL) translaté via deux `useMotionValue` (panX/panY) avec `useSpring` ; `drag` sur le plan = se déplacer dans le dédale (déplacement de la « caméra »).
  - Chaque **salle** = une tuile-projet placée à coordonnées fixes reliées par des « couloirs » (simples traits CSS). En approchant le centre viewport d'une salle (`useTransform` distance → scale/opacity), elle **grandit et s'allume** (focus = salle où tu es).
  - **Minimap** persistante (coin) : réduction du plan + point « toi », pilotée par les mêmes MVs (boussole anti-perte, P9/P6). Fil d'Ariane = trace des salles visitées.
  - Transition d'entrée de salle : `clip-path` qui s'ouvre depuis la porte (continuité, P10).
- **Multiplicité** : la minimap montre d'emblée **la carte entière = N salles = N participants** ; le plan lui-même laisse voir les salles voisines au loin (atténuées). On comprend l'ampleur du lab instantanément.
- **Vidéo** : seule la salle **où la caméra est centrée** (la plus proche du viewport) monte sa `<video>` ; les voisines restent posters. Un seul centre → une seule vidéo.
- **Axe de navigation** : **drag** (déplacer la caméra) + clic minimap = se téléporter (`animate` panX/panY) + clic salle = ouvrir le projet. Mix complet.
- **Palette** : **sombre** (plan « blueprint » bleu nuit) avec couloirs et salle active en **néon** (cyan/magenta) — la métaphore plan-lumineux justifie le néon comme accent fonctionnel, pas décoratif. Premium, mystérieux mais maîtrisé par la minimap.
- **Repli mobile / reduced-motion** : mobile = pan par swipe + minimap tappable (téléportation), salles plus grandes (moins de zoom). reduced-motion = pas de glisse fluide ; navigation salle-à-salle par boutons directionnels/tap, scale d'entrée coupé. La minimap reste (lisibilité d'abord).
- **Pourquoi PAS un cliché banni + inédit** : c'est l'anti-thèse du chemin linéaire (A6) ET l'inversion du labyrinthe-frustrant (A9) grâce à la minimap. Rien d'équivalent dans l'existant (Wheel/Carousel sont 1D ; ici exploration 2D spatiale type interface-OS/musée). Pas de flèches, pas de parallaxe.
- **Risque/difficulté** : le plus risqué — peut désorienter si le plan est trop grand ou les distances mal calibrées. Mitigation : layout en grappe compacte, minimap toujours visible, snap doux vers la salle la plus proche au `dragEnd`. C'est le concept « audacieux » à valider tôt.

---

### Concept 5 — « GRAVIER » (gravier)
**Accroche** : des centaines de grains-vignettes éparpillés se **rassemblent et s'agrègent** sous ton geste pour former la tuile d'un projet, puis se dispersent.

- **Mécanique cœur** :
  - Les projets sont représentés au repos par des **amas de petits grains** (chaque grain = un fragment de poster, `mask`/`clip-path` morcelé) légèrement en mouvement brownien lent (anim ambiante minimale, P1).
  - Au survol/approche d'un amas : les grains **convergent** vers une grille via `useSpring` sur chaque grain (positions cibles dérivées par `useTransform` d'un MV « cohésion » 0→1), reconstituant le poster net + titre + auteur (révélation graduée P13/P15).
  - Au scroll, une « vague de cohésion » traverse l'écran : `useScroll` → `useTransform` déplace la zone où les grains s'agrègent (un amas s'assemble pendant que le précédent se reddisperse).
  - Dispersion = même spring en sens inverse, donnant la matière granulaire continue (P10).
- **Multiplicité** : même éparpillés, on voit **plusieurs amas distincts** = plusieurs projets ; le grain dense communique « beaucoup de monde ». Quand un se forme, les voisins amorcent leur forme (silhouette partielle) → pluralité permanente.
- **Vidéo** : seul l'amas **entièrement agrégé** (cohésion = 1) monte sa `<video>` dans le poster reconstitué ; la dispersion la démonte avant qu'un autre s'assemble. Une seule active (une seule cohésion=1 à la fois, garantie par l'index de vague).
- **Axe de navigation** : **MIX** — scroll = vague de cohésion automatique ; survol = forcer l'agrégation locale ; clic poster formé = ouvrir.
- **Palette** : **sombre** (grains clairs sur fond profond, comme du sable lumineux) ou **clair** (gravier sombre sur ivoire) — je choisis **sombre** pour maximiser la lisibilité des grains lumineux ; accent **néon** sur le contour de l'amas en cours d'agrégation. Calme (mouvement lent) mais spectaculaire.
- **Repli mobile / reduced-motion** : mobile = tap sur un amas pour l'agréger (pas de survol), moins de grains (perf). reduced-motion = pas d'animation de convergence ; les posters sont déjà formés, le « gravier » devient une texture statique décorative en fond. Jamais une page morte.
- **Pourquoi PAS un cliché banni + inédit** : aucun carrousel/flèche/parallaxe/autoplay massif. Le concept d'**agrégation particulaire en DOM/Framer pur** (pas WebGL) est inédit dans l'existant — proche philosophiquement de MaterialAwaken mais ici c'est de la **matière qui se compose/décompose**, pas un réveil de surface.
- **Risque/difficulté** : LE plus lourd en perf — animer 100+ grains via Framer peut ramer. Mitigation forte : grains peu nombreux par amas (12–20), un seul amas en transition à la fois, `will-change: transform`, désactivation auto si beaucoup de projets. À prototyper perf-first.

---

### Concept 6 — « LISIÈRE » (néon + papier calque, hybride sobre)
**Accroche** : une bande-frise horizontale calme où le projet focal s'épanouit plein-cadre, **liseré de néon**, tandis que ses voisins restent en calque atténué de part et d'autre — éditorial premium.

- **Mécanique cœur** :
  - Ruban horizontal `useScroll` (axis x via wheel→x mapping ou `drag="x"`). Position continue (`useMotionValue`) façon coverflow MAIS **sans rotation 3D** : ici le focal s'**élargit** (largeur `useTransform`) et gagne un **liseré néon animé** (box-shadow/`filter: drop-shadow` pulsant lent), les voisins rétrécissent en bandes-calque verticales (opacity réduite, P2/P8).
  - Le focal affiche titre + auteur en grand (typo éditoriale Inter, P3) ; les bandes voisines montrent juste le nom d'auteur vertical → on lit la collection comme un **sommaire de magazine** (P14 rythme).
  - Transition focal→focal : `useSpring` doux + le liseré néon se « déplace » du sortant vers l'entrant (continuité de l'accent, P10).
- **Multiplicité** : à tout instant, **un focal large + 4–8 bandes-voisines nommées** visibles → la pluralité est lue comme un index éditorial. Jamais une vidéo isolée.
- **Vidéo** : seul le focal large monte sa `<video>` (poster→vidéo après stabilisation > 400 ms) ; changer de focal démonte/remonte. Une seule active par construction.
- **Axe de navigation** : **scroll/drag horizontal** (mix molette + drag) + clic bande voisine = la promouvoir focal (`animate`) + clic focal = ouvrir.
- **Palette** : **sombre éditoriale** (noir doux, texte ivoire) pour que le **néon** d'accent du focal soit le seul point chaud — sobriété autour, audace ponctuelle. Très premium, magazine de nuit.
- **Repli mobile / reduced-motion** : mobile = swipe horizontal (snap par projet), voisins réduits à 2 bandes. reduced-motion = pas de pulsation néon ni d'élargissement animé ; changement de focal instantané, liseré statique. Lisible et calme.
- **Pourquoi PAS un cliché banni + inédit** : explicitement SANS flèches (geste continu), SANS 3D coverflow (c'est l'ancre qu'on transcende → on remplace la rotation par l'**élargissement + liseré néon + bandes-calque nommées**), SANS parallaxe. Distinct de Coverflow (pas de rotateY), d'EditorialList (vertical/statique) et de HoverExpand (ici piloté scroll, axe horizontal, accent néon signature).
- **Risque/difficulté** : risque de « ressembler à un coverflow déguisé » → bien assumer le parti-pris 2D + l'accent néon + les noms verticaux comme différenciateurs. drop-shadow animé à doser (perf + calme).

---

## CLASSEMENT (du plus prometteur au plus risqué)

1. **DISSIPE (fumée)** — le plus WOW immédiat + le plus original (révélation par masque de netteté), mobile/reduced-motion gérables, perf maîtrisable si on floute une seule couche. Meilleur ratio inédit/faisabilité.
2. **CALQUE (papier calque)** — pluralité parfaite (tout transparaît), métaphore atelier premium, perf légère (pas de blur lourd), `layoutId` propre. Très « lab/recherche ».
3. **LISIÈRE (néon)** — premium éditorial sûr, transcende proprement le coverflow, faible risque. Un cran moins inédit (proche de l'ancre).
4. **PALIER (ascenseur)** — métaphore claire et calme, boussole native ; risque de paraître « full-page scroller » s'il manque de profondeur. Solide mais moins surprenant.
5. **GRAVIER (gravier)** — visuellement le plus spectaculaire/inédit MAIS le plus risqué en perf (particules DOM). À prototyper perf-first avant d'investir.
6. **DÉDALE (labyrinthe)** — le plus audacieux et le plus « interface-OS/musée », mais le plus fort risque de désorientation et de complexité d'implémentation. Pépite ou piège selon calibrage minimap.

**TOP 2 retenu** : **DISSIPE** (#1) et **CALQUE** (#2).

---

## Hypothèses & questions ouvertes

- **Hypothèse données** : `Project` fournit `thumbnail` (poster), `previewVideo?`, `author`, `title`, `kind`, `href`, et `width/height` (ratio connu sans préchargement) — confirmé via `src/types.ts`. Les concepts s'appuient sur le pattern `ProjectTile` existant (prop `as`, `overlayTitle`, `onActivate`) vu dans `CoverflowView`.
- **Hypothèse volume** : ~12–40 projets. GRAVIER et DISSIPE doivent dégrader gracieusement (moins de grains / floue une seule couche) au-delà de ~24.
- **Hypothèse perf** : tous les concepts utilisent **une seule `<video>`** montée sur l'élément focal et démontée au changement (cohérent avec le commentaire `previewVideo` du type).
- **Q1** : la pluralité « visible d'emblée » peut-elle reposer sur des silhouettes/posters flous (DISSIPE) ou exige-t-on que des titres/auteurs soient lisibles dès le repos ? (impacte DISSIPE et GRAVIER).
- **Q2** : tolérance à la désorientation pour DÉDALE — la minimap suffit-elle, ou faut-il un mode « tout voir » (grille) en repli ? (le `layoutId` rendrait la transition élégante).
- **Q3** : le **néon** doit-il varier de teinte par vue (palette varie par vue) ou rester un accent neutre par concept ? J'ai supposé une teinte par vue.
- **Q4** : `mix-blend-mode` (CALQUE) est-il acceptable côté lisibilité d'accessibilité, ou faut-il un fallback opacité simple ? J'ai prévu un encadré opaque local derrière chaque nom.
- **Note méthode** : les 6 mots aléatoires sont chacun le NOYAU d'un concept (fumée→DISSIPE, ascenseur→PALIER, papier calque→CALQUE, labyrinthe→DÉDALE, gravier→GRAVIER, néon→LISIÈRE + accent transverse), donc 100 % injectés et justifiés.
