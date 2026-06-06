import { useMemo } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useI18n } from '../i18n';

const MONO = 'ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, monospace';

/**
 * Bouton « Retour » (haut-gauche) vers la page d'accueil du site hôte. La cible est
 * fournie par la page via l'attribut `data-home-href` sur `#gallery-root` (ex.
 * `./index.html`). En mode autonome (montage sur `#root`, dev/preview) l'attribut
 * est absent → le bouton est masqué, faute de page d'accueil hôte. Miroir visuel
 * du `LangToggle` (haut-droite).
 */
export default function BackButton() {
  const { t } = useI18n();

  const href = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const root = document.getElementById('gallery-root');
    return root?.dataset.homeHref?.trim() || null;
  }, []);

  if (!href) return null;

  return (
    <ButtonBase
      component="a"
      href={href}
      disableRipple
      aria-label={t('nav.back')}
      sx={{
        position: 'fixed',
        top: 12,
        left: 12,
        zIndex: 11,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        pl: 0.75,
        pr: 1.25,
        py: 0.5,
        borderRadius: 999,
        bgcolor: 'rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.14)',
        backdropFilter: 'blur(6px)',
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.7)',
        transition: 'color .2s',
        '&:hover': { color: '#fff' },
      }}
    >
      <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
      <Box component="span">{t('nav.back')}</Box>
    </ButtonBase>
  );
}
