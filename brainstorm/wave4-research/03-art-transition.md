# Recherche 3 — L'art de la transition : smooth + « temps d'arrêt »

> Mission : donner les moyens concrets, ÉPROUVÉS et CHIFFRÉS d'obtenir sur toutes les vues
> (1) plus de **temps d'arrêt** (points de repos, snap qui se pose, micro-pauses) et
> (2) des **transitions plus smooth** (courbes soignées, ressorts qui se posent sans rebond parasite).
> Stack : MUI v6 + **Framer Motion v11 PUR**, pas de WebGL, pas de nouvelle dépendance.
> Livrable : une synthèse documentée (sources) + un **STANDARD DE TRANSITION partagé** prêt à coder (pseudo-`motion.ts`) + des recommandations avant/après par vue.

---

## 0. État des lieux du code (constat)

J'ai lu `theme.ts`, `CorridorView`, `WheelView`, `RiftView`, `BookView`. Constats clés :

- **Aucun token de motion partagé** n'existe (`theme.ts` n'a ni easing, ni durée, ni spring). Chaque vue redéclare son propre `const SPRING = {...}` en haut de fichier → valeurs proches mais **non standardisées**, donc le « feeling » diffère subtilement d'une vue à l'autre.
- Valeurs spring actuellement en place :
  - Corridor : `{ stiffness: 90, damping: 24, mass: 0.6 }`
  - Wheel : `{ stiffness: 70, damping: 20, mass: 0.5 }`
  - Rift : `{ stiffness: 80, damping: 24, mass: 0.6 }`
  - Book : `{ stiffness: 90, damping: 22, mass: 0.6 }`
- **Aucun n'utilise `restDelta`/`restSpeed`** → la fin d'animation peut « traîner » ou s'arrêter de façon imprécise (jitter de fin), et le scroll progress lissé n'a pas de seuil de repos net.
- **Aucun n'a de logique de snap programmatique ni de dwell/hystérésis** : le focal est dérivé en continu de `scrollYProgress` via `useMotionValueEvent` + `Math.round(...)`. Résultat : pas de « temps d'arrêt », l'élément actif change dès qu'on franchit la frontière, sans se poser. C'est précisément ce que l'utilisateur juge « pas au point ».
- `useReducedMotion()` est bien respecté partout (bonne base). Le `setFocal/setActive` est déjà gardé contre les re-renders inutiles (`prev === next`).

**Diagnostic** : le manque de « temps d'arrêt » vient de (a) l'absence de snap qui se pose + dwell, (b) springs un poil trop raides/légers pour un focal qui change souvent (Wheel à 70/20/0.5 et mass faible = réponse rapide, donc peu de sensation de « pose »). Le manque de smooth vient de (a) pas de `restDelta`, (b) pas de standard d'easing pour les transitions non-spring (apparition/disparition de tuiles, overlays texte), souvent laissées au défaut Framer (`tween 0.3 easeInOut`).

---

## 1. Courbes d'easing (transitions non-spring : opacité, clip-path, filtres, overlays)

### Pourquoi l'ease-out domine en UI
Une transition perçue comme « premium » démarre **vite** puis **décélère** vers son point d'arrivée : l'utilisateur voit immédiatement une réponse à son geste (faible latence perçue) et l'élément « se pose » doucement. C'est l'**ease-out** (et ses cousins emphasized/standard decelerate). L'ease-in (lent au départ) paraît mou/en retard pour de l'entrée ; on le réserve aux **sorties** (l'élément accélère en quittant l'écran, on lui prête moins d'attention). [Material 1 — Duration & easing], [IBM Motion].

### Valeurs de référence (cubic-bezier)

| Rôle | cubic-bezier | Source |
|---|---|---|
| **Standard** (begin & end at rest — déplacements sur écran) | `0.4, 0, 0.2, 1` | [Norton DS / Material] |
| **Decelerate** (entrée, finit au repos) | `0, 0, 0.2, 1` | [Norton DS / Material] |
| **Accelerate** (sortie, part du repos) | `0.4, 0, 1, 1` | [Norton DS / Material] |
| **Sharp** (sort temporairement, peut revenir) | `0.4, 0, 0.6, 1` | [Norton DS / Material] |
| **M3 Emphasized** (le « héros », mouvement expressif) | `0.2, 0, 0, 1` | [M3 motion] |
| **M3 Emphasized Decelerate** (entrée expressive) | `0.05, 0.7, 0.1, 1` | [M3 motion] |
| **M3 Emphasized Accelerate** (sortie expressive) | `0.3, 0, 0.8, 0.15` | [M3 motion] |
| **M3 Standard Decelerate** | `0, 0, 0, 1` | [M3 motion] |
| **M3 Standard Accelerate** | `0.3, 0, 1, 1` | [M3 motion] |
| **Expo-out** (très premium, longue traîne douce) | `0.16, 1, 0.3, 1` | [easings.net easeOutExpo] |
| **Quint-out** (premium, traîne marquée) | `0.22, 1, 0.36, 1` | [easings.net easeOutQuint] |
| **Quart-out** (équilibré) | `0.25, 1, 0.5, 1` | [easings.net easeOutQuart] |

> En Framer Motion, on passe ces valeurs comme tableau : `ease: [0.16, 1, 0.3, 1]`. Les noms intégrés utiles : `easeOut`, `circOut`, `backOut`, `anticipate` (cf. [Motion transitions]).

### Durées recommandées par type (ms)

| Type | Durée | Note |
|---|---|---|
| **Micro** (hover, toggle, focus ring, petit fade) | **120–200 ms** | M3 short2–short4 = 100/150/200 ; Norton simple = 100, enter 150, exit 75 |
| **Moyenne** (transition d'état, apparition de tuile, overlay) | **250–400 ms** | M3 medium = 250–400 ; Norton open 250 / expand 300 / detailed 500 |
| **Large** (changement de scène, ouverture héros, layout) | **400–700 ms** | M3 long = 450–600, extra-long ≥ 700 |

Règles de durée (Material) : **la sortie est plus courte que l'entrée** (~ 75 % de l'entrée), une **grande distance / grand changement de surface** mérite une durée plus longue ; ne jamais utiliser une durée unique pour tout. [Material 1], [Material 2 speed].

M3 duration tokens (référence chiffrée complète) : short1 50 · short2 100 · short3 150 · short4 200 · medium1 250 · medium2 300 · medium3 350 · medium4 400 · long1 450 · long2 500 · long3 550 · long4 600 · extra-long1 700 (→ extra-long4 ~1000). [M3 motion].

---

## 2. Physique de ressort (Framer Motion `type:'spring'`)

### Les 3 paramètres (et le 4e qui change tout : la fin)
- **stiffness** (déf. Framer-physique = 100 ; *attention* la doc Motion liste parfois 1 selon la version — utiliser explicitement) : tension/raideur. Haut = réponse vive et plus de rebond potentiel. [Motion transitions], [Comeau].
- **damping** (déf. 10) : force d'amortissement. Haut = se pose sans osciller ; à 0 = oscille à l'infini. [Motion transitions], [Comeau].
- **mass** (déf. 1) : inertie. Haut = mouvement plus lourd/lent, départ et arrêt plus « pesants ». [Motion], [Comeau].
- **restDelta** (déf. 0.01) et **restSpeed** (déf. 0.1) : seuils d'**arrêt**. L'anim se termine quand la distance < `restDelta` ET la vitesse < `restSpeed`. **C'est le levier anti-jitter de fin et anti-traîne** : pour un scroll progress 0→1, baisser `restDelta` à `0.001` rend l'arrêt net et précis (pattern officiel pour les progress bars). [Motion transitions], [Motion useScroll].

### Le « ratio d'amortissement » — la clé du premium qui se pose
Le comportement (rebond ou non) dépend du **ratio d'amortissement** `ζ = damping / (2·√(stiffness·mass))` :
- **ζ < 1 (sous-amorti)** : dépasse la cible puis revient → **rebond**. Plus ζ est petit, plus ça rebondit.
- **ζ = 1 (critique)** : revient le plus vite possible **SANS** dépasser → arrêt net, « business-like ».
- **ζ > 1 (sur-amorti)** : revient lentement sans dépasser → sensation « molasses » très calme. [Comeau], [physique du ressort, Heckel].

Pour un ressort **premium qui se pose** on vise **ζ ≈ 0.7 à 1.0** : juste ce qu'il faut de vie sans rebond parasite. Calcul pratique pour viser une cible :

> `damping = 2 · ζ · √(stiffness · mass)`

Exemples (mass = 1) :
- stiffness 120, ζ = 1.0 → damping ≈ **22** (se pose net, 0 dépassement) → preset *settle*.
- stiffness 170, ζ ≈ 0.85 → damping ≈ **22** (réactif, micro-pose) → preset *snappy*.
- stiffness 90, ζ ≈ 1.0 → damping ≈ **19** mais avec mass 1.1 → damping ≈ **26** (lourd, très calme) → preset *gentle*.

> NB : les springs actuels du projet (ex. Wheel 70/20/0.5 → ζ ≈ 1.69 = **sur-amorti** mais avec mass 0.5 = très réactif/léger ; Rift 80/24/0.6 → ζ ≈ 1.73) sont **déjà non-rebondissants**, mais leur mass faible (0.5–0.6) les rend un peu « secs » et **ne crée pas de temps d'arrêt** — ils suivent le scroll de près. Pour ajouter du « poids/pose », **augmenter mass vers 0.9–1.2** et viser ζ ≈ 0.85–1.0 (un soupçon de vie), pas 1.7.

### Spring vs Tween — quand choisir quoi
- **Spring** : tout ce qui suit un **geste continu** (drag, scroll lissé, pointeur), tout ce qui doit « se poser » naturellement (snap, focal). Incorpore la vélocité du geste → feedback naturel. [Motion transitions].
- **Tween** (durée + ease fixes) : transitions **discrètes et orchestrées** où l'on veut un timing prévisible et identique (fade d'overlay, clip-path d'ouverture, séquence staggerée, exit d'AnimatePresence). [Motion transitions].
- **Spring duration-based** (`{ type:'spring', duration, bounce }`, bounce 0 = pas de rebond, déf. 0.25) : compromis quand on veut « le look ressort » mais une durée maîtrisée. [Motion transitions].

---

## 3. « Temps d'arrêt » / snap (le cœur de la demande)

L'utilisateur veut que les vues **se posent** et **restent un instant**. Trois mécanismes complémentaires :

### 3.1 Scroll-snap CSS (gratuit, natif, robuste)
Sur les conteneurs scrollables (replis mobiles, listes, horizontal-scroll) :
```css
scroll-snap-type: y mandatory;   /* ou proximity = plus doux */
scroll-padding: 12vh;            /* marge autour du point de snap (header fixe) */
/* enfant : */
scroll-snap-align: center;
scroll-snap-stop: always;        /* force l'arrêt sur CHAQUE item (à n'utiliser que si l'arrêt est essentiel) */
```
- **mandatory** = se cale toujours sur un point (fort « temps d'arrêt ») ; **proximity** = se cale seulement si on s'arrête près d'un point (plus libre). [MDN scroll-snap], [web.dev css-scroll-snap].
- **Toujours** définir `overflow` explicitement sinon le snap est ignoré. [Medium / web.dev].
- `scroll-snap-stop: always` empêche de « survoler » des items en scrollant vite — utile pour une galerie où chaque projet doit être vu, mais peut frustrer si on veut aller vite : à réserver. [CSS-Tricks].

### 3.2 Snap programmatique (vues scroll-driven en sticky/3D : Couloir, Roue, Faille, Livre)
Ces vues ne scrollent pas un conteneur d'items (la scène est `sticky`) : le scroll pilote un `scrollYProgress`. Le snap CSS ne s'y applique pas → il faut un **snap programmatique** au repos du scroll :

1. **Détecter l'arrêt du scroll** (debounce ~120–160 ms sans event `scroll`/`wheel`).
2. **Calculer le point d'ancrage** le plus proche : `target = Math.round(progress.get() * (n-1)) / (n-1)`.
3. **Animer vers ce point** avec un spring *settle* : `animate(progress, target, { type:'spring', stiffness:120, damping:26, mass:1, restDelta:0.001 })` — mais comme `scrollYProgress` est read-only, on anime un **MotionValue intermédiaire** (le `useSpring` qu'on dérive déjà) OU on fait `window.scrollTo({ top: targetScrollPx, behavior:'smooth' })`.
   - Le plus propre en Framer pur : remplacer le `useSpring(scrollYProgress)` actuel par un MotionValue qu'on **pilote nous-mêmes** : suivre `scrollYProgress` au scroll, puis au repos `animate(mv, snappedTarget, settleSpring)`. On garde ainsi une évasion native (on ne bloque jamais le scroll), on ne fait que « finir le geste » vers l'ancre.

### 3.3 Dwell / hystérésis (anti-jitter de l'élément actif)
Le focal qui change dès qu'on franchit une frontière = saccade visuelle. Deux remèdes, à combiner :
- **Hystérésis** : ne changer d'index actif que si on dépasse la frontière **+ une marge** (ex. il faut être à > 60 % vers le voisin pour basculer, pas 50 %). Évite le clignotement quand on flotte sur la frontière.
- **Dwell** : une fois posé sur un index, exiger un **petit délai** (ex. 90–140 ms) avant d'autoriser un nouveau changement, OU n'autoriser le changement que lorsque la **vélocité du progress est faible** (`Math.abs(progress.getVelocity()) < seuil`). Donne l'impression que l'élément « tient sa place » un instant.

> Pseudo : `if (Math.abs(velocity) < 0.05 && candidate !== active && elapsedSinceLast > 100) setActive(candidate)`.

### 3.4 « Se pose et reste » (micro-pause expressive)
Pour qu'un élément focal *respire* une fois arrivé : enchaîner un **settle spring** (arrivée) + une **micro-keyframe d'accueil** (ex. scale `1 → 1.015 → 1` sur 320 ms, ease emphasized-decelerate) déclenchée à la pose. Effet « il s'installe ». À garder discret (≤ 1.5 % d'amplitude) pour rester calme.

---

## 4. Scroll-driven smoothness

- **Lisser `scrollYProgress`** avec `useSpring` (déjà fait partout) — mais **ajouter `restDelta: 0.001`** pour un arrêt net, et **monter la mass** (0.9–1.1) pour un suivi « posé » plutôt que collé. [Motion useScroll], [DEV smooth scrolling].
- **`skipInitialAnimation: true`** sur le `useSpring` de scroll : évite l'animation parasite au montage quand la mesure DOM arrive (sinon la scène « glisse » à l'arrivée). [Motion useSpring].
- **Ne pas faire de scroll-jacking agressif** : garder le scroll natif (la scène reste `sticky`, on n'intercepte/`preventDefault` jamais la molette). Le snap programmatique doit seulement *terminer* le geste, pas le confisquer. C'est déjà l'approche du code (bonne base). [synthèse wave3, point 5.4].
- **`useReducedMotion()`** : repli plat et complet, navigable (jamais une page morte). Déjà respecté partout. [Motion], [code projet].
- **Normaliser les deltas** trackpad/molette si on fait du snap manuel (les deltas varient énormément) — sinon le calibrage paraît cassé sur un appareil.

---

## 5. Orchestration (séquencement = sensation de calme)

- **Stagger** : `staggerChildren` 60–90 ms pour une grille premium (assez pour lire la cascade, pas assez pour traîner) ; `delayChildren` ~80–120 ms pour laisser le conteneur se poser avant que les enfants entrent. [Motion transitions].
- **AnimatePresence `mode`** :
  - `"wait"` : l'entrant attend que le sortant soit parti → idéal pour un **focal unique** (un seul projet montré à la fois : Métronome, Spotlight, swap de vidéo focale). Astuce premium : **ease complémentaire** — `easeIn` sur l'exit, `easeOut` sur l'enter. [Motion AnimatePresence modes].
  - `"popLayout"` : le sortant quitte le flux immédiatement, les voisins **se réorganisent** pendant sa sortie → idéal **grilles/listes** où les items reflowent (Bento, Masonry, filtrage). Requiert un parent non-`static` et `forwardRef` sur les enfants custom. [Motion AnimatePresence modes].
  - `"sync"` (défaut) : entrée/sortie simultanées, bref chevauchement — usage général. [Motion].
- **Layout transitions** (`layout` / `layoutId`) : pour qu'un élément « voyage » entre deux états plutôt que de pop. Utiliser un spring *settle* sur le `layout` (`transition={{ layout: settle }}`). Désactiver la 3D pendant un `layout` animé (risque de z-fighting Safari). [synthèse wave3, point 5.5].
- **Régle du calme** : une scène = **une cascade, pas dix animations concurrentes**. Décaler dans le temps (stagger + delayChildren) donne plus de calme que tout lancer ensemble.

---

## 6. Micro-détails premium (60 fps)

- **Animer uniquement `transform` et `opacity`** (compositées GPU). **Éviter** d'animer `width`, `height`, `top`, `left`, `margin` (déclenchent layout/reflow → saccades). [web.dev], [IBM motion].
  - Constat code : `RiftView` anime `height` de la faille (`riftHeight` + `willChange:'height'`) — c'est un coût layout. Alternative premium : `scaleY` sur un bloc de hauteur fixe + `transform-origin`, ou `clip-path` (inset) qui est composité.
- **`will-change: transform`** sur les éléments animés en continu (déjà présent sur Wheel/Rift). À retirer hors animation (un `will-change` permanent partout coûte de la mémoire GPU).
- **`blur()`/`filter` = coût n°1** : flouter **une seule couche de fond**, jamais N items ; rayon plafonné ; gate du filtre au voisinage proche. (Wheel floute par carte mais plafonne à 3px et coupe < 8° — acceptable ; à surveiller si N grand.) [synthèse wave3, point 5.5].
- **`mix-blend-mode` + `mask-image` + `preserve-3d` empilés** cassent/rament sur Safari → tester tôt, désactiver la 3D pendant les `layout`.
- **`backface-visibility: hidden`** + `transform: translateZ(0)` pour forcer une couche de composition propre sur les éléments 3D (déjà fait).
- **Throttle pointermove via MotionValue** (pas de `setState` par mouvement) pour les vues survol/drag — déjà la pratique du code.

---

## 7. STANDARD DE TRANSITION PARTAGÉ — pseudo-`src/motion.ts`

> But : **un seul fichier** importé par toutes les vues → cohérence du « feeling », fin du copier-coller de `const SPRING`. À placer en `src/motion.ts` (ou `src/theme/motion.ts`). Valeurs chiffrées, prêtes à coder. (Reste DANS ce .md — ne pas créer le fichier ici.)

```ts
// src/motion.ts — STANDARD DE TRANSITION PARTAGÉ (Framer Motion v11 pur)
import { animate, type MotionValue } from 'framer-motion';

/* ----------------------------------------------------------------------------
 * 1) SPRINGS — physique. ζ = damping / (2*sqrt(stiffness*mass)).
 *    On vise ζ ≈ 0.85–1.0 : se pose, un soupçon de vie, AUCUN rebond parasite.
 *    restDelta/restSpeed bas = arrêt NET (anti-jitter de fin, anti-traîne).
 * -------------------------------------------------------------------------- */
export const springs = {
  /** Suivi de geste/scroll « posé mais vivant ». ζ≈0.92. Défaut universel. */
  settle:  { type: 'spring', stiffness: 120, damping: 24, mass: 1,   restDelta: 0.001, restSpeed: 0.01 },
  /** Très calme/lourd : grandes scènes, palettes, héros. ζ≈1.0, traîne douce. */
  gentle:  { type: 'spring', stiffness: 90,  damping: 26, mass: 1.1, restDelta: 0.001, restSpeed: 0.01 },
  /** Réactif sans être sec : drag direct, boutons, petits éléments. ζ≈0.82. */
  snappy:  { type: 'spring', stiffness: 220, damping: 26, mass: 1,   restDelta: 0.001 },
  /** Drag/objet manipulé (bras de lecture, tiroir) : suit le doigt, se cale. ζ≈0.9. */
  drag:    { type: 'spring', stiffness: 300, damping: 32, mass: 1,   restDelta: 0.001 },
  /** Lissage de scrollYProgress : posé, arrêt net, pas d'anim au montage. */
  scroll:  { stiffness: 100, damping: 30, mass: 1, restDelta: 0.001, skipInitialAnimation: true },
} as const;

/* ----------------------------------------------------------------------------
 * 2) EASES — courbes cubic-bezier nommées (transitions non-spring).
 * -------------------------------------------------------------------------- */
export const eases = {
  standard:    [0.4, 0, 0.2, 1],   // déplacements (begin & end at rest)
  decelerate:  [0, 0, 0.2, 1],     // ENTRÉE (finit au repos) — le défaut « apparition »
  accelerate:  [0.4, 0, 1, 1],     // SORTIE (part du repos, quitte l'écran)
  emphasized:  [0.2, 0, 0, 1],     // héros expressif
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1],
  expoOut:     [0.16, 1, 0.3, 1],  // PREMIUM : longue traîne très douce
  quintOut:    [0.22, 1, 0.36, 1], // premium, traîne marquée
} as const;

/* ----------------------------------------------------------------------------
 * 3) DURÉES (secondes, car Framer attend des secondes).
 * -------------------------------------------------------------------------- */
export const durations = {
  micro:  0.16,  // 160ms — hover, toggle, focus
  short:  0.24,  // 240ms
  medium: 0.34,  // 340ms — apparition tuile, overlay
  long:   0.5,   // 500ms — changement de scène
  hero:   0.7,   // 700ms — ouverture héros / grande distance
} as const;

/* ----------------------------------------------------------------------------
 * 4) TWEENS prêts à l'emploi (entrée/sortie premium).
 *    Règle : sortie ≈ 70% de l'entrée + ease complémentaire (in à la sortie).
 * -------------------------------------------------------------------------- */
export const tweens = {
  enter: { duration: durations.medium, ease: eases.expoOut },
  exit:  { duration: durations.short,  ease: eases.accelerate },
  reveal:{ duration: durations.long,   ease: eases.emphasizedDecelerate }, // clip-path, masque
} as const;

/* ----------------------------------------------------------------------------
 * 5) ORCHESTRATION (stagger calme).
 * -------------------------------------------------------------------------- */
export const orchestration = {
  container: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  item: {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: tweens.enter },
  },
} as const;

/* ----------------------------------------------------------------------------
 * 6) HELPERS de snap / dwell — le « temps d'arrêt » réutilisable.
 * -------------------------------------------------------------------------- */

/** Snap un MotionValue [0..1] vers la fraction k/(n-1) la plus proche, avec settle. */
export function snapToIndex(mv: MotionValue<number>, n: number) {
  if (n <= 1) return;
  const p = mv.get();
  const idx = Math.max(0, Math.min(n - 1, Math.round(p * (n - 1))));
  animate(mv, idx / (n - 1), springs.settle);
}

/** Détecte l'arrêt du scroll (debounce) puis exécute `onRest`. À câbler sur 'scroll'/'wheel'. */
export function onScrollRest(onRest: () => void, delay = 140) {
  let t: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(t);
    t = setTimeout(onRest, delay);
  };
}

/**
 * Index actif avec HYSTÉRÉSIS + DWELL : ne bascule que si on dépasse la frontière
 * + marge ET si la vélocité est faible ET après un petit délai. Anti-jitter.
 * Retourne le nouvel index (ou l'ancien si on doit « tenir »).
 */
export function dwellIndex(opts: {
  progress: number;      // 0..1
  velocity: number;      // progress.getVelocity()
  n: number;
  current: number;
  lastChangeMs: number;  // performance.now() du dernier changement
  margin?: number;       // 0..0.5, défaut 0.12 (hystérésis)
  minDwellMs?: number;   // défaut 110
  maxVelocity?: number;  // défaut 0.06
}): number {
  const { progress, velocity, n, current, lastChangeMs } = opts;
  const margin = opts.margin ?? 0.12;
  const minDwellMs = opts.minDwellMs ?? 110;
  const maxVelocity = opts.maxVelocity ?? 0.06;
  if (Math.abs(velocity) > maxVelocity) return current;             // ça bouge encore
  if (performance.now() - lastChangeMs < minDwellMs) return current; // on tient la pose
  const exact = progress * (n - 1);
  const candidate = Math.round(exact);
  // hystérésis : il faut franchir la frontière + margin pour basculer
  if (Math.abs(exact - current) < 0.5 + margin) return current;
  return Math.max(0, Math.min(n - 1, candidate));
}

/** Micro-accueil « il s'installe » à jouer quand un focal se pose (≤1.5% scale). */
export const settleGreet = {
  scale: [1, 1.015, 1],
  transition: { duration: 0.32, ease: eases.emphasizedDecelerate },
} as const;
```

---

## 8. Recommandations AVANT / APRÈS par vue

### Règle transverse (toutes les vues)
- **AVANT** : `const SPRING = { stiffness: 70–90, damping: 20–24, mass: 0.5–0.6 }` redéclaré localement, **sans `restDelta`**.
- **APRÈS** : `import { springs } from '../motion'` → utiliser `springs.scroll` pour lisser `scrollYProgress`, `springs.settle` pour le focal. Gain : feeling unifié, arrêt net (restDelta 0.001), suivi « posé » (mass 1 au lieu de 0.5).

### Couloir (CorridorView) — scroll 3D
- **AVANT** : `useSpring(travelRaw, { stiffness: 90, damping: 24, mass: 0.6 })` ; focal = `Math.round(t / Z_STEP)` à chaque change (pas de dwell). Mal de mer possible (mass faible, suit le scroll de près).
- **APRÈS** :
  1. `travel = useSpring(travelRaw, springs.scroll)` (mass 1, restDelta 0.001, skipInitialAnimation) → traversée plus « posée », moins de mal de mer.
  2. Focal via `dwellIndex(...)` (hystérésis + vélocité) → la salle active ne clignote plus quand on flotte entre deux panneaux.
  3. **Snap au repos** : `onScrollRest(() => snapToIndex(progressMV, n))` pour que le couloir se *cale* sur une salle quand on lâche la molette → vrai « temps d'arrêt » au point focal.
  4. À la pose du focal, jouer `settleGreet` sur le panneau redressé (il « s'installe » face caméra).

### Faille (RiftView) — scroll, deux plaques + strates
- **AVANT** : `{ stiffness: 80, damping: 24, mass: 0.6 }` ; faille animée en **`height`** (`riftHeight` + `willChange:'height'`) = coût layout ; focal = nearest center sans dwell.
- **APRÈS** :
  1. `progress = useSpring(scrollYProgress, springs.scroll)`.
  2. **Remplacer l'anim de `height` par `scaleY`** (bloc de hauteur fixe 54vh, `transform-origin: center`) ou `clip-path: inset(...)` → composité, 60 fps. Gain smooth direct.
  3. Décompression des strates : garder `scaleY/rotateX` mais via `tweens.reveal` (emphasized-decelerate) pour les transitions discrètes, et `dwellIndex` pour le focal `aria-live`.
  4. **Snap** sur le centre de strate au repos → la faille se pose pile sur un focal qui joue, au lieu de glisser entre deux.

### Roue (WheelView) — scroll 3D rotatif
- **AVANT** : `{ stiffness: 70, damping: 20, mass: 0.5 }` (réponse rapide, **pas de pose**) ; active = `Math.round` continu.
- **APRÈS** :
  1. `rotation = useSpring(rotationRaw, springs.scroll)` (mass 1) → la roue tourne avec plus d'inertie/poids = plus premium.
  2. **Snap polaire** au repos : `animate(rotationMV, nearestMultipleOf(360/n), springs.settle)` → la carte active se cale **pile face caméra** et y reste (le manque actuel de « cran » est exactement ce qui fait « pas au point »).
  3. `dwellIndex` pour `active` (anti-clignotement de la légende).
  4. `settleGreet` sur la carte qui arrive face caméra.

### Livre (BookView) — scroll 3D, tournage de page
- **AVANT** : `{ stiffness: 90, damping: 22, mass: 0.6 }` ; `page = progress*n` continu.
- **APRÈS** :
  1. `useSpring(scrollYProgress, springs.scroll)`.
  2. **Snap à la page entière** au repos (`snapToIndex` sur le progress, n pages) → une page se tourne **et se pose à plat** (ouverte), pas figée à mi-tournage. C'est le « temps d'arrêt » naturel d'un livre.
  3. Le rabat de page : `rotateY` piloté par le progress lissé ; à la pose, `springs.settle` finit le geste.

### Métronome (MetronomeView) — focal unique cadencé
- **APRÈS** : c'est le cas d'usage type d'**`AnimatePresence mode="wait"`** + **ease complémentaire** (`exit: tweens.exit` en `accelerate`, `enter: tweens.enter` en `expoOut`). Le balancier (`useSpring` d'angle) en `springs.gentle` (lourd/calme). Le « temps fort » = micro-pause (`settleGreet`) sur le projet sur le temps.

### Grilles/listes (Bento, Masonry, Grid, EditorialList) — apparition
- **APRÈS** : `orchestration.container` + `orchestration.item` (stagger 70 ms, entrée `expoOut`). Pour le filtrage/réordonnancement : **`AnimatePresence mode="popLayout"`** + `layout` avec `transition={{ layout: springs.settle }}` → les tuiles reflowent en douceur et se posent.

### Survol (HoverExpand, Spotlight, Chambre noire, Darkroom)
- **APRÈS** : transitions de hover en `springs.snappy` (réactif, ζ≈0.82, se pose sans rebond) ou tween `durations.micro` + `eases.decelerate`. Le filtre/masque suit le pointeur via MotionValue (pas de setState). Le retour au repos en `springs.gentle` (la révélation « se referme » doucement = micro-pause inversée).

---

## 9. Les 5 règles d'or (smooth + temps d'arrêt)

1. **Ease-out partout pour l'entrée, ease-in court pour la sortie.** L'élément démarre vite, **décélère** et se pose ; il quitte l'écran en accélérant (sortie ≈ 70 % de la durée d'entrée). Jamais d'ease-in sur une entrée (ça paraît mou/en retard).
2. **Un ressort premium se pose (ζ ≈ 0.85–1.0), il ne rebondit pas.** Régler `damping = 2·ζ·√(stiffness·mass)` ; **monter la mass vers ~1** (pas 0.5) pour le « poids/pose » ; **toujours `restDelta: 0.001`** pour un arrêt net (fin du jitter et de la traîne).
3. **Crée des temps d'arrêt explicites : snap + dwell.** Au repos du scroll, anime le progress vers l'ancre la plus proche (`snapToIndex` + `springs.settle`) ; n'autorise le changement d'élément actif que sous **hystérésis + vélocité faible + mini-délai** (`dwellIndex`). L'élément se pose ET reste un instant.
4. **N'anime que `transform` et `opacity` (et `clip-path`/`scaleY` au lieu de `width`/`height`).** Composité GPU = 60 fps. Floute une seule couche de fond, jamais N items. `will-change` ciblé, retiré hors anim.
5. **Orchestration = calme.** Une cascade staggerée (70–90 ms) plutôt que dix anims simultanées ; `AnimatePresence mode="wait"` pour un focal unique (ease complémentaire), `"popLayout"` + `layout` pour les grilles. Et **jamais de scroll-jacking** : on *termine* le geste vers l'ancre, on ne confisque jamais la molette ; `useReducedMotion` = repli plat complet.

---

## 10. Sources

**Easing & durées (références chiffrées)**
- Material Design 3 — Easing and duration tokens : https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
- Material Design 1 — Duration & easing : https://m1.material.io/motion/duration-easing.html
- Material Design 2 — Speed : https://m2.material.io/design/motion/speed.html
- Norton Design System — Motion (cubic-bezier + durées ms) : https://wwnorton.github.io/design-system/docs/foundations/motion/
- IBM Design Language — Motion UI basics : https://design-language-website.netlify.app/design/language/motion-ui/basics/
- Carbon Design System — Motion : https://carbondesignsystem.com/elements/motion/overview/
- easings.net (expoOut/quintOut/quartOut) : https://easings.net/
- MUI v6 — Transitions (intégration easing/durée) : https://mui.com/material-ui/customization/transitions/

**Spring physics**
- Josh W. Comeau — A Friendly Introduction to Spring Physics : https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/
- Maxime Heckel — The physics behind spring animations : https://blog.maximeheckel.com/posts/the-physics-behind-spring-animations/
- Motion (Framer Motion) — React transitions (spring/tween, restDelta, restSpeed, bounce) : https://motion.dev/docs/react-transitions

**Scroll smoothing / snap / orchestration**
- Motion — useScroll (scroll-linked + smoothing) : https://motion.dev/docs/react-scroll-animations
- Motion — useSpring (skipInitialAnimation, smoothing) : https://motion.dev/docs/react-use-spring
- Motion — AnimatePresence modes (wait/popLayout/sync) : https://motion.dev/tutorials/react-animate-presence-modes
- Motion — AnimatePresence (docs) : https://motion.dev/docs/react-animate-presence
- MDN — CSS scroll snap : https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap
- web.dev — Well-controlled scrolling with CSS Scroll Snap : https://web.dev/articles/css-scroll-snap
- CSS-Tricks — Practical CSS Scroll Snapping : https://css-tricks.com/practical-css-scroll-snapping/
- DEV — Smooth scrolling with React & Framer Motion : https://dev.to/ironcladdev/smooth-scrolling-with-react-framer-motion-dih

**Contexte projet**
- `src/theme.ts` (aucun token de motion — gap à combler), `src/views/{CorridorView,WheelView,RiftView,BookView}.tsx` (springs locaux 70–90 / 20–24 / 0.5–0.6, sans restDelta/snap/dwell), `brainstorm/wave3/00-synthese.md` (perf flous, scroll-jacking, reduced-motion).
</content>
</invoke>
