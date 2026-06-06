import { useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import CreditsView from './CreditsView';
import TimelineEditorView from './views/TimelineEditorView';
import ImageTrailView from './views/ImageTrailView';
import ViewSwitcher from './components/ViewSwitcher';
import LangToggle from './components/LangToggle';
import BackButton from './components/BackButton';
import { useAltLightbox } from './components/AltLightboxHost';
import { useParticipants } from './hooks/useParticipants';
import { useI18n } from './i18n';
import type { ViewMode } from './types';

/**
 * Galerie des participants — shell qui orchestre trois vues d'une même donnée :
 * « Générique » (vue principale, plein écran) + deux vues alternatives (Banc de
 * montage, Traînée d'images) issues de la shortlist du brainstorm. Le sélecteur
 * en bas à droite bascule entre elles ; les vues alternatives ouvrent le lecteur
 * Google Drive partagé (`useAltLightbox`). Le toggle FR/EN (en haut à droite) se
 * synchronise avec le site hôte.
 *
 * Données : CSV publié du Google Sheet (`lib/csv.ts`) ; repli sur l'instantané
 * embarqué en cas d'échec réseau.
 */
export default function App() {
  const { projects, loading, error } = useParticipants();
  const [view, setView] = useState<ViewMode>('credits');
  const { open: openProject, node: altLightbox } = useAltLightbox();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#060607' }}>
      {loading ? (
        <Splash />
      ) : view === 'credits' ? (
        <CreditsView projects={projects} />
      ) : (
        <Box sx={{ minHeight: '100vh', p: { xs: 1.5, md: 3 }, pt: { xs: 7, md: 8 } }}>
          {view === 'timeline' ? (
            <TimelineEditorView projects={projects} onOpenProject={openProject} />
          ) : (
            <ImageTrailView projects={projects} onOpenProject={openProject} />
          )}
        </Box>
      )}

      {!loading && error && <OfflineBadge />}
      {!loading && <ViewSwitcher activeView={view} onChange={setView} />}
      <BackButton />
      <LangToggle />
      {altLightbox}
    </Box>
  );
}

/** Écran de chargement sobre pendant le fetch du CSV. */
function Splash() {
  const { t } = useI18n();
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        color: 'rgba(255,255,255,0.6)',
      }}
    >
      <CircularProgress size={28} sx={{ color: 'rgba(255,255,255,0.6)' }} />
      <Typography
        sx={{
          fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
          fontSize: 11,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
        }}
      >
        {t('app.loading')}
      </Typography>
    </Box>
  );
}

/** Pastille discrète : le live a échoué, on affiche le repli hors-ligne. */
function OfflineBadge() {
  const { t } = useI18n();
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 12,
        left: 12,
        zIndex: 10,
        px: 1.25,
        py: 0.5,
        borderRadius: 999,
        bgcolor: 'rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.14)',
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}
    >
      {t('app.offline')}
    </Box>
  );
}
