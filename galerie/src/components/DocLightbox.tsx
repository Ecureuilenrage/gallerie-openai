import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { drivePreview } from '../lib/drive';
import { useI18n } from '../i18n';

export type DocLightboxProps = {
  /** Identifiant Google Drive du document à afficher. `null` = modale fermée. */
  driveId: string | null;
  /** Titre accessible (ex. « Document — Rosa Cinelli »). */
  title?: string;
  onClose: () => void;
};

/**
 * Visionneuse de document Google Drive (PDF) intégrée. Même mise en page sombre
 * que `VideoLightbox` : l'iframe `/preview` du Drive affiche le PDF directement
 * dans la galerie, sans nouvel onglet. L'iframe est montée seulement quand un
 * document est sélectionné, et démontée à la fermeture.
 */
export default function DocLightbox({ driveId, title, onClose }: DocLightboxProps) {
  const { t } = useI18n();
  const open = Boolean(driveId);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-label={title ?? t('lightbox.docFallback')}
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

      <Box sx={{ position: 'relative', width: '100%', height: { xs: '70vh', md: '80vh' } }}>
        {driveId && (
          <Box
            component="iframe"
            key={driveId}
            src={drivePreview(driveId)}
            title={title ?? t('lightbox.docIframeFallback')}
            allow="autoplay; encrypted-media"
            allowFullScreen
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        )}
      </Box>
    </Dialog>
  );
}
