import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import type { ViewMode } from '../types';
import { useI18n } from '../i18n';

const MONO = 'ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, monospace';

/**
 * Sélecteur de vue, posé en bas à droite (au-dessus de l'OfflineBadge, zIndex 11).
 *
 * - Sur la vue principale (« Générique ») : un libellé « Vue alternative » suivi de
 *   deux boutons (Banc de montage / Traînée d'images).
 * - Sur une vue alternative : un bouton « ← Retour » (vers le Générique) + les deux
 *   boutons alternatifs, l'actif surligné, pour basculer directement entre elles.
 */
export default function ViewSwitcher({
  activeView,
  onChange,
}: {
  activeView: ViewMode;
  onChange: (view: ViewMode) => void;
}) {
  const { t } = useI18n();
  const onCredits = activeView === 'credits';

  const pillSx = (active: boolean) =>
    ({
      px: 1.25,
      py: 0.5,
      borderRadius: 999,
      fontFamily: MONO,
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      color: active ? '#0b0b0c' : 'rgba(255,255,255,0.72)',
      bgcolor: active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.06)',
      border: '1px solid',
      borderColor: active ? 'transparent' : 'rgba(255,255,255,0.18)',
      transition: 'color .2s, background-color .2s, border-color .2s',
      '&:hover': {
        color: active ? '#0b0b0c' : '#fff',
        borderColor: active ? 'transparent' : 'rgba(255,255,255,0.45)',
      },
    }) as const;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        zIndex: 11,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.25,
        py: 0.75,
        borderRadius: 999,
        bgcolor: 'rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.14)',
        backdropFilter: 'blur(6px)',
        maxWidth: 'calc(100vw - 24px)',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      }}
    >
      {onCredits ? (
        <Box
          component="span"
          sx={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          {t('switcher.altLabel')}
        </Box>
      ) : (
        <ButtonBase
          disableRipple
          onClick={() => onChange('credits')}
          aria-label={t('switcher.back')}
          sx={pillSx(false)}
        >
          {t('switcher.back')}
        </ButtonBase>
      )}

      <ButtonBase
        disableRipple
        onClick={() => onChange('timeline')}
        aria-pressed={activeView === 'timeline'}
        sx={pillSx(activeView === 'timeline')}
      >
        {t('switcher.timeline')}
      </ButtonBase>
      <ButtonBase
        disableRipple
        onClick={() => onChange('trail')}
        aria-pressed={activeView === 'trail'}
        sx={pillSx(activeView === 'trail')}
      >
        {t('switcher.trail')}
      </ButtonBase>
    </Box>
  );
}
