import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { GalleryViewProps, Project } from './types';
import ProjectTile from './components/ProjectTile';
import { springsScroll, dwellIndex } from './motion';

/**
 * CreditsView — « Générique (titres) ».
 *
 * Un générique de film qui DÉFILE verticalement, cadencé par le SCROLL d'un
 * CONTENEUR INTERNE (`useScroll({ container })` -> `scrollYProgress`, lissé par
 * `useSpring(springsScroll)`). On lit le scroll NATIF du conteneur : la molette
 * fait remonter le générique DANS le cadre, jamais la page derrière
 * (`overscroll-behavior: contain` empêche la propagation au document).
 *
 * Chaque participant = un bloc de générique : un RÔLE (« Réalisation »…) et le nom
 * de l'auteur, puis le titre du projet. Multiplicité = la liste complète défile.
 * Quand un bloc arrive au CENTRE, sa vignette se révèle dans le moniteur fixe et
 * joue (`playing`, une seule `<video>`) ; focal stabilisé par `dwellIndex`
 * (hystérésis anti-clignotement). Clic sur un nom = ouvre le projet. `scroll-snap`
 * léger par bloc pour des « temps d'arrêt ».
 *
 * Esprit titre de film : fond noir, typo Inter soignée, espacement généreux.
 * `useReducedMotion()` : liste statique lisible (pas de défilement piloté ni
 * d'auto-scroll), focus au survol/tap. Mobile : le conteneur scrolle au doigt.
 */

const ROLES = [
  'Réalisation',
  'Image',
  'Montage',
  'Son',
  'Production',
  'Direction artistique',
  'Étalonnage',
  'Musique originale',
  'Effets visuels',
] as const;

function roleFor(index: number) {
  return ROLES[index % ROLES.length];
}

type CreditBlockProps = {
  project: Project;
  index: number;
  active: boolean;
  reduce: boolean;
  onActivate: () => void;
};

/** Un bloc de générique : rôle + nom, façon carton de fin. */
function CreditBlock({ project, index, active, reduce, onActivate }: CreditBlockProps) {
  return (
    <Box
      component={motion.div}
      role="link"
      tabIndex={0}
      aria-label={`${roleFor(index)} — ${project.author} · ${project.title}, ouvrir`}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      animate={reduce ? undefined : { opacity: active ? 1 : 0.32 }}
      transition={{ duration: 0.4 }}
      sx={{
        textAlign: 'center',
        cursor: 'pointer',
        py: { xs: 4, md: 6 },
        outline: 'none',
        opacity: reduce ? 0.9 : undefined,
        '&:focus-visible .credit-name': { textDecoration: 'underline', textUnderlineOffset: 4 },
        '&:hover .credit-name': { color: '#fff' },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 11, md: 12 },
          letterSpacing: '0.34em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          mb: 1,
        }}
      >
        {roleFor(index)}
      </Typography>
      <Typography
        className="credit-name"
        sx={{
          fontSize: { xs: 26, md: 38 },
          fontWeight: 300,
          letterSpacing: '0.02em',
          color: active ? '#fff' : 'rgba(255,255,255,0.85)',
          lineHeight: 1.1,
          transition: 'color 0.3s',
        }}
      >
        {project.author}
      </Typography>
      <Typography
        sx={{
          mt: 1,
          fontSize: { xs: 13, md: 15 },
          fontStyle: 'italic',
          letterSpacing: '0.04em',
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        « {project.title} »
      </Typography>
    </Box>
  );
}

export default function CreditsView({ projects }: GalleryViewProps) {
  const reduce = useReducedMotion() ?? false;
  const n = projects.length;

  // Scroll d'un CONTENEUR INTERNE : on lit son scroll natif, la page derrière ne
  // bouge pas. `useScroll({ container })`.
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: scrollerRef });
  const smooth = useSpring(scrollYProgress, springsScroll);

  // Le ruban de générique remonte légèrement à mesure du scroll, pour appuyer le
  // sens « ça défile » (le scroll natif fait l'essentiel ; ceci ajoute un parallax
  // discret centré sur le bloc focal). De +6vh à -6vh.
  const roll = useTransform(smooth, [0, 1], ['6vh', '-6vh']);

  // Focal stabilisé par dwellIndex (hystérésis + dwell anti-clignotement).
  const [focal, setFocal] = useState(0);
  const lastChange = useRef(performance.now());

  useMotionValueEvent(smooth, 'change', (p) => {
    if (reduce) return;
    const next = dwellIndex({
      progress: p,
      velocity: smooth.getVelocity(),
      n,
      current: focal,
      lastChangeMs: lastChange.current,
    });
    if (next !== focal) {
      lastChange.current = performance.now();
      setFocal(next);
    }
  });

  // En reduced-motion, la colonne ne défile pas : on neutralise le transform.
  useEffect(() => {
    if (reduce) setFocal(0);
  }, [reduce]);

  const focalProject = projects[focal];
  const activate = (p: Project) => window.open(p.href, '_blank', 'noopener,noreferrer');

  // --- Repli reduced-motion : liste statique lisible, pas de scroll piloté. ---
  if (reduce) {
    return (
      <Box sx={{ bgcolor: '#060607', borderRadius: 3, p: { xs: 2, md: 4 }, color: '#fff' }}>
        <Typography
          sx={{
            fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
            fontSize: 12,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            mb: 3,
            textAlign: 'center',
          }}
        >
          Générique · {n} participants
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {projects.map((p, i) => (
            <Box key={p.id} sx={{ width: '100%', maxWidth: 520 }}>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 1.5 }}>
                <ProjectTile
                  project={p}
                  as="a"
                  aspect={16 / 9}
                  overlayTitle
                  elevateOnHover={false}
                  previewOnHover
                />
              </Box>
              <CreditBlock project={p} index={i} active reduce onActivate={() => activate(p)} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // --- Mode plein : générique défilant dans un conteneur INTERNE, moniteur centré. ---
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        bgcolor: '#060607',
        borderRadius: 3,
        overflow: 'hidden',
        color: '#fff',
      }}
    >
      {/* Scène FIXE (overlay) : moniteur du focal + voiles + étiquette. Ne scrolle
          pas ; pointerEvents: none pour laisser passer la molette au conteneur. */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '86%', md: 560 },
            borderRadius: 2,
            overflow: 'hidden',
            opacity: 0.5,
            boxShadow: '0 30px 90px rgba(0,0,0,0.7)',
            maskImage: 'radial-gradient(120% 100% at 50% 50%, #000 55%, transparent 100%)',
          }}
        >
          {focalProject && (
            <ProjectTile
              key={focalProject.id}
              project={focalProject}
              as="div"
              aspect={16 / 9}
              showCaption={false}
              elevateOnHover={false}
              playing
            />
          )}
        </Box>
      </Box>

      {/* Voile dégradé haut/bas (fondu de générique) */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(to bottom, #060607 0%, transparent 22%, transparent 78%, #060607 100%)',
          zIndex: 2,
        }}
      />

      {/* Étiquette discrète */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
            fontSize: 11,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          Générique · défilez
        </Typography>
      </Box>

      {/* CONTENEUR DE SCROLL INTERNE : capte la molette/le doigt. `overscroll-behavior:
          contain` empêche de propager au document -> la page derrière ne bouge pas. */}
      <Box
        ref={scrollerRef}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
          scrollSnapType: 'y proximity',
          WebkitOverflowScrolling: 'touch',
          // scrollbar masquée pour un rendu cinéma
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {/* Ruban de générique : padding haut/bas = 50vh pour que le 1er et le
            dernier bloc puissent atteindre le CENTRE du cadre. */}
        <Box
          component={motion.div}
          role="list"
          aria-label="Générique : rôles et noms des participants."
          style={{ y: roll }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 640,
            mx: 'auto',
            px: 2,
            py: '50vh',
          }}
        >
          {projects.map((p, i) => (
            <Box
              key={p.id}
              role="listitem"
              sx={{ width: '100%', scrollSnapAlign: 'center' }}
            >
              <CreditBlock
                project={p}
                index={i}
                active={i === focal}
                reduce={false}
                onActivate={() => activate(p)}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
