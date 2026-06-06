// src/motion.ts — STANDARD DE TRANSITION PARTAGÉ (Framer Motion v11 pur)
//
// Un seul fichier importé par les vues -> cohérence du « feeling » : transitions
// smooth (ressorts qui se posent sans rebond parasite) + « temps d'arrêt » (snap
// au repos + dwell/hystérésis anti-clignotement). Issu de la recherche vague 4
// (brainstorm/wave4-research/03-art-transition.md).
//
// ζ (ratio d'amortissement) = damping / (2*sqrt(stiffness*mass)). Cible ζ≈0.85–1.0
// = se pose, un soupçon de vie, AUCUN rebond. restDelta/restSpeed bas = arrêt net.
import { animate, type MotionValue } from 'framer-motion';

/* 1) SPRINGS — physique. */
export const springs = {
  /** Suivi de geste/scroll « posé mais vivant ». ζ≈0.92. Défaut universel. */
  settle: { type: 'spring', stiffness: 120, damping: 24, mass: 1, restDelta: 0.001, restSpeed: 0.01 },
  /** Très calme/lourd : grandes scènes, palettes, héros. ζ≈1.0, traîne douce. */
  gentle: { type: 'spring', stiffness: 90, damping: 26, mass: 1.1, restDelta: 0.001, restSpeed: 0.01 },
  /** Réactif sans être sec : drag direct, boutons, petits éléments. ζ≈0.82. */
  snappy: { type: 'spring', stiffness: 220, damping: 26, mass: 1, restDelta: 0.001 },
  /** Drag/objet manipulé (bras de lecture, tiroir) : suit le doigt, se cale. ζ≈0.9. */
  drag: { type: 'spring', stiffness: 300, damping: 32, mass: 1, restDelta: 0.001 },
} as const;

/** Options pour `useSpring(scrollYProgress, springsScroll)` : posé, arrêt net, pas d'anim au montage. */
export const springsScroll = {
  stiffness: 100,
  damping: 30,
  mass: 1,
  restDelta: 0.001,
} as const;

/* 2) EASES — cubic-bezier nommées (transitions non-spring). */
export const eases = {
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1], // ENTRÉE (finit au repos) — défaut « apparition »
  accelerate: [0.4, 0, 1, 1], // SORTIE (part du repos)
  emphasized: [0.2, 0, 0, 1],
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1],
  expoOut: [0.16, 1, 0.3, 1], // PREMIUM : longue traîne très douce
  quintOut: [0.22, 1, 0.36, 1],
} as const;

/* 3) DURÉES (secondes — Framer attend des secondes). */
export const durations = {
  micro: 0.16,
  short: 0.24,
  medium: 0.34,
  long: 0.5,
  hero: 0.7,
} as const;

/* 4) TWEENS prêts à l'emploi. Règle : sortie ≈ 70% de l'entrée + ease complémentaire. */
export const tweens = {
  enter: { duration: durations.medium, ease: eases.expoOut },
  exit: { duration: durations.short, ease: eases.accelerate },
  reveal: { duration: durations.long, ease: eases.emphasizedDecelerate }, // clip-path, masque
} as const;

/* 5) ORCHESTRATION (stagger calme). */
export const orchestration = {
  container: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  item: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: tweens.enter },
  },
} as const;

/* 6) HELPERS de snap / dwell — le « temps d'arrêt » réutilisable. */

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
 * + marge ET si la vélocité est faible ET après un petit délai. Anti-clignotement.
 */
export function dwellIndex(opts: {
  progress: number; // 0..1
  velocity: number; // scrollYProgress.getVelocity()
  n: number;
  current: number;
  lastChangeMs: number; // performance.now() du dernier changement
  margin?: number; // 0..0.5, défaut 0.12 (hystérésis)
  minDwellMs?: number; // défaut 110
  maxVelocity?: number; // défaut 0.06
}): number {
  const { progress, velocity, n, current, lastChangeMs } = opts;
  const margin = opts.margin ?? 0.12;
  const minDwellMs = opts.minDwellMs ?? 110;
  const maxVelocity = opts.maxVelocity ?? 0.06;
  if (Math.abs(velocity) > maxVelocity) return current; // ça bouge encore
  if (performance.now() - lastChangeMs < minDwellMs) return current; // on tient la pose
  const exact = progress * (n - 1);
  const candidate = Math.round(exact);
  if (Math.abs(exact - current) < 0.5 + margin) return current; // hystérésis
  return Math.max(0, Math.min(n - 1, candidate));
}

/**
 * Micro-accueil « il s'installe » à jouer quand un focal se pose (≤1.5% scale).
 * `scale`/`ease` typés mutables (number[]) pour être passés directement à
 * `animate()` / `style` sans copie (les keyframes Framer refusent un tuple readonly).
 */
export const settleGreet = {
  scale: [1, 1.015, 1] as number[],
  transition: { duration: 0.32, ease: eases.emphasizedDecelerate },
};
