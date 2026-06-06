import { useCallback, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

/**
 * Distingue un clic d'un drag. On mémorise la position au pointerdown ; au clic,
 * si le pointeur a bougé de plus de `threshold` px, on considère que c'était un
 * drag et on annule l'ouverture du lien. (Utilisé par ProjectTile en mode 'div'.)
 */
export function useDragGuard(threshold = 6) {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  }, []);

  const didMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      if (!start.current) return false;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      return Math.hypot(dx, dy) > threshold;
    },
    [threshold],
  );

  return { onPointerDown, didMove };
}
