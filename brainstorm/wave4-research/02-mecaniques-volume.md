# Wave 4 — Recherche 2 : mécaniques inédites EN VOLUME

Catalogue documenté de mécaniques d'interaction / galerie **réelles** (sources URL),
filtrées par faisabilité **React + TS + MUI v6 + Framer Motion v11 PUR**
(pas de WebGL / Three.js / Swiper / Embla / Lenis / GSAP / Tailwind / lucide / nouvelle dépendance).

> **Lecture rapide.** 38 mécaniques, regroupées par familles. ⭐ = mes ~10 plus prometteuses.
> Faisabilité notée /5 (5 = trivial en Framer pur, 1 = limite, demande de la finesse).
> « Multiplicité » = comment la mécanique fait percevoir IMMÉDIATEMENT qu'il y a plusieurs participants.
> Contrainte transverse respectée partout : **une seule `<video>` active à la fois** (carte centrée/active/la plus proche du curseur).

Rappel anti-doublon (déjà dans le projet, ~35 vues) : Grid, Bento, Masonry, JustifiedRows, EditorialList, Stack,
MasonryParallax, HorizontalScroll, RevealOnScroll, ZoomScroll, Carousel, Coverflow, HoverExpand, SwipeDeck,
SpotlightFocus, Book, Wheel, Lighthouse, MaterialAwaken, MagneticField, Confetti, Loom, Tuning, Chambre noire,
Couloir, Sillon, Constellation, Tiroirs, Marée basse, Racine, Dissipe, Calque, Faille, Métronome.

---

## Famille A — Espace navigable & cartographie (l'utilisateur se déplace DANS l'œuvre)

### A1 ⭐ Plan infini draggable (Infinite Canvas)
- **1 phrase** : un plan 2D que l'on attrape et fait glisser librement (X/Y), les tuiles s'étendent au-delà de l'écran ; on « explore » plutôt qu'on « scrolle ».
- **Source** : Codrops « Infinite Canvas: Building a Seamless, Pan-Anywhere Image Space » <https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/> ; Awwwards « Infinite canvas gallery navigation — CUSP » <https://www.awwwards.com/inspiration/infinite-canvas-gallery-navigation-cusp>
- **Axe** : drag (pan), molette = zoom optionnel.
- **Multiplicité** : on voit beaucoup de tuiles d'un coup, dispersées dans un grand espace — sensation d'archive vaste = beaucoup de participants.
- **Faisabilité** : 4/5 — `drag` + `dragMomentum` sur un `motion.div` géant, `useMotionValue` x/y, repli mobile = pan tactile natif. Pas besoin de répétition infinie réelle : bornes douces (`dragConstraints` + `dragElastic`).
- **Diffère de l'existant** : ni grid statique, ni horizontal-scroll 1D. Navigation **libre 2D** que rien dans le projet ne propose.

### A2 ⭐ Mini-map + survol « loupe géante »
- **1 phrase** : un overlay plein écran prévisualise le projet survolé comme une énorme info-bulle, une mini-carte indiquant la position du curseur dans la grille.
- **Source** : Codrops « hover preview with mini map » (giant tooltip + mini map) — tag hover <https://tympanus.net/codrops/tag/hover/>
- **Axe** : survol (desktop), tap (mobile).
- **Multiplicité** : la mini-map montre TOUTES les tuiles condensées pendant qu'on en inspecte une — densité visible en permanence.
- **Faisabilité** : 4/5 — `AnimatePresence` pour l'overlay, `useMotionValue` pour le point de la mini-map.
- **Diffère de l'existant** : Spotlight/HoverExpand agrandissent in-situ ; ici on ajoute une **carte de repérage** persistante, mécanique de navigation, pas juste un agrandissement.

### A3 Vue « table lumineuse » zoomable (zoom-to-fit)
- **1 phrase** : toutes les tuiles posées sur une table ; un clic zoome en douceur vers une tuile (transform-origin sur la cible) puis dézoome.
- **Source** : freefrontend « 65 CSS Perspective Examples » (zoom-into-item) <https://freefrontend.com/css-perspective/> ; principe « inverse transform zoom » vu sur les coverflow 3D.
- **Axe** : clic (zoom), molette/pinch (échelle globale).
- **Multiplicité** : vue d'ensemble dézoomée = mosaïque complète ; le zoom isole sans perdre le contexte.
- **Faisabilité** : 4/5 — `scale`/`x`/`y` calculés vers la cible via `animate()`, `transformOrigin`.
- **Diffère de l'existant** : ZoomScroll lie le zoom au scroll ; ici le zoom est **dirigé** (on choisit la cible), interaction point-and-zoom.

### A4 Boussole / radar orbital
- **1 phrase** : les tuiles tournent autour d'un centre comme des satellites ; cliquer un satellite fait pivoter l'anneau pour l'amener au centre (avec dépassement ressort).
- **Source** : CodeFronts « orbital » circular menus <https://codefronts.com/navigation/css-circular-menus/> ; Awwwards « Circular navigation » <https://www.awwwards.com/inspiration/circular-navigation>
- **Axe** : clic / drag rotatif.
- **Multiplicité** : tous les participants visibles simultanément en couronne.
- **Faisabilité** : 3/5 — trigo de placement + `rotate` animé ; attention accessibilité clavier.
- **Diffère de l'existant** : Wheel/Constellation existent — celle-ci est une **couronne orbitale dirigée** (snap au centre), distincte de la roue verticale et du nuage libre. À valider contre Wheel/Constellation avant prod.

---

## Famille B — Curseur comme outil (mécaniques pilotées par la souris)

### B1 ⭐ Traînée d'images (Image Trail)
- **1 phrase** : en bougeant la souris, une traînée de vignettes (projets aléatoires) apparaît le long du tracé puis s'efface (scale+fade / « drop » / « squeeze »).
- **Source** : Codrops « Image Trail Effects » <https://tympanus.net/codrops/2019/08/07/image-trail-effects/> + repo <https://github.com/codrops/ImageTrailEffects>
- **Axe** : mouvement souris (la vitesse cadence l'apparition).
- **Multiplicité** : chaque vignette de la traînée est un participant différent → on en voit défiler des dizaines en quelques secondes.
- **Faisabilité** : 4/5 — file d'éléments `AnimatePresence`, `useMotionValueEvent` sur le pointeur + seuil de distance ; variantes scale/drop/squeeze = variants Framer. Mobile : repli en grille (pas de souris).
- **Diffère de l'existant** : aucune vue du projet n'utilise une **traînée éphémère** ; mécanique ludique et signature.

### B2 Tampon / planche-contact à révéler au curseur (variante encre)
- **1 phrase** : grille volontairement « pâle/non-développée » ; le curseur agit comme un tampon encreur qui révèle une zone (mask radial qui suit la souris).
- **Source** : Frontend Masters « CSS Spotlight Effect » <https://frontendmasters.com/blog/css-spotlight-effect/> ; freefrontend « 58 CSS mask Examples » <https://freefrontend.com/css-mask-examples/>
- **Axe** : mouvement souris.
- **Multiplicité** : la révélation balaye plusieurs tuiles à la fois.
- **Faisabilité** : 4/5 — `mask-image: radial-gradient(... at X Y)` piloté par `useSpring`.
- **Diffère de l'existant** : ⚠️ **proche de « Chambre noire » (Darkroom)** qui fait déjà négatif→positif sous masque radial, et de Lighthouse (faisceau). À ne retenir que si la métaphore change radicalement (ex. masque par tuile, forme non-circulaire, bleed d'encre) — sinon **redondant**, à écarter.

### B3 ⭐ Tuiles aimantées au pointeur en 3D (grid tilt collectif)
- **1 phrase** : la grille entière s'incline vers le curseur (perspective partagée) et chaque tuile fait un léger parallaxe de profondeur (translateZ sur titre/média).
- **Source** : CodePen « 3D Mousemove Animation Tilt Hover Effect » <https://codepen.io/jsonc/pen/zYKgZgM> ; « Magic Mouse Card Tilt Effect » <https://codepen.io/flatypus/pen/wvOvBZK> ; Smashing « Fancy CSS 3D Effects For Images » <https://www.smashingmagazine.com/2023/07/shines-perspective-rotations-css-3d-effects-images/>
- **Axe** : mouvement souris (orientation globale).
- **Multiplicité** : toute la grille bouge ensemble = on sent un panneau peuplé de nombreux projets.
- **Faisabilité** : 5/5 — `perspective` sur le parent, `rotateX/rotateY` mappés via `useTransform(pointer)`, `translateZ` sur sous-couches ; CSS 3D pur.
- **Diffère de l'existant** : MagneticField attire des tuiles individuelles ; ici c'est un **panneau rigide incliné** en 3D, ressenti tout autre (profondeur de scène, pas attraction locale).

### B4 Décollement de coin (peel)
- **1 phrase** : au survol, le coin d'une tuile se soulève comme un autocollant et laisse entrevoir la vidéo / le détail dessous (rotate3d sur pseudo-pli).
- **Source** : Codrops « PFold: Paper-Like Unfolding Effect » <https://tympanus.net/codrops/2012/10/17/pfold-paper-like-unfolding-effect/> ; « 33 CSS Paper Effects » <https://freefrontend.com/css-paper-effects/>
- **Axe** : survol / focus.
- **Multiplicité** : effet par-tuile, lisible sur une grille dense.
- **Faisabilité** : 4/5 — clip-path triangulaire + `rotate3d` + ombre portée animée.
- **Diffère de l'existant** : micro-interaction de matière inédite ; ni l'élévation HoverExpand ni la lecture vidéo simple.

---

## Famille C — Pliage, matière & 3D physique (CSS 3D preserve-3d)

### C1 ⭐ Accordéon-stores (volets verticaux qui s'ouvrent)
- **1 phrase** : projets en bandes verticales serrées (comme des stores) ; survoler/cliquer une bande l'élargit en grand pendant que les autres se compriment.
- **Source** : freefrontend « 10 Pure CSS Horizontal Accordions » <https://freefrontend.com/css-horizontal-accordions/> ; Awwwards « Vertical Accordion — OSI » <https://www.awwwards.com/inspiration/vertical-accordion-osi> ; technique `:has()` expanding gallery (sliderrevolution) <https://www.sliderrevolution.com/resources/css-accordion/>
- **Axe** : survol (desktop) / tap (mobile).
- **Multiplicité** : N bandes côte à côte = N participants comptables d'un coup d'œil ; titres verticaux deviennent horizontaux à l'ouverture.
- **Faisabilité** : 5/5 — `flex` + `layout` Framer sur la largeur, ou `grid-template-columns` animé ; spring sur les flex-grow.
- **Diffère de l'existant** : HoverExpand agrandit une cellule de grille ; ici c'est une **rangée de lames plein-hauteur** (métaphore store/persienne), densité et ressenti différents.

### C2 ⭐ Pliage origami / dépliage de panneau
- **1 phrase** : une tuile cliquée se déplie en 3D (accordéon de plis) pour révéler le détail, comme un dépliant qui s'ouvre.
- **Source** : Codrops « PFold » <https://tympanus.net/codrops/2012/10/17/pfold-paper-like-unfolding-effect/> ; OriDomi <http://oridomi.com/> ; Josh Comeau « Folding the DOM » <https://www.joshwcomeau.com/react/folding-the-dom/>
- **Axe** : clic (ouvre/ferme).
- **Multiplicité** : la grille fermée reste lisible, le dépliage isole un projet sans quitter la page.
- **Faisabilité** : 3/5 — segments en `preserve-3d`, `rotateY` séquencés via variants `staggerChildren` ; soigner le raccord visuel des plis.
- **Diffère de l'existant** : Book tourne des pages, Faille fend ; le **pliage multi-segments** est une matière nouvelle.

### C3 Bloc-volume 3D (tuiles avec épaisseur, dé/cube)
- **1 phrase** : chaque tuile est un petit volume (faces translateZ) ; on tourne le cube pour passer thumbnail → détail → vidéo sur des faces différentes.
- **Source** : freefrontend « 65 CSS Perspective Examples » (Direction-Aware 3D Cube Gallery, cube faces) <https://freefrontend.com/css-perspective/>
- **Axe** : clic / drag rotatif sur la tuile.
- **Multiplicité** : grille de cubes = matière dense et tactile.
- **Faisabilité** : 3/5 — `preserve-3d` + 4 faces, `rotateY` ; coût visuel si beaucoup de cubes.
- **Diffère de l'existant** : aucune vue ne donne d'**épaisseur** aux tuiles (toutes plates) ; volume = signature.

### C4 Flip-cards en damier (révélation par retournement séquencé)
- **1 phrase** : au scroll/au hover, les tuiles se retournent (rotateY 180°) en vague de damier pour révéler le média.
- **Source** : CodePen « 3D perspective Flip Card » <https://codepen.io/csanchezriballo/pen/GpORbb> ; freefrontend perspective list <https://freefrontend.com/css-perspective/>
- **Axe** : scroll (vague) ou survol.
- **Multiplicité** : la vague traverse beaucoup de tuiles = sentiment de quantité.
- **Faisabilité** : 5/5 — `rotateY` + `preserve-3d`, stagger via index ou `whileInView`.
- **Diffère de l'existant** : MaterialAwaken réveille/anime ; le **flip recto-verso** (face thumbnail / face infos) est une mécanique distincte.

---

## Famille D — Scroll signature (scroll = moteur d'animation)

### D1 ⭐ Layout-formation / assemblage épinglé au scroll
- **1 phrase** : la section est « pinnée » et les tuiles, d'abord éparpillées, **s'assemblent** progressivement dans leur grille finale au fil du scroll.
- **Source** : Codrops « Exploration of On-Scroll Layout Formations » <https://tympanus.net/codrops/2024/09/18/exploration-of-on-scroll-layout-formations/> ; Codrops « Sticky Grid Scroll » <https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/>
- **Axe** : scroll (sticky + progress).
- **Multiplicité** : on VOIT les pièces converger en une mosaïque dense — la formation elle-même raconte « il y en a beaucoup ».
- **Faisabilité** : 4/5 — `position: sticky` + `useScroll({offset})` + `useTransform` du progress vers x/y/rotate/scale de chaque tuile. Pas de pin JS « hijack », on s'appuie sur le sticky natif.
- **Diffère de l'existant** : RevealOnScroll fait apparaître ; ici les tuiles **se déplacent depuis des positions dispersées vers une grille** (chorégraphie d'assemblage), pas un simple fade-in.

### D2 ⭐ Grille élastique (colonnes à inertie différenciée)
- **1 phrase** : au scroll, les colonnes centrales suivent vite et les colonnes de bord traînent → la grille « respire » avec un ressenti élastique/physique.
- **Source** : Codrops « Elastic Grid Scroll » <https://tympanus.net/codrops/2025/06/03/elastic-grid-scroll-creating-lag-based-layout-animations-with-gsap-scrollsmoother/> + démo <https://tympanus.net/Tutorials/ElasticGridScroll/index.html>
- **Axe** : scroll.
- **Multiplicité** : la déformation parcourt toute la largeur, donc toutes les colonnes/participants à la fois.
- **Faisabilité** : 4/5 — `useScroll` + `useSpring` avec stiffness/damping **différents par colonne**, `useTransform` vers `y`. Pur Framer, sans ScrollSmoother.
- **Diffère de l'existant** : MasonryParallax fait du parallaxe linéaire constant ; ici c'est un **lag à ressort différencié** (overshoot, rattrapage) — sensation matière vs simple vitesse.

### D3 Cartes qui s'empilent en sticky (stacking deck)
- **1 phrase** : au scroll, chaque grand panneau-projet devient sticky et le suivant vient se poser par-dessus, formant une pile.
- **Source** : Awwwards « Stacking cards on scroll — Netgiro » <https://www.awwwards.com/inspiration/stacking-cards-on-scroll-netgiro> ; CSS-Tricks « Stacked Cards with Sticky Positioning » <https://css-tricks.com/stacked-cards-with-sticky-positioning-and-a-dash-of-sass/>
- **Axe** : scroll.
- **Multiplicité** : la pile qui grossit = compteur visuel de projets.
- **Faisabilité** : 5/5 — `position: sticky; top` décalé + léger `scale`/`rotate` du dessous via `useScroll`.
- **Diffère de l'existant** : Stack existe (pile statique manipulable) — ici c'est une **pile pilotée par le scroll** (les cartes se déposent en lisant). Vérifier contre Stack avant prod ; possiblement une variante « scroll » de Stack plutôt qu'une vue neuve.

### D4 Texte de fond qui révèle (kinetic type → image)
- **1 phrase** : de grands mots/typographie en fond qui, au scroll, s'avancent et « ouvrent » sur le projet (les lettres passent au premier plan et révèlent un niveau de contenu).
- **Source** : Codrops « Kinetic Typography Page Transition » <https://tympanus.net/codrops/2021/09/29/kinetic-typography-page-transition/> ; « On-Scroll Letter Animations » <https://tympanus.net/codrops/2021/01/20/on-scroll-letter-animations/>
- **Axe** : scroll (ou clic sur un mot).
- **Multiplicité** : chaque mot = un projet ; un index typographique géant.
- **Faisabilité** : 3/5 — `useTransform` scale/letter-spacing + `mask`/`mix-blend-mode` pour révéler l'image sous le texte ; soigner la lisibilité.
- **Diffère de l'existant** : EditorialList est une liste sobre ; ici la **typo elle-même est l'interface** (lettres-portails), audacieux et calme si bien tenu.

### D5 Reveal par clip-path en bandes (wipe vertical plein écran)
- **1 phrase** : un projet à la fois en plein écran ; le scroll/snap déclenche un « wipe » par `clip-path`/`mask` qui dévoile le suivant en bandes.
- **Source** : Awwwards « Fullscreen Vertical Scroll Fade Slideshow » <https://www.awwwards.com/inspiration/fullscreen-vertical-scroll-fade-slideshow> ; CSS-Tricks scroll-snap ; SliderRevolution « CSS Page Transitions » <https://www.sliderrevolution.com/resources/css-page-transitions/>
- **Axe** : scroll-snap vertical.
- **Multiplicité** : compteur/progress « 03 / 24 » + miniatures latérales pour rappeler le volume.
- **Faisabilité** : 5/5 — `scroll-snap-type: y mandatory` + `clip-path`/`mask` animés via `useScroll` ; vidéo unique = celle de la section snappée.
- **Diffère de l'existant** : HorizontalScroll/Coverflow montrent plusieurs items ; ici **un seul plein écran** avec transition wipe maîtrisée. À distinguer de SpotlightFocus (qui garde le contexte de grille).

---

## Famille E — Composition libre, archive & matière éditoriale

### E1 ⭐ Pinboard / moodboard draggable (collage)
- **1 phrase** : tuiles disposées en collage légèrement désordonné (rotations, chevauchements, « scotch »), déplaçables par l'utilisateur.
- **Source** : Milanote moodboard <https://milanote.com/product/moodboarding> ; TurboCollage scrapbook/freeform <https://github.com/TurboCollage> ; Awwwards portfolio collage (collections) <https://www.awwwards.com/awwwards/collections/image-gallery-and-slideshows/>
- **Axe** : drag (réarrangement), survol pour la vidéo.
- **Multiplicité** : la dispersion + chevauchements = « mur de projets » habité, très humain.
- **Faisabilité** : 4/5 — `drag` par tuile, `dragConstraints` au conteneur, rotations aléatoires seedées ; z-index au focus.
- **Diffère de l'existant** : ni Bento/Masonry (alignés) ni Constellation (points reliés) — ici **chaos organisé tactile** (table d'atelier).

### E2 ⭐ Planche-contact / contact sheet (film argentique)
- **1 phrase** : grille dense type planche-contact 35 mm (cadres + numéros + perfos de pellicule) ; survol = loupe qui agrandit une vignette in-situ.
- **Source** : Awwwards Galleries & Slideshows collection <https://www.awwwards.com/awwwards/collections/image-gallery-and-slideshows/> ; métaphore filmstrip (Final Cut / Envato film strip) <https://elements.envato.com/graphic-templates/film+strip>
- **Axe** : survol (loupe) + scroll.
- **Multiplicité** : une planche montre 20–40 vignettes d'un coup → multiplicité maximale et lisible.
- **Faisabilité** : 5/5 — CSS pur pour cadres/perfos (pseudo-éléments), `scale` au hover, `filter` sépia/contrast en option.
- **Diffère de l'existant** : Grid est neutre ; la planche-contact apporte une **identité photo-lab** (cadres, numérotation, perfos) et une loupe — calme, premium, narratif.

### E3 Marquee croisé (rangées à contre-sens)
- **1 phrase** : plusieurs rangées d'images défilant en boucle, à vitesses et sens opposés ; survoler ralentit/fige la rangée.
- **Source** : Awwwards « Scrolling Photo Marquee — Trident » <https://www.awwwards.com/inspiration/scrolling-photo-marquee-trident> ; « Infinite Horizontal Scroll — Ruba » <https://www.awwwards.com/inspiration/infinite-horizontal-scroll-ruba>
- **Axe** : auto (boucle) + survol pour figer + drag pour pousser.
- **Multiplicité** : le flux continu donne l'impression d'un catalogue sans fin.
- **Faisabilité** : 5/5 — `animate()` en boucle sur `x` (duplication du contenu), `useAnimationFrame` non requis ; pause au hover. Vidéo = rangée/tuile survolée.
- **Diffère de l'existant** : HorizontalScroll est piloté par l'utilisateur sur 1 axe ; ici **auto-défilement multi-rangées à contre-sens** (mouvement perpétuel), ambiance vivante.

### E4 Index typographique → reveal image au survol (liste premium)
- **1 phrase** : liste de noms de projets ; survoler une ligne affiche une grande image qui suit le curseur, et inverse la typo.
- **Source** : Awwwards « List image hover » <https://www.awwwards.com/inspiration/list-image-hover> ; « Project index portfolio » <https://www.awwwards.com/inspiration/project-index-portfolio> ; Codrops « Image Reveal Hover Effects » <https://tympanus.net/codrops/2018/11/27/image-reveal-hover-effects/>
- **Axe** : survol.
- **Multiplicité** : la liste affiche TOUS les titres d'emblée ; l'image au survol confirme.
- **Faisabilité** : 5/5 — `AnimatePresence` + `useMotionValue` pour suivre le curseur, `clip-path` reveal.
- **Diffère de l'existant** : EditorialList affiche médias inline ; ici **liste pure + aperçu flottant** (mécanique « index » d'agence). À border pour ne pas recouper EditorialList.

### E5 Tas / pile physique à étaler (spread the pile)
- **1 phrase** : les tuiles arrivent en tas désordonné au centre ; un geste (drag/clic) les étale en éventail ou en grille.
- **Source** : Codrops « Image Trail/grid » + principe « scattered → assembled » des layout formations <https://tympanus.net/codrops/2024/09/18/exploration-of-on-scroll-layout-formations/>
- **Axe** : clic/drag (étaler/regrouper).
- **Multiplicité** : le tas = volume tangible, l'étalement révèle le nombre.
- **Faisabilité** : 4/5 — `layout`/`layoutId` entre état « tas » (positions seedées) et état « grille », `AnimatePresence`.
- **Diffère de l'existant** : SwipeDeck jette une carte à la fois ; ici on **manipule la masse entière** (tas ↔ étalé).

---

## Famille F — Profondeur, focus & atmosphère

### F1 ⭐ Profondeur de champ (depth of field au pointeur)
- **1 phrase** : tuiles réparties sur plusieurs plans Z ; ce qui est « hors plan focal » est flou (`filter: blur`), le plan focal suit le curseur/scroll et devient net.
- **Source** : Codrops « Atmospheric Depth Gallery » (concept) <https://tympanus.net/Tutorials/DepthGallery/> ; Codrops « Simulating Depth of Field » <https://tympanus.net/codrops/2019/10/01/simulating-depth-of-field-with-particles-using-the-blurry-library/>
- **Axe** : mouvement souris ou scroll (déplace le plan focal).
- **Multiplicité** : plusieurs plans peuplés = beaucoup de tuiles en profondeur.
- **Faisabilité** : 4/5 — `translateZ` + `scale` par plan, `filter: blur()` interpolé selon la distance au plan focal via `useTransform`. Limiter le nombre d'éléments floutés (coût GPU CSS).
- **Diffère de l'existant** : Calque superpose, MasonryParallax décale ; ici **mise au point optique** (net/flou) comme variable d'interaction — neuf.

### F2 Brume / dévoilement atmosphérique au scroll
- **1 phrase** : les tuiles émergent d'un voile (gradient/`mask` + `filter: brightness/contrast`) à mesure qu'on s'en approche, comme sortant du brouillard.
- **Source** : Codrops « Atmospheric Depth Gallery » <https://tympanus.net/Tutorials/DepthGallery/> ; tag blur <https://tympanus.net/codrops/tag/blur/>
- **Axe** : scroll / proximité.
- **Multiplicité** : succession de plans qui émergent = profondeur peuplée.
- **Faisabilité** : 4/5 — `mask-image` linéaire + `filter` animés par `whileInView`/`useScroll`.
- **Diffère de l'existant** : Dissipe disperse, Marée basse découvre — ⚠️ proximité conceptuelle avec « Marée basse » (révélation). À ne retenir que si la métaphore (brume verticale vs marée horizontale) reste nettement distincte.

### F3 Verre dépoli / panneaux translucides (frosted layers)
- **1 phrase** : tuiles derrière des panneaux en verre dépoli (`backdrop-filter: blur`) ; survoler « essuie » le verre localement pour révéler la nette.
- **Source** : freefrontend masks/blur <https://freefrontend.com/css-mask-examples/> ; Smashing CSS image effects <https://www.smashingmagazine.com/2023/07/shines-perspective-rotations-css-3d-effects-images/>
- **Axe** : survol.
- **Multiplicité** : mur de panneaux dépolis = grille dense, mystère premium.
- **Faisabilité** : 3/5 — `backdrop-filter` (support correct) + `mask` radial au survol ; tester perf si beaucoup de panneaux.
- **Diffère de l'existant** : aucune vue n'utilise le **verre dépoli interactif** ; texture matérielle nouvelle.

---

## Famille G — Transitions partagées & morphing (layoutId)

### G1 ⭐ Morph grille → fiche (shared element / FLIP)
- **1 phrase** : cliquer une tuile la fait **grandir en continu** jusqu'à une fiche plein écran (la même image se transforme), retour inverse à la fermeture.
- **Source** : Codrops « Animating Responsive Grid Layout Transitions with GSAP Flip » <https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/> ; repo « GridLayoutAnimation » (Flip) <https://github.com/codrops/GridLayoutAnimation>
- **Axe** : clic (ouvre la fiche).
- **Multiplicité** : on part TOUJOURS de la grille complète → le contexte « plusieurs projets » est permanent.
- **Faisabilité** : 5/5 — c'est exactement `layoutId` + `AnimatePresence` de Framer (FLIP natif). Très robuste.
- **Diffère de l'existant** : aucune vue ne fait de **transition d'élément partagé** vers un détail ; mécanique premium par excellence, et c'est le point fort de Framer.

### G2 Expansion par clip-path (carte → carte large)
- **1 phrase** : une carte s'agrandit via une forme `clip-path` qui se déploie (cercle/polygone) plutôt qu'un simple scale.
- **Source** : Codrops « Card Expansion Effect with SVG clipPath » <https://tympanus.net/codrops/2015/06/18/card-expansion-effect-svg-clippath/>
- **Axe** : clic.
- **Multiplicité** : grille préservée autour.
- **Faisabilité** : 4/5 — `clip-path` animé (`circle()`/`inset()`/`polygon()`) via `animate`.
- **Diffère de l'existant** : variante « forme » de l'ouverture, distincte du morph G1 (échelle) — découpe géométrique signature.

### G3 Transition « rideau » entre vues (page wipe)
- **1 phrase** : changer de projet/section déclenche un rideau (`mask`/SVG path) qui balaie l'écran et révèle la suite.
- **Source** : Codrops « Morphing Page Transition » <https://tympanus.net/codrops/2017/08/08/morphing-page-transition/> ; « How to Create a Cover Page Transition » <https://tympanus.net/codrops/2022/07/06/how-to-create-a-cover-page-transition/>
- **Axe** : clic / navigation.
- **Multiplicité** : transition de liaison entre projets, renforce la continuité du catalogue.
- **Faisabilité** : 4/5 — overlay `clip-path`/`pathLength` SVG via `AnimatePresence`.
- **Diffère de l'existant** : c'est une **couche de transition** réutilisable plutôt qu'une vue ; complète bien D5/G1.

---

## Famille H — Vie autonome & génératif (le contenu bouge seul)

### H1 ⭐ Dérive lente / flottaison (ambient drift)
- **1 phrase** : au repos, les tuiles dérivent très lentement (translations seedées, légère respiration) ; le scroll/survol « calme » et fige la zone active.
- **Source** : principe vu sur galeries génératives Awwwards (Galleries & Slideshows) <https://www.awwwards.com/awwwards/collections/image-gallery-and-slideshows/> ; mouvement ambiant des canvases (Infinite Canvas Codrops) <https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/>
- **Axe** : auto + survol/scroll.
- **Multiplicité** : tout l'ensemble est vivant simultanément → impression de « ruche » de projets.
- **Faisabilité** : 4/5 — `useAnimationFrame`/`animate` en boucle douce sur x/y par tuile (phases seedées), `useReducedMotion` coupe tout.
- **Diffère de l'existant** : Métronome est cadencé/rythmique ; ici **dérive continue calme et organique**, ambiance contemplative.

### H2 Essaim / boids léger (alignement souple)
- **1 phrase** : les tuiles s'orientent/se regroupent doucement selon une direction commune influencée par le curseur (sans vraie simulation lourde).
- **Source** : Codrops « Invisible Forces … Interactive Grid » (concept de forces) <https://tympanus.net/codrops/2025/06/30/invisible-forces-the-making-of-phantom-lands-interactive-grid-and-3d-face-particle-system/>
- **Axe** : mouvement souris (champ d'influence).
- **Multiplicité** : mouvement de groupe = collectif.
- **Faisabilité** : 2/5 — calculs par frame coûteux, risque de jank ; à garder simple (orientation, pas vraie cohésion). Note basse = à prototyper avec prudence.
- **Diffère de l'existant** : MagneticField = attraction radiale au curseur ; ici **alignement directionnel collectif** (vent), nuance distincte mais limite faisabilité.

---

## Synthèse — familles trouvées

- **A. Espace navigable & cartographie** (plan infini, mini-map, zoom dirigé, orbital)
- **B. Curseur comme outil** (traînée d'images, tampon-révélateur, grid tilt 3D, peel)
- **C. Pliage, matière & 3D physique** (accordéon-stores, origami, cubes-volume, flip-cards)
- **D. Scroll signature** (assemblage épinglé, grille élastique, stacking, kinetic type, wipe clip-path)
- **E. Composition libre & archive** (pinboard collage, planche-contact, marquee croisé, index→reveal, tas étalable)
- **F. Profondeur & atmosphère** (depth of field, brume, verre dépoli)
- **G. Transitions partagées & morphing** (morph grille→fiche, clip-path expand, rideau)
- **H. Vie autonome & génératif** (dérive ambiante, essaim léger)

## ⭐ Top 10 le plus prometteur (faisabilité × distinction × multiplicité)

1. **A1 — Plan infini draggable** : explorer un grand espace 2D à la souris/au doigt. *Codrops Infinite Canvas* <https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/>
2. **G1 — Morph grille → fiche (layoutId)** : la tuile grandit en continu jusqu'au plein écran. *Codrops GSAP Flip grid* <https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/>
3. **E2 — Planche-contact argentique** : grille dense type film 35 mm + loupe au survol. *Awwwards Galleries collection* <https://www.awwwards.com/awwwards/collections/image-gallery-and-slideshows/>
4. **D2 — Grille élastique** : colonnes à inertie différenciée, ressenti matière au scroll. *Codrops Elastic Grid Scroll* <https://tympanus.net/codrops/2025/06/03/elastic-grid-scroll-creating-lag-based-layout-animations-with-gsap-scrollsmoother/>
5. **B3 — Grid tilt 3D collectif** : panneau de tuiles incliné vers le curseur, parallaxe Z. *CodePen 3D mousemove tilt* <https://codepen.io/jsonc/pen/zYKgZgM>
6. **D1 — Assemblage épinglé au scroll** : tuiles éparpillées qui se forment en grille (sticky). *Codrops On-Scroll Layout Formations* <https://tympanus.net/codrops/2024/09/18/exploration-of-on-scroll-layout-formations/>
7. **B1 — Traînée d'images** : trail de vignettes aléatoires sous le curseur. *Codrops Image Trail Effects* <https://tympanus.net/codrops/2019/08/07/image-trail-effects/>
8. **C1 — Accordéon-stores verticaux** : lames plein-hauteur, l'active s'élargit. *Awwwards Vertical Accordion* <https://www.awwwards.com/inspiration/vertical-accordion-osi>
9. **E1 — Pinboard collage draggable** : mur d'atelier réarrangeable (rotations, chevauchements). *Milanote moodboard* <https://milanote.com/product/moodboarding>
10. **F1 — Profondeur de champ** : net/flou optique, plan focal piloté par curseur/scroll. *Codrops Atmospheric Depth Gallery* <https://tympanus.net/Tutorials/DepthGallery/>

### Notes de vigilance anti-doublon (à trancher en revue)
- **B2 (tampon-révélateur)** recoupe **Chambre noire / Lighthouse** → écarter sauf métaphore vraiment neuve.
- **F2 (brume)** frôle **Marée basse** → garder seulement si l'axe (vertical/brume) reste distinct.
- **D3 (stacking au scroll)** vs **Stack** → possiblement une variante « scroll » plutôt qu'une vue neuve.
- **A4 (orbital)** vs **Wheel / Constellation** → valider la distinction (snap-au-centre dirigé).
- **E4 (index→reveal)** vs **EditorialList** → border pour éviter le recoupement (liste pure + aperçu flottant).
