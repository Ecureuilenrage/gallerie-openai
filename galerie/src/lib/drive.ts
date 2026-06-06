/**
 * Aides Google Drive. Les vidéos des participants sont des fichiers Drive
 * partagés ; le CSV les fournit dans des formats variés (`/file/d/ID/view`,
 * `/file/d/ID/preview`, `?id=ID`). On en extrait l'identifiant pour construire
 * l'URL d'embed (lecteur) et l'URL de vignette (poster).
 */

/** Extrait l'identifiant d'une URL Google Drive (ou `undefined` si absente). */
export function driveId(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  const m = url.match(/\/d\/([A-Za-z0-9_-]+)/) ?? url.match(/[?&]id=([A-Za-z0-9_-]+)/);
  return m?.[1];
}

/** URL d'embed du lecteur Google Drive (montée dans l'iframe de la lightbox). */
export const drivePreview = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

/** Vignette (poster) Google Drive haute définition à partir d'un identifiant. */
export const driveThumb = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1280`;
