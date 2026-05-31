/** Un projet de participant affiché dans la galerie. */
export type Project = {
  id: string;
  title: string;
  author: string;
  /** Image = thumbnail de la vidéo du projet. */
  thumbnail: string;
  /** Dimensions connues du thumbnail (ratio sans préchargement). */
  width: number;
  height: number;
  /** Destination au clic (ouverte dans un nouvel onglet). */
  href: string;
  /** site externe du participant | page hébergée. */
  kind: 'site' | 'page';
  /** Vidéo d'aperçu, montée uniquement sur la tuile active (léger). */
  previewVideo?: string;
  /** Regroupement optionnel (thème / cohorte). Non utilisé par cette vue. */
  group?: string;
};

/** Props communes attendues par la vue. */
export type GalleryViewProps = {
  projects: Project[];
};
