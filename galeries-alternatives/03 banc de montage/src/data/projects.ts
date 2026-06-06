import type { Project } from '../types';

/**
 * Données de DÉMONSTRATION (9 projets). Remplacez-les par vos vrais projets :
 * thumbnail (image d'aperçu), href (destination au clic), kind ('site' | 'page'),
 * previewVideo (URL d'une vidéo muette pour l'aperçu sur la tuile au centre).
 * Les placeholders utilisent picsum.photos et des vidéos d'exemple publiques.
 */
const dim = (id: string, w: number, h: number) => `https://picsum.photos/seed/${id}/${w}/${h}`;

const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
];

const base: Project[] = [
  { id: 'aurora', title: 'Aurora', author: 'Camille Lefèvre', width: 800, height: 600, thumbnail: dim('aurora', 800, 600), href: 'https://example.com/aurora', kind: 'site' },
  { id: 'meridian', title: 'Meridian', author: 'Hugo Bernard', width: 600, height: 800, thumbnail: dim('meridian', 600, 800), href: 'https://example.com/meridian', kind: 'page' },
  { id: 'cobalt', title: 'Cobalt', author: 'Salomé Roy', width: 800, height: 800, thumbnail: dim('cobalt', 800, 800), href: 'https://example.com/cobalt', kind: 'site' },
  { id: 'helios', title: 'Helios', author: 'Noah Garnier', width: 1200, height: 800, thumbnail: dim('helios', 1200, 800), href: 'https://example.com/helios', kind: 'page' },
  { id: 'verdant', title: 'Verdant', author: 'Inès Marchal', width: 800, height: 1000, thumbnail: dim('verdant', 800, 1000), href: 'https://example.com/verdant', kind: 'site' },
  { id: 'lumen', title: 'Lumen', author: 'Adam Faure', width: 1000, height: 600, thumbnail: dim('lumen', 1000, 600), href: 'https://example.com/lumen', kind: 'page' },
  { id: 'sable', title: 'Sable', author: 'Léa Dumont', width: 700, height: 900, thumbnail: dim('sable', 700, 900), href: 'https://example.com/sable', kind: 'page' },
  { id: 'onyx', title: 'Onyx', author: 'Raphaël Petit', width: 900, height: 700, thumbnail: dim('onyx', 900, 700), href: 'https://example.com/onyx', kind: 'site' },
  { id: 'zephyr', title: 'Zephyr', author: 'Manon Girard', width: 800, height: 600, thumbnail: dim('zephyr', 800, 600), href: 'https://example.com/zephyr', kind: 'site' },
];

export const projects: Project[] = base.map((p, i) => ({
  ...p,
  previewVideo: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length],
}));
