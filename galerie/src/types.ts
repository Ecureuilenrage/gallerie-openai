/** Nature d'une ressource annexe d'un projet. */
export type ResourceKind = 'video' | 'pdf' | 'prompts' | 'site';

/** Ressource secondaire d'un projet (2ᵉ vidéo, document, prompts, site externe). */
export type Resource = {
  kind: ResourceKind;
  label: string;
  href: string;
  /** Pour `kind: 'video'` ou `kind: 'pdf'` (Google Drive) : identifiant de fichier,
   * monté en iframe dans la lightbox (lecteur vidéo ou visionneuse PDF). */
  driveId?: string;
};

/** Un projet de participant affiché dans la galerie. */
export type Project = {
  id: string;
  /** Numéro d'ordre issu du CSV (colonne `num`). */
  num: number;
  title: string;
  author: string;
  /** Image = vignette (poster) de la vidéo héros. */
  thumbnail: string;
  /** Dimensions connues du thumbnail (ratio sans préchargement). */
  width: number;
  height: number;
  /** Destination au clic en mode lien (`<a>`). Vidéo Drive ou site externe. */
  href: string;
  /** Projet vidéo (lightbox) | site externe sans vidéo (nouvel onglet). */
  kind: 'video' | 'site';
  /** Identifiant Google Drive de la vidéo héros. Pilote vignette + lightbox. */
  videoId?: string;
  /** Lien externe (colonne `lien`) : site / dépôt du participant. Bouton d'étiquette. */
  link?: string;
  /** Lien des prompts (colonne `prompts`, Google Drive). Bouton d'étiquette. */
  promptsHref?: string;
  /** Ressources annexes : 2ᵉ vidéo, PDF, prompts, site. Toujours défini (peut être vide). */
  resources: Resource[];
  /** Vidéo d'aperçu mp4 (héritage du POC). Non utilisé avec Google Drive. */
  previewVideo?: string;
  /** Regroupement optionnel (thème / cohorte). Non utilisé par cette vue. */
  group?: string;
};

/** Props communes attendues par la vue. */
export type GalleryViewProps = {
  projects: Project[];
};

/** Vues disponibles : « Générique » (principale) + 2 vues alternatives. */
export type ViewMode = 'credits' | 'timeline' | 'trail';
