// motion.ts — extrait du standard de transition partagé, réduit à ce qu'utilise
// la vue « Générique (titres) » : le lissage du scroll + le helper de « dwell ».
// ζ (ratio d'amortissement) = damping / (2*sqrt(stiffness*mass)). Cible ζ≈0.85–1.0
// = se pose, un soupçon de vie, AUCUN rebond. restDelta bas = arrêt net.

/** Options pour `useSpring(scrollYProgress, springsScroll)` : posé, arrêt net. */
export const springsScroll = {
  stiffness: 100,
  damping: 30,
  mass: 1,
  restDelta: 0.001,
} as const;

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
