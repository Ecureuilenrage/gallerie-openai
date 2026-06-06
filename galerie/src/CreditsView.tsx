import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import OpenInFullRounded from '@mui/icons-material/OpenInFullRounded';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { GalleryViewProps, Project } from './types';
import { drivePreview } from './lib/drive';
import ProjectTile from './components/ProjectTile';
import VideoLightbox from './components/VideoLightbox';
import DocLightbox from './components/DocLightbox';
import { useI18n } from './i18n';

// Largeur de la colonne d'actions (rail), à droite de la vidéo. Sert aussi à la
// cale invisible de gauche pour garder la vidéo centrée sur grand écran.
const RAIL_WIDTH = { xs: 112, md: 140 };

// Pile monospace (esprit « carton de générique ») sans dépendance nouvelle.
const MONO = 'ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, monospace';

/**
 * Style des boutons du rail — proposition n°5 « étiquette de générique » :
 * monospace, lettrage espacé, lignes fines ; au survol un tiret marqueur s'allonge,
 * le mot respire (padding + letter-spacing) et l'index s'éclaire.
 */
const railItemSx = (horizontal: boolean) =>
  ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: horizontal ? 'auto' : '100%',
    fontFamily: MONO,
    fontSize: { xs: 10.5, md: 11.5 },
    fontWeight: 500,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    py: horizontal ? 1 : 1.5,
    pl: horizontal ? 1.5 : 1.75,
    pr: horizontal ? 1.5 : 0.5,
    borderRadius: horizontal ? 999 : 0,
    border: horizontal ? '1px solid rgba(255,255,255,0.18)' : 0,
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    transition:
      'color .3s ease, padding-left .3s ease, letter-spacing .3s ease, border-color .3s ease',
    '& .rail-dash': horizontal
      ? { display: 'none' }
      : {
          position: 'absolute',
          left: 0,
          top: '50%',
          height: '1px',
          width: 0,
          bgcolor: '#fff',
          transform: 'translateY(-50%)',
          transition: 'width .3s cubic-bezier(0.22,1,0.36,1)',
        },
    '& .rail-index': { ml: 'auto', pl: 1.25, fontSize: 10, color: '#6ea8fe', opacity: 0.7 },
    '&:hover, &:focus-visible': horizontal
      ? { color: '#fff', borderColor: 'rgba(255,255,255,0.5)', letterSpacing: '0.26em' }
      : { color: '#fff', pl: '26px', letterSpacing: '0.3em' },
    '&:hover .rail-dash, &:focus-visible .rail-dash': { width: '16px' },
  }) as const;

/**
 * CreditsView — « Générique (titres) », une vidéo à la fois.
 *
 * Mise en scène : une SEULE vidéo occupe le centre du cadre, avec le NOM de son
 * créateur superposé EN PLEIN MILIEU. Autour, en blanc sur noir et atténués :
 * le nom du participant PRÉCÉDENT au-dessus, le SUIVANT en dessous — les autres
 * noms n'apparaissent jamais sur leur propre vidéo.
 *
 * Navigation PILOTÉE PAR PAS (pas de scroll natif). Chaque geste — molette, swipe,
 * flèches — avance d'EXACTEMENT un projet, avec un court délai (`STEP_COOLDOWN`)
 * entre deux pas. Conséquence : impossible de sauter un projet sans le voir, donc
 * CHAQUE transition est animée ; un scroll continu enchaîne des pas réguliers (on
 * va vite, mais on voit tout passer). Clic sur la vidéo / Entrée = lit la vidéo
 * dans une lightbox (ou ouvre le site pour les cartes « site »).
 *
 * `useReducedMotion()` : liste statique lisible (pas de navigation pilotée).
 */

// Variantes d'entrée/sortie. `custom` = direction (1 vers le bas, -1 vers le haut)
// pour que les éléments arrivent/partent dans le sens du défilement.
const videoVariants = {
  enter: (dir: number) => ({ opacity: 0, y: dir >= 0 ? 70 : -70, scale: 0.96 }),
  center: { opacity: 1, y: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, y: dir >= 0 ? -70 : 70, scale: 0.96 }),
};

const sideNameVariants = {
  enter: (dir: number) => ({ opacity: 0, y: dir >= 0 ? 24 : -24 }),
  center: { opacity: 0.42, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir >= 0 ? -24 : 24 }),
};

const TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

// Réglages de la navigation par pas.
const STEP_COOLDOWN = 430; // ms mini entre deux pas (cadence du défilement continu)
const WHEEL_THRESHOLD = 28; // delta molette à dépasser pour déclencher un pas
const SWIPE_THRESHOLD = 44; // px de swipe tactile pour déclencher un pas

export default function CreditsView({ projects }: GalleryViewProps) {
  const { t } = useI18n();
  const reduce = useReducedMotion() ?? false;
  const n = projects.length;

  const [focal, setFocal] = useState(0);
  const [dir, setDir] = useState(1);

  // Lightbox Google Drive : `openProject` = projet ouvert (null = fermée),
  // `videoId` = vidéo Drive en cours de lecture (héros ou « Vidéo 2 »).
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const closeLightbox = () => {
    setOpenProject(null);
    setVideoId(null);
  };

  // Document (PDF Drive) affiché en visionneuse intégrée par-dessus le lecteur.
  const [docId, setDocId] = useState<string | null>(null);

  // Survol de la tuile centrale : monte l'iframe Drive pour lire inline.
  const [hovering, setHovering] = useState(false);

  // Avance/recule d'un pas, borné. La direction sert à orienter l'animation.
  const step = useCallback(
    (delta: number) => {
      setFocal((prev) => {
        const next = Math.max(0, Math.min(n - 1, prev + delta));
        if (next !== prev) setDir(delta > 0 ? 1 : -1);
        return next;
      });
    },
    [n],
  );

  const goTo = useCallback((index: number) => {
    setFocal((prev) => {
      if (index === prev) return prev;
      setDir(index > prev ? 1 : -1);
      return index;
    });
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lockedRef = useRef(false);
  const accumRef = useRef(0);

  // Molette + tactile : écouteurs NON passifs (pour `preventDefault`) posés à la main.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduce) return;

    const doStep = (d: number) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      step(d);
      window.setTimeout(() => {
        lockedRef.current = false;
      }, STEP_COOLDOWN);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // pas de scroll natif : on pilote nous-mêmes
      if (lockedRef.current) {
        accumRef.current = 0;
        return;
      }
      accumRef.current += e.deltaY;
      if (Math.abs(accumRef.current) >= WHEEL_THRESHOLD) {
        const d = accumRef.current > 0 ? 1 : -1;
        accumRef.current = 0;
        doStep(d);
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // empêche le scroll élastique du document
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = (e.changedTouches[0]?.clientY ?? touchStartY) - touchStartY;
      if (Math.abs(dy) > SWIPE_THRESHOLD) doStep(dy < 0 ? 1 : -1);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [reduce, step]);

  // Changer de projet coupe le survol (sinon l'iframe persiste sur la nouvelle vidéo).
  useEffect(() => {
    setHovering(false);
  }, [focal]);

  const focalProject = projects[focal];
  const prevProject = focal > 0 ? projects[focal - 1] : null;
  const nextProject = focal < n - 1 ? projects[focal + 1] : null;

  // Clic / Entrée : vidéo -> lightbox ; site sans vidéo -> nouvel onglet.
  const activate = (p: Project) => {
    if (p.videoId) {
      setOpenProject(p);
      setVideoId(p.videoId);
    } else if (p.kind === 'site') {
      window.open(p.href, '_blank', 'noopener,noreferrer');
    }
  };

  // Ouvre le lecteur sur une vidéo Drive précise (ex. « Vidéo 2 » depuis le rail).
  const playVideo = (p: Project, id: string) => {
    setOpenProject(p);
    setVideoId(id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault();
        step(1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        step(-1);
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(n - 1);
        break;
      case 'Enter':
        e.preventDefault();
        activate(focalProject);
        break;
      default:
        break;
    }
  };

  // --- Repli reduced-motion : liste statique lisible, nom centré sur chaque vidéo. ---
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
          {t('credits.reducedTitle', { n })}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          {projects.map((p) => (
            <Box key={p.id} sx={{ width: '100%', maxWidth: 560 }}>
              <Box
                sx={{
                  position: 'relative',
                  aspectRatio: '16 / 9',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <ProjectTile
                  project={p}
                  as="div"
                  fill
                  showCaption={false}
                  showBadge={false}
                  elevateOnHover={false}
                  onActivate={() => activate(p)}
                />
                <NameOverlay author={p.author} />
              </Box>
              <ActionRail
                project={p}
                onPlayVideo={(id) => playVideo(p, id)}
                onOpenDoc={setDocId}
                horizontal
              />
            </Box>
          ))}
        </Box>
        <VideoLightbox
          project={openProject}
          videoId={videoId}
          onPlay={setVideoId}
          onOpenDoc={setDocId}
          onClose={closeLightbox}
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
      </Box>
    );
  }

  // --- Mode plein : une vidéo centrée, noms voisins au-dessus / en dessous. ---
  return (
    <Box
      ref={containerRef}
      tabIndex={0}
      role="group"
      aria-roledescription={t('credits.aria.roledescription')}
      aria-label={t('credits.aria.label')}
      onKeyDown={onKeyDown}
      sx={{
        position: 'relative',
        height: '100vh',
        bgcolor: '#060607',
        borderRadius: 3,
        overflow: 'hidden',
        color: '#fff',
        outline: 'none',
        touchAction: 'none', // on gère le tactile nous-mêmes
      }}
    >
      {/* Scène : nom précédent (haut, cliquable), vidéo + nom (centre, cliquable),
          nom suivant (bas, cliquable). Le reste est décoratif (pointerEvents none). */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {/* Nom du PRÉCÉDENT */}
        <Box
          sx={{
            minHeight: { xs: '15vh', md: '17vh' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence custom={dir} initial={false} mode="wait">
            {prevProject && (
              <Typography
                component={motion.p}
                key={prevProject.id}
                custom={dir}
                variants={sideNameVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={TRANSITION}
                onClick={() => step(-1)}
                sx={{
                  m: 0,
                  fontSize: { xs: 16, md: 22 },
                  fontWeight: 300,
                  letterSpacing: '0.04em',
                  color: '#fff',
                  textAlign: 'center',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                }}
              >
                {prevProject.author}
              </Typography>
            )}
          </AnimatePresence>
        </Box>

        {/* Rangée centrale : vidéo centrée + rail d'actions à SA DROITE (hors incrustation).
            La cale invisible de gauche (même largeur que le rail) recentre la vidéo. */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 1, md: 2.5 },
            width: '100%',
          }}
        >
          <Box aria-hidden sx={{ flex: '0 0 auto', width: RAIL_WIDTH, display: { xs: 'none', md: 'block' } }} />

          {/* Vidéo centrale + nom du créateur au milieu */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '70%', sm: '62%', md: 580 },
              aspectRatio: '16 / 9',
              flex: '0 0 auto',
            }}
          >
            <AnimatePresence custom={dir} initial={false} mode="popLayout">
              <Box
                component={motion.div}
                key={focalProject.id}
                custom={dir}
                variants={videoVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={TRANSITION}
                sx={{ position: 'absolute', inset: 0 }}
              >
              <Box
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 30px 90px rgba(0,0,0,0.6)',
                  pointerEvents: 'auto',
                }}
              >
                {/* Vignette + nom : cliquable pour ouvrir le lecteur (cas tactile / hors survol). */}
                <Box
                  role="link"
                  aria-label={t('credits.openAria', {
                    author: focalProject.author,
                    title: focalProject.title,
                  })}
                  onClick={() => activate(focalProject)}
                  sx={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
                >
                  <ProjectTile
                    project={focalProject}
                    as="div"
                    fill
                    showCaption={false}
                    showBadge={false}
                    elevateOnHover={false}
                  />
                  <NameOverlay
                    author={focalProject.author}
                    dimmed={hovering && Boolean(focalProject.videoId)}
                  />
                </Box>

                {/* Survol : lecture inline via l'iframe Drive (montée seulement au survol). */}
                {hovering && focalProject.videoId && (
                  <Box
                    component="iframe"
                    key={focalProject.videoId}
                    src={drivePreview(focalProject.videoId)}
                    title={t('credits.previewAria', { author: focalProject.author })}
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, zIndex: 1 }}
                  />
                )}

                {/* Bouton agrandir : visible au survol uniquement, ouvre le lecteur. */}
                {hovering && focalProject.videoId && (
                  <IconButton
                    onClick={() => activate(focalProject)}
                    aria-label={t('credits.fullscreen')}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 3,
                      color: '#fff',
                      bgcolor: 'rgba(0,0,0,0.45)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    }}
                  >
                    <OpenInFullRounded sx={{ fontSize: 18 }} />
                  </IconButton>
                )}

              </Box>
              </Box>
            </AnimatePresence>
          </Box>

          {/* Rail d'actions, dans une colonne À DROITE de la vidéo (hors incrustation).
              `key` = projet courant → l'animation d'entrée en décalé rejoue à chaque pas. */}
          <Box
            sx={{
              flex: '0 0 auto',
              width: RAIL_WIDTH,
              display: 'flex',
              justifyContent: 'flex-start',
              pointerEvents: 'auto',
            }}
          >
            <ActionRail
              key={focalProject.id}
              project={focalProject}
              onPlayVideo={(id) => playVideo(focalProject, id)}
              onOpenDoc={setDocId}
            />
          </Box>
        </Box>

        {/* Nom du SUIVANT */}
        <Box
          sx={{
            minHeight: { xs: '15vh', md: '17vh' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence custom={dir} initial={false} mode="wait">
            {nextProject && (
              <Typography
                component={motion.p}
                key={nextProject.id}
                custom={dir}
                variants={sideNameVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={TRANSITION}
                onClick={() => step(1)}
                sx={{
                  m: 0,
                  fontSize: { xs: 16, md: 22 },
                  fontWeight: 300,
                  letterSpacing: '0.04em',
                  color: '#fff',
                  textAlign: 'center',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                }}
              >
                {nextProject.author}
              </Typography>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Compteur discret */}
      <Box sx={{ position: 'absolute', top: 16, left: 0, right: 0, textAlign: 'center', zIndex: 2, pointerEvents: 'none' }}>
        <Typography
          sx={{
            fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
            fontSize: 11,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          {t('credits.counter', { i: focal + 1, n })}
        </Typography>
      </Box>

      <VideoLightbox
        project={openProject}
        videoId={videoId}
        onPlay={setVideoId}
        onOpenDoc={setDocId}
        onClose={closeLightbox}
      />
      <DocLightbox
        driveId={docId}
        title={openProject ? `Document — ${openProject.author}` : 'Document'}
        onClose={() => setDocId(null)}
      />
    </Box>
  );
}

/** Nom du créateur superposé au centre de la vidéo (avec voile pour la lisibilité).
 *  `dimmed` (survol) : s'efface pour laisser place à la lecture inline. */
function NameOverlay({ author, dimmed = false }: { author: string; dimmed?: boolean }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        opacity: dimmed ? 0 : 1,
        transition: 'opacity 0.25s ease',
        pointerEvents: 'none',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          pointerEvents: 'none',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 28, md: 48 },
            fontWeight: 400,
            letterSpacing: '0.02em',
            color: '#fff',
            textAlign: 'center',
            lineHeight: 1.1,
            textShadow: '0 2px 28px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)',
          }}
        >
          {author}
        </Typography>
      </Box>
    </Box>
  );
}

// Entrée du rail : les boutons se posent en fondu/glissé, nettement après l'arrivée
// sur le projet et bien décalés entre eux (cadence douce, « un par un »).
const railVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 0.55 } },
};
const railItemVariants = {
  hidden: { opacity: 0, x: 18, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type RailItem = {
  key: string;
  label: string;
} & ({ onClick: () => void } | { href: string });

/**
 * Rail d'actions d'un projet : Vidéo 2, Document, Prompts, Lien — uniquement ceux
 * disponibles. Vidéo 2 ouvre le lecteur ; Document ouvre la visionneuse PDF (Drive)
 * ou un nouvel onglet (PDF externe) ; Prompts / Lien ouvrent un nouvel onglet.
 *
 * Style « étiquette de générique » (proposition n°5) : libellé monospace + index
 * numéroté, tiret marqueur au survol. Colonne verticale placée À DROITE de la vidéo
 * (hors incrustation), animée en décalé à l'arrivée ; `horizontal` = repli reduced-motion.
 */
function ActionRail({
  project,
  onPlayVideo,
  onOpenDoc,
  horizontal = false,
}: {
  project: Project;
  onPlayVideo: (driveId: string) => void;
  onOpenDoc: (driveId: string) => void;
  horizontal?: boolean;
}) {
  const { t } = useI18n();
  const video2 = project.resources.find((r) => r.kind === 'video');
  const pdf = project.resources.find((r) => r.kind === 'pdf');

  const items: RailItem[] = [];
  if (video2?.driveId) {
    const id = video2.driveId;
    items.push({ key: 'v2', label: t('rail.video2'), onClick: () => onPlayVideo(id) });
  }
  if (pdf) {
    if (pdf.driveId) {
      const id = pdf.driveId;
      items.push({ key: 'doc', label: t('rail.document'), onClick: () => onOpenDoc(id) });
    } else {
      items.push({ key: 'doc', label: t('rail.document'), href: pdf.href });
    }
  }
  if (project.promptsHref) {
    items.push({ key: 'prompts', label: t('rail.prompts'), href: project.promptsHref });
  }
  if (project.link) {
    items.push({ key: 'lien', label: t('rail.link'), href: project.link });
  }

  if (items.length === 0) return null;

  const renderBtn = (it: RailItem, i: number, first: boolean) => {
    const sx = {
      ...railItemSx(horizontal),
      ...(first && !horizontal ? { borderTop: '1px solid rgba(255,255,255,0.12)' } : null),
    };
    const content = (
      <>
        <Box component="span" className="rail-dash" aria-hidden />
        <Box component="span" sx={{ lineHeight: 1 }}>
          {it.label}
        </Box>
        <Box component="span" className="rail-index" aria-hidden>
          {String(i + 1).padStart(2, '0')}
        </Box>
      </>
    );
    return 'href' in it ? (
      <ButtonBase
        disableRipple
        component="a"
        href={it.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={it.label}
        sx={sx}
      >
        {content}
      </ButtonBase>
    ) : (
      <ButtonBase disableRipple type="button" onClick={it.onClick} aria-label={it.label} sx={sx}>
        {content}
      </ButtonBase>
    );
  };

  // Repli reduced-motion : rangée horizontale simple sous la tuile.
  if (horizontal) {
    return (
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 1.5 }}
      >
        {items.map((it, i) => (
          <Box key={it.key}>{renderBtn(it, i, false)}</Box>
        ))}
      </Box>
    );
  }

  // Colonne verticale (à droite de la vidéo), apparition en décalé.
  return (
    <Box
      component={motion.div}
      onClick={(e) => e.stopPropagation()}
      variants={railVariants}
      initial="hidden"
      animate="show"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}
    >
      {items.map((it, i) => (
        <Box component={motion.div} key={it.key} variants={railItemVariants}>
          {renderBtn(it, i, i === 0)}
        </Box>
      ))}
    </Box>
  );
}
