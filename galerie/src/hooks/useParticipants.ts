import { useEffect, useState } from 'react';
import type { Project } from '../types';
import { fetchParticipants } from '../lib/csv';
import { FALLBACK } from '../data/participants';

export type ParticipantsState = {
  projects: Project[];
  loading: boolean;
  /** Message si le live a échoué (on retombe alors sur le repli hors-ligne). */
  error: string | null;
};

/**
 * Affichage instantané depuis la copie locale embarquée (`FALLBACK`, dérivée du
 * CSV) — pas de splash, pas d'attente réseau. En arrière-plan, on rafraîchit
 * silencieusement depuis le Google Sheet publié : si le live aboutit, on met à
 * jour les projets ; s'il échoue, on garde la copie locale (aucune erreur affichée).
 */
export function useParticipants(): ParticipantsState {
  const [state, setState] = useState<ParticipantsState>({
    projects: FALLBACK,
    loading: false,
    error: null,
  });

  useEffect(() => {
    let alive = true;
    fetchParticipants()
      .then((projects) => {
        if (alive && projects.length > 0) {
          setState({ projects, loading: false, error: null });
        }
      })
      .catch(() => {
        /* refresh silencieux : on conserve la copie locale déjà affichée */
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
