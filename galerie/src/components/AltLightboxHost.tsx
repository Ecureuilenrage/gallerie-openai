import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { Project } from '../types';
import { useI18n } from '../i18n';
import VideoLightbox from './VideoLightbox';
import DocLightbox from './DocLightbox';

/**
 * Lightbox partagée par les vues alternatives (Banc de montage, Traînée d'images).
 *
 * Les prototypes n'ont pas leur propre lecteur : au clic sur une tuile/clip, on
 * réutilise la MÊME `VideoLightbox`/`DocLightbox` (lecteur Google Drive plein
 * écran) que la galerie principale, pour une expérience cohérente.
 *
 * `open(project)` : si le projet a une vidéo Drive (`videoId`) -> lecteur ; sinon
 * (site / lien externe) -> nouvel onglet. `node` est le JSX des modales à monter.
 */
export function useAltLightbox(): { open: (project: Project) => void; node: ReactNode } {
  const { t } = useI18n();
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null);

  const open = useCallback((project: Project) => {
    if (project.videoId) {
      setOpenProject(project);
      setVideoId(project.videoId);
    } else if (project.href) {
      window.open(project.href, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const closeVideo = useCallback(() => {
    setOpenProject(null);
    setVideoId(null);
  }, []);

  const node = (
    <>
      <VideoLightbox
        project={openProject}
        videoId={videoId}
        onPlay={setVideoId}
        onOpenDoc={setDocId}
        onClose={closeVideo}
      />
      <DocLightbox
        driveId={docId}
        title={
          openProject
            ? t('lightbox.docTitle', { author: openProject.author })
            : t('lightbox.docFallback')
        }
        onClose={() => setDocId(null)}
      />
    </>
  );

  return { open, node };
}
