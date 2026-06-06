import type { ComponentType } from 'react';

/** Un projet de participant affiché dans la galerie. */
export type Project = {
  id: string;
  title: string;
  author: string;
  /** Image = thumbnail de la vidéo du projet. */
  thumbnail: string;
  /** Dimensions connues du thumbnail -> ratio sans préchargement (Masonry/Justified). */
  width: number;
  height: number;
  /** Destination au clic (ouverte dans un nouvel onglet). */
  href: string;
  /** site externe du participant | page hébergée (PDF converti en web). */
  kind: 'site' | 'page';
  /** Vidéo d'aperçu, montée uniquement sur la tuile active/survolée (léger). */
  previewVideo?: string;
  /**
   * Regroupement optionnel (thème ou cohorte). Exploité par les vues qui
   * groupent les projets (Racine, Constellation, Faille…) pour porter du sens ;
   * les vues qui l'utilisent doivent se replier proprement sur l'index si absent.
   */
  group?: string;
};

export type ViewFamily =
  | 'Grilles & layouts'
  | 'Scroll-driven'
  | 'Interactions'
  | 'Concepts (hors-piste)';

/** Props communes à toutes les vues de galerie. */
export type GalleryViewProps = {
  projects: Project[];
};

export type GalleryView = ComponentType<GalleryViewProps>;

/** Entrée du registre de vues, consommée par ViewSelector et GalleryShell. */
export type ViewEntry = {
  id: string;
  label: string;
  family: ViewFamily;
  Component: GalleryView;
};
