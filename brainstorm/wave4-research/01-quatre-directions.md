# Wave 4 — Recherche documentée : 4 directions prometteuses

> Galerie premium OpenAI × université. Stack **React + TS + MUI v6 + Framer Motion v11 PUR**.
> Interdits : WebGL/Three, Swiper/Embla/Lenis/GSAP, Tailwind, lucide, toute nouvelle dépendance.
> Objectif transverse de cette vague : **plus PREMIUM = transitions plus smooth + plus de « temps d'arrêt »** (snap/dwell, micro-pauses).
>
> Les 4 mécaniques existent déjà en v1 dans le repo (`CorridorView`, `RiftView`, `WheelView`, `BookView`).
> Ce document ne réinvente pas la base : il rapporte des techniques **réelles trouvées sur le web**, les transpose en Framer-pur, et cible précisément **ce qui manque pour passer de "ça marche" à "premium"** : easing, points de repos, peuplement du point de fuite, ombrage dynamique, snap angulaire, repli mobile.

---

## Légende des conventions de réglage

- **Spring de défilement (smoothing)** : on lisse `scrollYProgress`/un dérivé avec `useSpring`. Plus le `damping` est haut + `stiffness` modéré → glisse "lourd/premium" sans rebond.
- **Easing de keyframe** (transitions discrètes, `animate()` / `AnimatePresence`) : `cubic-bezier` "expo-out" pour la révélation, "anticipate" doux pour l'arrivée.
- **« Temps d'arrêt » (dwell)** : créer des **plateaux** dans la fonction `useTransform` (zones où la valeur ne bouge presque pas autour d'un cran) + **snap** doux (au `scrollend`, ou via spring qui aimante vers l'entier le plus proche).

---

## 1. Couloir / profondeur 3D spatiale

### Trouvailles web (résumé + sources)

La technique canonique de « scroll on the z-axis » repose sur une séparation **caméra fixe / scène mobile** :

- **Scène mobile, caméra fixe** : les items sont posés à des `translateZ` **négatifs fixes** (point de fuite peuplé), et c'est *la scène entière* qu'on translate en Z au scroll — `--cameraZ = window.pageYOffset`. L'item qui franchit `z≈0` est naturellement le plus grand/net (mise en avant gratuite par la perspective). [freeCodeCamp / Vince Umo](https://www.freecodecamp.org/news/css-3d-scrolling-on-the-z-axis-92503c3ecf3f/), [DEV.to — même auteur](https://dev.to/vinceumo/css-3d---scrolling-on-the-z-axis-45i9)
- **Formules clés** :
  - `perspective = base * cameraSpeed` (ex. `150px` à `1100px` ; plus petit = plus de distorsion).
  - position item : `translateZ(itemZ * cameraSpeed * index * -1)`.
  - **hauteur de scroll nécessaire** = `innerHeight + perspective + itemZ*cameraSpeed*nbItems`. → c'est le calcul qui garantit qu'on **traverse toute la profondeur**.
  - `transform-style: preserve-3d` + `will-change: transform` + `translate3d(0,0,0)` (compositing GPU).
- **Tunnel/warp** (Neat, CodePen Alansdead/nirgeier) : 4 faces (sol/plafond/murs) en `rotateX/Y(90deg) translateZ`, dégradés animés vers le point de fuite → ancre la 3D sans média. [Neat — CSS matrix tunnel](https://neat.run/blog/css-matrix-tunnel), [CodePen Pure CSS 3D Tunnel](https://codepen.io/Alansdead/pen/pvvRvwq)
- **Sliders 3D infinis** (CSS-Tricks) : montre le pattern « bande répétée + transform Z par index » pour donner l'illusion d'enfilade infinie. [CSS-Tricks — CSS Infinite 3D Sliders](https://css-tricks.com/css-infinite-3d-sliders/)

### Transposition Framer-pur (ce que le repo fait déjà bien + ce qu'il faut améliorer)

`CorridorView.tsx` applique déjà : `perspective:1200px`, panneaux à `baseZ = -index*Z_STEP`, translation globale `travel` lissée par `useSpring`, focal dérivé via `useMotionValueEvent`, repli mobile en liste snap. **Conforme à la littérature.** Ce qui manque pour le premium :

1. **Peupler vraiment le point de fuite** (multiplicité immédiate, demandé par le brief). Actuellement les panneaux alternent gauche/droite. Ajouter une **enfilade dense au loin** : au-delà du focal, comprimer l'`opacity` plus tard (les lointains restent visibles, ternes) et garder ≥ 4–5 panneaux dans le cône. Régler la fenêtre d'opacité sur `z` :

```ts
// au lieu de couper à FOCAL_BAND*1.6, laisser une longue traîne de profondeur
const opacity = useTransform(z, [-Z_STEP*7, -Z_STEP*5, 0, FOCAL_BAND, FOCAL_BAND*1.6],
  [0, 0.35, 1, 1, 0]);     // 5+ panneaux peuplent le fond
```

2. **Brume de profondeur (depth cue) en couches**, pas juste un `brightness`. Empiler des plans CSS semi-opaques entre les rangs (fog) via un voile `radial-gradient` dont l'opacité dépend de `z`, en `mixBlendMode:'screen'` discret → sépare les plans = lecture 3D plus riche, zéro WebGL.

3. **Sol texturé en lignes de fuite réelles** : aujourd'hui un radial-gradient. Ajouter un plan sol en `rotateX(90deg) translateZ` avec un `repeating-linear-gradient` (dalles) animé en `backgroundPositionY` au `travel` → la vitesse de défilement du sol *vend* le déplacement. C'est le détail « Apple deep-dive ».

### Easing / spring recommandés

- **Travel (lissage scroll)** : `useSpring(travelRaw, { stiffness: 70, damping: 26, mass: 0.7 })` — plus lourd que l'actuel (90/24/0.6) → glisse "cinématique". `restDelta: 0.01`.
- **Redressement focal** (rotateY → 0) : déjà piloté par `useTransform` sur `z` ; ajouter un **plateau** autour de `z=0` pour le « temps d'arrêt » :

```ts
// plateau de redressement : reste à 0° sur une bande [-0.25,0.25]*Z_STEP
const rotateY = useTransform(z,
  [-Z_STEP, -Z_STEP*0.25, Z_STEP*0.25, Z_STEP],
  [side*62, 0, 0, side*62]);
```

### Snap / temps d'arrêt

- **Snap doux au scroll-end** : écouter `scrollend` (support large 2024+, repli `scroll` debounced) et `animate(scrollY, nearestPanelScroll, { type:'spring', stiffness:120, damping:30 })`. L'aimantation se fait sur `scrollTop = (focalIndex/(n-1)) * maxScroll`.
- **Plateaux dans les transforms** (ci-dessus) : la tuile focale reste pleinement de face sur ~50 % de l'intervalle entre deux pas → le visiteur a le temps de lire/regarder la vidéo. C'est *le* levier dwell sans casser le scroll natif.

### Pièges Safari / perf

- **Safari & `preserve-3d` imbriqué** : Safari "aplatit" parfois les sous-arbres si un ancêtre a `overflow`, `filter`, `opacity`, `clip-path` ou `mask` non-neutre. → Ne **jamais** mettre `filter`/`opacity` sur un conteneur `preserve-3d` qui doit garder ses enfants en 3D ; appliquer ces effets sur la **feuille** (le `ProjectTile`), pas sur le nœud 3D. Le repo applique `filter` sur le nœud animé qui porte `z` — **à surveiller** : déplacer le `filter` sur un wrapper interne sans transform 3D.
- **`will-change: transform`** sur chaque panneau, mais pas plus de ~10 simultanés (coût mémoire couche GPU). Au-delà, retirer `will-change` des panneaux hors-cône.
- **Une seule `<video>`** : déjà respecté (`playing={i===focal}`).

### Repli mobile

- L'actuel (liste verticale `scroll-snap-type:y mandatory`, scale d'approche) est bon. Premium-iser : ajouter `scroll-snap-stop: always` pour forcer **un cran par geste** (effet "salle par salle"), et garder le label « SALLE n/N ».

### Variantes

- **Couloir en S / coude** : alterner `perspectiveOrigin` (45 %→55 %) selon le focal → la caméra "tourne" doucement, le couloir n'est plus rectiligne.
- **Galerie murale** : panneaux uniquement sur les murs (pas centrés), focal = celui qu'on longe ; on lit l'enfilade comme un vrai musée.

---

## 2. Faille / révélation par strates

### Trouvailles web (résumé + sources)

- **Reveal par `clip-path: inset()`** (la référence) : on anime de `inset(0 0 100% 0)` → `inset(0 0 0 0)`. Avantages : **hardware-accelerated, zéro layout shift** (contrairement à `height`). Easing maison d'Emil Kowalski : **`cubic-bezier(0.77, 0, 0.175, 1)`** (expo in-out). Pattern à **deux plans** : un calque base statique + un calque overlay clippé qu'on révèle. [Emil Kowalski — The Magic of Clip Path](https://emilkowal.ski/ui/the-magic-of-clip-path)
- **Curtain / split depuis le centre** : combiner un `clip-path` qui s'ouvre du centre + léger parallaxe interne sur l'image. C'est exactement la "faille". [Motion.dev — Scroll Image Reveal](https://motion.dev/tutorials/react-scroll-image-reveal)
- **Pinned split-screen mask reveal** : pile d'images fixe + texte qui défile, images "démasquées" à la progression → cinématique. [Medium — Clip-path & masking tricks](https://medium.com/@genildocs/advanced-css-clip-path-and-masking-tricks-for-modern-visual-effects-8c4a3715f10d)
- **Curtain in / lift out (couches qui se chevauchent)** : sections qui se recouvrent au scroll, l'une "monte" pendant que l'autre se dévoile dessous. [GSAP forum — Curtain in & lift out](https://gsap.com/community/forums/topic/44549-overlapping-sections-scroll-reveal-curtain-in-and-lift-out-sections-layers-scrolltrigger-react/)
- **`@property` pour animer un clip-path "custom"** (registre de propriété typée) → pas applicable directement (Framer interpole déjà des strings), mais confirme que **l'interpolation de `inset()` est le bon vecteur**. [utilitybend — Animating clip-paths on scroll](https://utilitybend.com/blog/animating-clip-paths-on-scroll-with-at-property-in-css/)

### Transposition Framer-pur

`RiftView.tsx` fait déjà : deux plaques en sens inverse (un seul `progress` → `x` opposés), faille qui s'ouvre en `height`, strates qui se décompressent (`scaleY 0.12→1`), focal qui joue. Solide. **Améliorations premium :**

1. **Remplacer l'ouverture par `height` par un `clip-path: inset()`** sur la fente (pas de reflow, GPU). La faille s'ouvre du centre vers le haut+bas :

```ts
// inset(top right bottom left) — s'ouvre symétriquement depuis le centre
const open = useTransform(progress, [0, 0.18], [50, 0]); // % depuis le centre
const clipPath = useTransform(open, (o) => `inset(${o}% 0% ${o}% 0%)`);
// appliqué au calque "magma/strates"
```

2. **Lèvres de la faille en deux calques antagonistes** (pattern Emil Kowalski) : la croûte claire au-dessus et en-dessous est un même visuel coupé en `inset(0 0 50% 0)` (haut) et `inset(50% 0 0 0)` (bas) ; la fente noire apparaît *entre* → la "déchirure" lit mieux qu'un simple bloc sombre intercalé.

3. **Parallaxe interne subtil** sur le focal révélé (Motion.dev) : pendant que la strate se décompresse, translater son média de `+8%→0%` en `y` → sensation de "remontée des profondeurs".

### Easing / spring recommandés

- **Ouverture de la faille (révélation)** : si pilotée par keyframe (clic / AnimatePresence), `ease: cubic-bezier(0.77,0,0.175,1)`, `duration: 0.9–1.1s`. Si pilotée scroll, lisser `progress` avec `useSpring({ stiffness: 80, damping: 26, mass: 0.7 })`.
- **Décompression des strates** : garder le triangle `[a, center, b] → [0.12, 1, 0.12]` mais **élargir le plateau au centre** pour le dwell :

```ts
const scaleY = useTransform(progress, [a, center-pad, center+pad, b], [0.12, 1, 1, 0.12]);
const opacity = useTransform(progress, [a, center-pad, center+pad, b], [0, 1, 1, 0]);
// pad ≈ half*0.35  → la strate reste pleine ~30% de sa fenêtre = temps de lecture
```

### Snap / temps d'arrêt

- **Snap par strate** : aimanter `scroll` vers `center_i * maxScroll` au `scrollend`. Chaque thème (`group`) = un cran. Combiné aux **plateaux** ci-dessus → chaque projet focal s'installe et "respire".
- **Micro-pause d'impact** : à l'instant d'ouverture max, une **secousse** très brève (`x: [0,-2,2,0]` sur 120 ms) des plaques = "le terrain craque". Discret, premium si ≤ 2px.

### Pièges Safari / perf

- **Animer `clip-path` plutôt que `height`** : `height` déclenche reflow (jank) ; `clip-path`/`inset` est composité. **Gros gain.**
- Safari : `clip-path` sur un nœud qui contient des enfants `preserve-3d` aplatit la 3D (cf. §1). Ici les strates ont un `rotateX` léger ; si on clippe le conteneur, **clipper un wrapper SANS transform 3D** et mettre la 3D à l'intérieur.
- Le repo répète la bande (`[...projects, ...projects]`) pour éviter les trous : OK, mais limiter le nombre de tuiles répétées sur mobile.

### Repli mobile

- L'actuel (faille déjà ouverte, tout lisible, plaques haut/bas + strates empilées) est exemplaire. Garder. Optionnel : `clip-path` figé à `inset(0)` (ouvert) sans animation.

### Variantes

- **Faille verticale** (déchirure gauche/droite) au lieu d'horizontale → meilleure sur écrans portrait.
- **Strates "carottes géologiques"** : empiler 2–3 vignettes par strate (mini-mosaïque par thème) avant de révéler le focal → renforce "plusieurs participants par couche".

---

## 3. Grande Roue / rotatif

### Trouvailles web (résumé + sources)

- **Drum 3D iOS** : N items répartis sur un cylindre. Chaque item à `rotateX(itemAngle) translateZ(radius)`, puis l'item central est **face caméra** (contre-rotation). Les items s'effacent/tournent en quittant le centre ("drum effect"). Le scroll d'une **liste invisible** ("scroll proxy") pilote la rotation, qui **snap** sur l'item le plus proche avec une physique d'inertie satisfaisante. [freefrontend — 3D iOS Time Picker](https://freefrontend.com/code/3d-rotating-ios-time-picker-2026-02-05/), [CSS Script — iOS Wheel Picker](https://www.cssscript.com/ios-wheel-picker-mobile/), [react-wheel-picker (inertie + snap + loop infini)](https://github.com/ncdai/react-wheel-picker)
- **Maths du cylindre (géométrie standard, à appliquer)** :
  - angle par item : `θ = 360 / count` (roue pleine) **ou** un pas fixe (ex. 20°) si on ne veut qu'un arc visible.
  - **rayon depuis la hauteur d'item** : `radius = (itemHeight / 2) / tan(θ/2)` → garantit que les items se "touchent" sur la jante sans chevauchement.
  - item i : `transform: rotateX(θ*i) translateZ(radius)` ; conteneur `perspective` + `preserve-3d`.
- **Carousel circulaire 8 cartes** : `rotateZ/translateZ` autour d'un cercle puis redressement ; `scroll-snap-type` + `scroll-behavior` pour le tactile 60fps. [CSS-Tricks — rotateZ](https://css-tricks.com/almanac/functions/r/rotatez/), [iCarousel (réf. conceptuelle iOS)](https://github.com/nicklockwood/iCarousel)
- **rotateX vs rotateZ** : pour une **roue verticale** (items qui montent/descendent), c'est `rotateX` (axe horizontal) ; pour une **roue plate type grande roue de fête foraine vue de face**, c'est `rotateZ`. Le repo fait une roue verticale (`rotateX`) — correct pour le feeling "wheel picker".

### Transposition Framer-pur

`WheelView.tsx` fait déjà : cartes à `transformOrigin: center center -RADIUS`, `rotateX(effective)` + contre-rotation `-effective`, scale/opacity/blur selon `|angle|`, active dérivée, `onActivate` recentre. Très proche de la littérature. **Améliorations :**

1. **Dériver le RADIUS de la taille de carte** (au lieu de `460` en dur) pour que la jante soit cohérente :

```ts
// θ = 360/n ; pour une carte de hauteur h, jante sans gros trou :
const theta = 360 / n;
const radius = (cardHeightPx / 2) / Math.tan((theta * Math.PI / 180) / 2);
```

2. **Drag + scroll combinés** (Framer `drag="y"` + `useMotionValue`), pas seulement scroll. Mapper le `drag` sur la rotation, et au relâchement, **snap angulaire** :

```ts
// au dragEnd : viser le multiple de θ le plus proche, avec spring
const target = Math.round(rotation.get() / theta) * theta;
animate(rotation, target, { type:'spring', stiffness:120, damping:18, velocity: info.velocity.y });
```

3. **Cran "détente" (notch)** : ajouter une **micro-accroche** quand une carte arrive face caméra — léger sur-scale (`1→1.04→1`) en 180 ms via `useTransform` plateau + un tick sonore optionnel (non, pas d'audio). Le sur-scale au cran = sensation mécanique premium.

### Easing / spring recommandés

- **Rotation lissée (scroll)** : actuel `{ stiffness:70, damping:20, mass:0.5 }` → un peu vif. Premium : **`{ stiffness:55, damping:22, mass:0.8 }`** = roue plus "lourde", inertie crédible.
- **Snap angulaire (dragEnd)** : `spring { stiffness:120, damping:18 }` en **injectant `velocity`** du geste → respect du flick.
- **Mise en avant active** : transition de `scale`/`opacity` non instantanée — garder dérivée de l'angle (continue), avec un **plateau** `[0, 6, 30] → [1.04, 1.0, 0.82]` pour que l'active "tienne" sur ±6°.

### Snap / temps d'arrêt

- **Snap angulaire sur multiple de θ** (ci-dessus) = LE point clé. Sans snap, la roue s'arrête "entre deux crans" → pas premium.
- **Dwell** : élargir la zone "active = nette/grande" autour de 0° (plateau d'angle), et **ralentir la rotation** près d'un cran (faux détente : `useTransform` non-linéaire qui compresse la vitesse angulaire autour des multiples de θ).
- **`scroll-snap` natif sur le proxy invisible** (pattern iOS) : si on garde un pilotage scroll, mettre la course de scroll en `scroll-snap-type:y mandatory` avec un cran par carte → le navigateur fait le snap, on lit la position.

### Pièges Safari / perf

- `transformOrigin: center center -460px` (origine reculée) : **bien supporté** mais Safari peut clipper si l'ancêtre a `overflow:hidden` + `preserve-3d` mal placé. Tester : conteneur `perspective` SANS `overflow:hidden` direct sur le nœud `preserve-3d`.
- **`backface-visibility:hidden`** sur les cartes pour ne pas voir l'envers en bas de roue : déjà présent.
- **blur** (`filter:blur`) coûteux si appliqué à beaucoup de cartes : limiter le blur aux cartes proches (≤ 40°), `blur(0)` ailleurs pour éviter le repaint. Le repo plafonne déjà à 3px — OK, mais court-circuiter à 0 hors-bande.
- Une seule `<video>` (active) : respecté.

### Repli mobile

- Actuel : arc statique vertical (liste). Acceptable. Mieux : **garder la roue mais en drag tactile** (pas de course de scroll gonflée), `perspective` réduite (`1000px`), 3–4 cartes visibles max. Le wheel picker est *natif mobile* — c'est la mécanique la plus "à l'aise" sur téléphone des 4.

### Variantes

- **Coverflow horizontal** (roue couchée, `rotateY`) pour desktop large.
- **Demi-roue (arc)** : ne montrer que 180° (les cartes du fond cachées) → moins de calcul, lecture plus claire, "éventail".

---

## 4. Grand Livre / page-turn

### Trouvailles web (résumé + sources)

- **Mécanique de base** : `perspective: 1500px` sur le livre, pages en `preserve-3d`. **Page droite pivote autour de son bord gauche, page gauche autour de son bord droit** (`transform-origin`), `rotateY 0 → -180deg`, `backface-visibility:hidden` sur recto/verso. **z-index décroissant** par page, qui s'inverse une fois la page tournée (>90°). [CSS Script — CSS-Only 3D Flip Book](https://www.cssscript.com/3d-flip-book-animation/), [FlipBook (rokobuljan)](https://github.com/rokobuljan/FlipBook)
- **Ombrage = ce qui fait le premium** : surcouches `linear-gradient` pour simuler courbure du papier + variation de lumière pendant le tournage ; ombres de reliure ; **page curl** = pseudo-élément `transform: skew + rotate` + `box-shadow` sombre. Pas de WebGL nécessaire. [SitePoint — Pure CSS3 Paper Curls](https://www.sitepoint.com/pure-css3-paper-curls/), [freefrontend — CSS Book Effects](https://freefrontend.com/css-book-effects/)
- **Ombres de courbe (valeurs concrètes)** : [CSS-Tricks — Page Curl Shadows](https://css-tricks.com/snippets/css/page-curl-shadows/)
  - corps : `box-shadow: 0 1px 4px rgba(0,0,0,.27), 0 0 40px rgba(0,0,0,.06) inset;`
  - coins relevés (pseudo) : `box-shadow: 0 8px 16px rgba(0,0,0,.3); transform: skew(-15deg) rotate(-6deg);` (et miroir `skew(15deg) rotate(6deg)`), parent `z-index:1`, pseudo `z-index:-1`.
- **Curl dynamique** (JS+CSS sans Flash) : la page suit l'input avec courbure + ombres proportionnelles à la profondeur du pli. [javaspring — dynamic page turning](https://www.javaspring.net/blog/how-to-implement-dynamic-page-turning-curling-with-javascript/)

### Transposition Framer-pur

`BookView.tsx` fait déjà : `perspective:2600px`, feuilles `rotateY 0→-180` autour de `left center`, recto média / verso texte, `zIndex` dérivé de la rotation, page gauche statique, ombre de reliure centrale, focal `playing`. Excellent socle. **Améliorations premium (surtout l'ombrage, qui est l'angle mort identifié) :**

1. **Voile d'ombrage dynamique sur la feuille en train de tourner** (LE détail manquant). Un calque `linear-gradient` dont l'opacité suit l'angle de rotation : sombre quand la page est de profil (90°), clair quand à plat (0/180°). Vend le volume :

```ts
const rotateY = useTransform(page, [index, index+1], [0, -180], { clamp:true });
// 0 à 90° : le recto s'assombrit ; ombre max à ~90° (profil)
const shadeOpacity = useTransform(rotateY, [0, -90, -180], [0, 0.45, 0]);
// calque <motion.div style={{ opacity: shadeOpacity, background:'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.6) 100%)' }} />
```

2. **Ombre portée mouvante sur la page d'en-dessous** : pendant le tournage, projeter une ombre depuis la reliure qui balaie la page droite (gradient dont la position X suit `rotateY`). C'est l'ombre de la page levée qui glisse → ultra crédible.

3. **Courbure (cylinder fake)** : plutôt qu'une feuille plate, couper la feuille en 2–3 bandes verticales avec `rotateY` légèrement différents (la bande au bord plie plus) → mini page-curl sans physique. Coûteux ; réserver au desktop puissant. Repli = feuille plate (actuel).

4. **Reliure & coins** : ajouter `box-shadow: 0 1px 4px rgba(0,0,0,.27), inset 0 0 40px rgba(0,0,0,.06)` sur les pages (valeurs CSS-Tricks) → grain "papier" immédiat.

### Easing / spring recommandés

- **Page (lissage scroll → 0..n)** : actuel `{ stiffness:90, damping:22, mass:0.6 }`. Pour une page **qui retombe joliment**, premium : **`{ stiffness:70, damping:20, mass:0.8 }`** (un peu plus de poids, léger overshoot maîtrisé en fin de tournage = "tac" de la page qui se pose).
- **Si tournage déclenché (clic/clavier)** plutôt que scroll : `animate(page, next, { type:'spring', stiffness:60, damping:14 })` → vrai rebond papier.
- Easing courbe d'ombrage : laisser `useTransform` linéaire sur l'angle (le `sin`-like est déjà donné par la géométrie de rotation).

### Snap / temps d'arrêt

- **Snap à la page entière** : au `scrollend`, aimanter `scroll` vers `round(page)*pageScroll`. **Indispensable** : une page à moitié tournée n'est jamais un état de repos premium.
- **Dwell sur la double-page ouverte** : élargir l'intervalle de scroll par page (le repo donne déjà `(n+1)*90vh` → généreux). Optionnel : insérer un **plateau de scroll** où `page` reste entier sur ~15 % de l'intervalle (la double-page "tient" ouverte avant que la feuille suivante ne commence à se lever).
- **Micro-pause au contact** : à `rotateY ≈ -180°`, un très léger settle (`-180 → -178 → -180`) via spring → la page "claque" doucement.

### Pièges Safari / perf

- **`backface-visibility:hidden` est obligatoire** sur recto ET verso, sinon Safari montre l'envers en miroir. Présent.
- **Z-index dérivé de la rotation** : le calcul `r > -90 ? total-index : total+index` est le bon pattern (inversion à 90°). Attention au **flicker exactement à -90°** : Safari peut "sauter" — ajouter une hystérésis (`r > -88`) pour stabiliser le changement de couche.
- **`perspective` élevé (2600px)** = livre peu déformé (réaliste). OK. Ne pas mettre `overflow:hidden` sur le nœud `preserve-3d` du livre (aplatissement Safari) — le repo met `overflow:hidden` sur un wrapper interne : **vérifier** qu'il ne casse pas les feuilles 3D (les feuilles sont enfants directs de ce wrapper → risque). Idéalement, `overflow` seulement sur l'enveloppe non-3D.
- Une seule `<video>` (double-page ouverte) : respecté.

### Repli mobile

- Actuel : liste verticale de double-pages, pas de 3D. Très bien (le page-turn 3D est le plus fragile des 4 sur tactile). Garder. Optionnel : un **swipe** horizontal (`drag="x"` + `AnimatePresence`) sans rotation 3D, juste slide — feeling "magazine" léger.

### Variantes

- **Calendrier / flip vertical** (`rotateX`, charnière en haut) → style "agenda".
- **Double feuille (carnet à spirale)** : reliure visible avec anneaux SVG → renforce l'objet livre.

---

## Tableau récapitulatif des réglages de transition recommandés

| Direction | Spring de lissage (scroll/drag) | Easing keyframe (révélation/clic) | Mécanisme de snap | Levier « temps d'arrêt » (dwell) | Repli mobile |
|---|---|---|---|---|---|
| **1. Couloir 3D** | `useSpring(travel, { stiffness:70, damping:26, mass:0.7, restDelta:0.01 })` (plus lourd que l'actuel 90/24/0.6) | n/a (piloté scroll) | `scrollend` → `animate(scrollY → focalIndex/(n-1)*max, spring 120/30)` | **Plateau de redressement** rotateY=0 sur ±0.25·Z_STEP ; sol défilant ; traîne de profondeur peuplée | Liste verticale `snap y mandatory` + `scroll-snap-stop: always`, scale d'approche |
| **2. Faille / strates** | `useSpring(progress, { stiffness:80, damping:26, mass:0.7 })` | `cubic-bezier(0.77,0,0.175,1)`, `dur 0.9–1.1s` (Emil Kowalski) | `scrollend` → aimanter `center_i` (un cran par thème/`group`) | **Plateau** `scaleY/opacity = 1` sur center±pad (~30 % fenêtre) ; ouverture en `clip-path: inset()` (pas `height`) | Faille figée ouverte (`inset(0)`), plaques + strates empilées, statique |
| **3. Grande Roue** | rotation : `useSpring(rot, { stiffness:55, damping:22, mass:0.8 })` (plus lourd/inertiel) | snap dragEnd : `spring { stiffness:120, damping:18, velocity:info.velocity }` | **Snap angulaire** sur multiple de `θ=360/n` (injecter la vélocité du flick) | Sur-scale au cran (1→1.04→1, 180 ms) ; plateau "active nette" sur ±6° ; détente (vitesse compressée près de θ) | Roue conservée en **drag tactile** (pas de scroll gonflé), perspective 1000px, 3–4 cartes |
| **4. Grand Livre** | page : `useSpring(page, { stiffness:70, damping:20, mass:0.8 })` (léger overshoot = "tac") | clic/clavier : `spring { stiffness:60, damping:14 }` (rebond papier) | `scrollend` → `round(page)*pageScroll` ; hystérésis z-index à -88° | **Voile d'ombrage** suivant rotateY (0→.45→0) ; plateau double-page ouverte ~15 % ; settle à -180° | Liste verticale de double-pages (ou swipe `drag="x"` slide, sans 3D) |

### Réglages transverses « premium » à retenir

- **Smoothing toujours plus lourd** : monter le `damping` (≥ 22) et la `mass` (0.7–0.8), baisser le `stiffness` (55–80) → mouvement "haut de gamme", jamais nerveux. Ajouter `restDelta: 0.01` pour couper la traîne.
- **Easing de révélation universel** : `cubic-bezier(0.77, 0, 0.175, 1)` (expo in-out) pour tout reveal clippé/discret.
- **Le snap n'est pas optionnel** : chacune des 4 mécaniques DOIT s'arrêter sur un cran (panneau focal / strate-thème / multiple d'angle / page entière). Pilotage `scrollend` + `animate(... spring)` ; ou `scroll-snap` natif sur la course quand c'est faisable.
- **Le dwell se fait par PLATEAUX dans `useTransform`** (segments où la valeur reste constante autour du cran), pas par `setTimeout`. C'est ce qui donne "le temps de regarder la vidéo" sans bloquer le scroll.
- **Préférer `clip-path`/`transform`/`opacity` à `height`/`top`/`width`** (composité GPU, pas de reflow). Garde-fou Safari récurrent : **jamais** `filter`/`opacity`/`overflow`/`clip-path` sur un nœud `preserve-3d` dont les enfants doivent rester en 3D — déporter ces effets sur les feuilles internes.

---

## Sources principales

- [freeCodeCamp — CSS 3D: scrolling on the z-axis (Vince Umo)](https://www.freecodecamp.org/news/css-3d-scrolling-on-the-z-axis-92503c3ecf3f/) — formules caméra/scène, perspective, hauteur de scroll.
- [DEV.to — CSS 3D scrolling on the z-axis](https://dev.to/vinceumo/css-3d---scrolling-on-the-z-axis-45i9) — séparation caméra fixe / scène mobile, point de fuite peuplé.
- [Neat — How to build a 3D tunnel in CSS](https://neat.run/blog/css-matrix-tunnel) + [CodePen — Pure CSS 3D Tunnel](https://codepen.io/Alansdead/pen/pvvRvwq) — décor de tunnel (sol/murs).
- [CSS-Tricks — CSS Infinite 3D Sliders](https://css-tricks.com/css-infinite-3d-sliders/) — enfilade Z par index.
- [Emil Kowalski — The Magic of Clip Path](https://emilkowal.ski/ui/the-magic-of-clip-path) — reveal `inset()`, easing `cubic-bezier(0.77,0,0.175,1)`, pattern deux plans.
- [Motion.dev — Scroll Image Reveal](https://motion.dev/tutorials/react-scroll-image-reveal) — clip-path reveal centre + parallaxe (Framer/Motion React).
- [Medium — Advanced clip-path & masking tricks](https://medium.com/@genildocs/advanced-css-clip-path-and-masking-tricks-for-modern-visual-effects-8c4a3715f10d) — pinned split-screen mask reveal.
- [GSAP forum — Curtain in & lift out](https://gsap.com/community/forums/topic/44549-overlapping-sections-scroll-reveal-curtain-in-and-lift-out-sections-layers-scrolltrigger-react/) — couches qui se chevauchent (concept transposable).
- [freefrontend — 3D Rotating iOS Time Picker](https://freefrontend.com/code/3d-rotating-ios-time-picker-2026-02-05/) + [CSS Script — iOS Wheel Picker](https://www.cssscript.com/ios-wheel-picker-mobile/) — drum 3D, scroll proxy, snap/inertie.
- [react-wheel-picker (ncdai)](https://github.com/ncdai/react-wheel-picker) — inertie + snap + loop infini (réf. de comportement).
- [CSS-Tricks — rotateZ()](https://css-tricks.com/almanac/functions/r/rotatez/) — choix rotateX vs rotateZ pour la roue.
- [CSS Script — CSS-Only 3D Flip Book](https://www.cssscript.com/3d-flip-book-animation/) + [FlipBook (rokobuljan)](https://github.com/rokobuljan/FlipBook) — rotateY, transform-origin, z-index.
- [CSS-Tricks — Page Curl Shadows](https://css-tricks.com/snippets/css/page-curl-shadows/) + [SitePoint — Pure CSS3 Paper Curls](https://www.sitepoint.com/pure-css3-paper-curls/) — ombrage/curl en CSS pur.
- [Motion React — Scroll animations](https://motion.dev/docs/react-scroll-animations) — useScroll/useTransform/useSpring (réglages spring de référence).
