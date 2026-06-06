import { useState } from 'react';
import { styled } from '@mui/material/styles';
import type { Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayCircleOutlineRounded from '@mui/icons-material/PlayCircleOutlineRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { useDragGuard } from '../hooks/useDragGuard';
import { useI18n } from '../i18n';

export type ProjectTileProps = {
  project: Project;
  /** 'a' (défaut) = vrai lien ; 'div' = role=link + clavier, pour les vues draggables. */
  as?: 'a' | 'div';
  /** Ratio forcé (ex. 4/3, '16/9') ; 'auto' = ratio naturel issu de width/height. */
  aspect?: number | 'auto' | string;
  /** L'image remplit une cellule dont la taille est imposée par la vue. */
  fill?: boolean;
  /** Titre/auteur en overlay sur l'image plutôt qu'en légende dessous. */
  overlayTitle?: boolean;
  /** false = média seul, le texte est géré par la vue. */
  showCaption?: boolean;
  /** false = masque le badge rond (icône type) en haut à droite. */
  showBadge?: boolean;
  /** false quand la vue gère elle-même l'élévation. */
  elevateOnHover?: boolean;
  /** Override de l'action au clic (mode 'div'). Par défaut: window.open(href). */
  onActivate?: (project: Project) => void;
  /** Contrôlé par la vue : lit l'aperçu vidéo sur cette tuile (carte active/centrée). */
  playing?: boolean;
  /** Non contrôlé : la tuile lit l'aperçu vidéo au survol/focus. Ignoré si `playing` est fourni. */
  previewOnHover?: boolean;
};

const cardBase = (theme: Theme): CSSObject => ({
  position: 'relative',
  display: 'block',
  width: '100%',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  color: 'inherit',
  textDecoration: 'none',
  cursor: 'pointer',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  outline: 'none',
  WebkitTapHighlightColor: 'transparent',
  '& .pt-img': {
    transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
  },
  '&:hover .pt-img, &:focus-visible .pt-img': {
    transform: 'scale(1.045)',
  },
  '& .pt-play': {
    opacity: 0.55,
    transform: 'translate(-50%, -50%) scale(0.9)',
    transition: 'opacity 0.3s, transform 0.3s',
  },
  '&:hover .pt-play, &:focus-visible .pt-play': {
    opacity: 1,
    transform: 'translate(-50%, -50%) scale(1)',
  },
  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.palette.background.default}, 0 0 0 4px ${theme.palette.primary.main}`,
  },
});

const CardAnchor = styled(motion.a)(({ theme }) => cardBase(theme));
const CardDiv = styled(motion.div)(({ theme }) => cardBase(theme));

const HOVER_TRANSITION = { type: 'spring' as const, stiffness: 300, damping: 26 };

export default function ProjectTile(props: ProjectTileProps) {
  const {
    project,
    as = 'a',
    aspect,
    fill = false,
    overlayTitle = false,
    showCaption = true,
    showBadge = true,
    elevateOnHover = true,
    onActivate,
    playing,
    previewOnHover = false,
  } = props;

  const { t } = useI18n();
  const { onPointerDown, didMove } = useDragGuard();
  const [hovered, setHovered] = useState(false);
  const shouldPlay = (playing ?? (previewOnHover ? hovered : false)) && Boolean(project.previewVideo);

  const ratio = fill
    ? undefined
    : aspect === 'auto'
      ? `${project.width} / ${project.height}`
      : aspect == null
        ? '4 / 3'
        : typeof aspect === 'number'
          ? String(aspect)
          : aspect;

  const captionOverlay = showCaption && (overlayTitle || fill);
  const captionBelow = showCaption && !captionOverlay;
  const hoverAnim = elevateOnHover ? { y: -6 } : undefined;

  const media = (
    <Box
      className="pt-media"
      sx={
        fill
          ? { position: 'absolute', inset: 0, overflow: 'hidden' }
          : { position: 'relative', width: '100%', overflow: 'hidden' }
      }
    >
      {project.thumbnail ? (
        <Box
          component="img"
          className="pt-img"
          src={project.thumbnail}
          alt={project.title}
          draggable={false}
          loading="lazy"
          sx={{
            display: 'block',
            width: '100%',
            objectFit: 'cover',
            ...(fill ? { height: '100%' } : { height: 'auto', aspectRatio: ratio }),
          }}
        />
      ) : (
        // Aucune image disponible : fond sombre uni (pas de placeholder externe).
        <Box
          className="pt-img"
          aria-hidden
          sx={{
            display: 'block',
            width: '100%',
            backgroundColor: '#0c0d10',
            ...(fill ? { height: '100%' } : { aspectRatio: ratio }),
          }}
        />
      )}

      {shouldPlay && project.previewVideo && (
        <Box
          component="video"
          className="pt-video"
          src={project.previewVideo}
          autoPlay
          muted
          loop
          playsInline
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {project.kind !== 'site' && (
        <Box
          className="pt-play"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            color: '#fff',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
            pointerEvents: 'none',
          }}
        >
          <PlayCircleOutlineRounded sx={{ fontSize: 56, display: 'block' }} />
        </Box>
      )}

      {showBadge && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.92)',
            color: 'text.primary',
            boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          }}
        >
          {project.kind === 'site' ? (
            <OpenInNewRounded sx={{ fontSize: 16 }} />
          ) : (
            <DescriptionRounded sx={{ fontSize: 16 }} />
          )}
        </Box>
      )}

      {captionOverlay && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            p: 1.5,
            background: 'linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0))',
            color: '#fff',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {project.title}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            {project.author}
          </Typography>
        </Box>
      )}
    </Box>
  );

  const caption = captionBelow ? (
    <Box sx={{ px: 0.5, py: 1.25 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
        {project.title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {project.author}
      </Typography>
    </Box>
  ) : null;

  const ariaLabel =
    project.kind === 'site'
      ? t('tile.openSite', { title: project.title, author: project.author })
      : t('tile.openVideo', { title: project.title, author: project.author });

  if (as === 'a') {
    return (
      <CardAnchor
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        whileHover={hoverAnim}
        transition={HOVER_TRANSITION}
        style={fill ? { height: '100%' } : undefined}
        onMouseEnter={() => previewOnHover && setHovered(true)}
        onMouseLeave={() => previewOnHover && setHovered(false)}
        onFocus={() => previewOnHover && setHovered(true)}
        onBlur={() => previewOnHover && setHovered(false)}
      >
        {media}
        {caption}
      </CardAnchor>
    );
  }

  const activate = () => {
    if (onActivate) onActivate(project);
    else window.open(project.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <CardDiv
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
      whileHover={hoverAnim}
      transition={HOVER_TRANSITION}
      style={fill ? { height: '100%' } : undefined}
      onMouseEnter={() => previewOnHover && setHovered(true)}
      onMouseLeave={() => previewOnHover && setHovered(false)}
      onFocusCapture={() => previewOnHover && setHovered(true)}
      onBlurCapture={() => previewOnHover && setHovered(false)}
      onPointerDown={onPointerDown}
      onClick={(e) => {
        if (didMove(e)) {
          e.preventDefault();
          return;
        }
        activate();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      }}
    >
      {media}
      {caption}
    </CardDiv>
  );
}
