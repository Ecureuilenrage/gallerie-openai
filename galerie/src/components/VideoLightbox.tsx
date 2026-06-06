import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import { drivePreview } from '../lib/drive';
import type { Project, Resource } from '../types';
import { useI18n } from '../i18n';

export type VideoLightboxProps = {
  /** Projet ouvert (fournit le titre et la barre de ressources). `null` = fermée. */
  project: Project | null;
  /** Identifiant Google Drive de la vidéo en cours de lecture. */
  videoId: string | null;
  /** Lit une autre vidéo Drive (ex. « Vidéo 2 ») sans fermer la lightbox. */
  onPlay: (driveId: string) => void;
  /** Ouvre un document Drive (PDF) dans la visionneuse intégrée. */
  onOpenDoc?: (driveId: string) => void;
  onClose: () => void;
};

const RESOURCE_ICON: Record<Resource['kind'], React.ReactNode> = {
  video: <PlayArrowRounded sx={{ fontSize: 18 }} />,
  pdf: <DescriptionRounded sx={{ fontSize: 18 }} />,
  prompts: <AutoAwesomeRounded sx={{ fontSize: 18 }} />,
  site: <OpenInNewRounded sx={{ fontSize: 18 }} />,
};

/**
 * Lightbox de lecture Google Drive. L'iframe est montée seulement quand une
 * vidéo est sélectionnée, et démontée à la fermeture (le son est coupé net).
 * Sous la vidéo, une barre expose les ressources du projet : 2ᵉ vidéo (rejoue
 * dans la même lightbox), document PDF, prompts, site externe (nouvel onglet).
 * Fermeture par Échap ou clic en dehors (géré par `Dialog`).
 */
export default function VideoLightbox({ project, videoId, onPlay, onOpenDoc, onClose }: VideoLightboxProps) {
  const { t } = useI18n();
  const open = Boolean(project && videoId);
  const resources = project?.resources ?? [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-label={
        project ? t('lightbox.playerAria', { author: project.author }) : t('lightbox.playerAriaFallback')
      }
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#000',
            backgroundImage: 'none',
            boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
            overflow: 'hidden',
            m: { xs: 1, md: 3 },
          },
        },
        backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.86)' } },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label={t('lightbox.close')}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          color: 'rgba(255,255,255,0.85)',
          bgcolor: 'rgba(0,0,0,0.35)',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
        }}
      >
        <CloseRounded />
      </IconButton>

      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
        {videoId && (
          <Box
            component="iframe"
            // `key` force le remontage quand on change de vidéo (Vidéo 1 ↔ Vidéo 2).
            key={videoId}
            src={`${drivePreview(videoId)}`}
            title={
              project ? t('lightbox.videoTitle', { author: project.author }) : t('lightbox.videoTitleFallback')
            }
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        )}
      </Box>

      {resources.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            px: { xs: 1.5, md: 2 },
            py: 1.5,
            bgcolor: '#0a0a0b',
          }}
        >
          {resources.map((r, i) => {
            const isActiveVideo = r.kind === 'video' && r.driveId === videoId;
            const common = {
              size: 'small' as const,
              variant: 'outlined' as const,
              startIcon: RESOURCE_ICON[r.kind],
              sx: {
                color: isActiveVideo ? '#000' : 'rgba(255,255,255,0.92)',
                bgcolor: isActiveVideo ? 'rgba(255,255,255,0.92)' : 'transparent',
                borderColor: 'rgba(255,255,255,0.25)',
                borderRadius: 999,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  bgcolor: isActiveVideo ? '#fff' : 'rgba(255,255,255,0.08)',
                },
              },
            };

            if (r.kind === 'video' && r.driveId) {
              const id = r.driveId;
              return (
                <Button key={i} {...common} onClick={() => onPlay(id)} aria-pressed={isActiveVideo}>
                  {r.label}
                </Button>
              );
            }
            // PDF hébergé sur Drive : ouvre la visionneuse intégrée (pas de nouvel onglet).
            if (r.kind === 'pdf' && r.driveId && onOpenDoc) {
              const id = r.driveId;
              return (
                <Button key={i} {...common} onClick={() => onOpenDoc(id)}>
                  {r.label}
                </Button>
              );
            }
            return (
              <Button
                key={i}
                {...common}
                component="a"
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {r.label}
              </Button>
            );
          })}
        </Box>
      )}
    </Dialog>
  );
}
