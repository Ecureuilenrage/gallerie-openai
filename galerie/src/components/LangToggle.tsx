import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { useI18n, type Lang } from '../i18n';

const MONO = 'ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, monospace';

/**
 * Mini-toggle FR/EN intégré à la galerie. Pratique en mode autonome (hors site
 * hôte) et lorsque la page hôte ne fournit pas son propre sélecteur. Quand la
 * galerie est embarquée, il reste synchrone avec le toggle du site (cf. `i18n`).
 */
export default function LangToggle() {
  const { lang, setLang } = useI18n();
  const langs: Lang[] = ['fr', 'en'];

  return (
    <Box
      role="group"
      aria-label="Langue / Language"
      sx={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 11,
        display: 'flex',
        gap: 0.5,
        px: 0.75,
        py: 0.5,
        borderRadius: 999,
        bgcolor: 'rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.14)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {langs.map((l) => {
        const active = l === lang;
        return (
          <ButtonBase
            key={l}
            disableRipple
            onClick={() => setLang(l)}
            aria-pressed={active}
            aria-label={l === 'fr' ? 'Français' : 'English'}
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 999,
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: active ? '#0b0b0c' : 'rgba(255,255,255,0.7)',
              bgcolor: active ? 'rgba(255,255,255,0.92)' : 'transparent',
              transition: 'color .2s, background-color .2s',
              '&:hover': { color: active ? '#0b0b0c' : '#fff' },
            }}
          >
            {l.toUpperCase()}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
