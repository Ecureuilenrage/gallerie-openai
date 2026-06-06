import { useCallback, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import type { GalleryViewProps, Project } from './types';
import ProjectTile from './components/ProjectTile';
import { springs, tweens } from './motion';

/**
 * ImageTrailView — « Traînée d'images » (recherche B1).
 *
 * En bougeant la souris sur la scène, une traînée de vignettes (un participant
 * DIFFÉRENT à chaque pop -> multiplicité perçue en quelques secondes) apparaît le
 * long du tracé puis s'efface (scale + fade).
 *
 * Mécanique conforme au contrat motion.ts :
 *  - la position du pointeur vit dans deux MotionValue (px), PAS de setState par
 *    mousemove ; on capte le mouvement via `useMotionValueEvent` sur `pointerX`.
 *  - À chaque event, si la distance parcourue depuis le dernier pop dépasse un
 *    SEUIL, on pousse une vignette (id projet round-robin) dans une file rendue en
 *    `AnimatePresence`. Chaque vignette s'auto-retire après un court délai (exit).
 *  - Apparition `tweens.enter` (expoOut), disparition `tweens.exit`.
 *
 * Au survol prolongé / clic sur une vignette figée -> elle joue (`playing`), avec
 * une seule <video> active à la fois (l'item survolé). Fond éditorial sobre.
 *
 * reduced-motion / mobile (`(hover:none)`) : pas de souris -> grille CALME,
 * aperçu vidéo au survol/tap via ProjectTile. La traînée est désactivée.
 */

const STEP = 80; // px parcourus entre deux pops de vignette
const LIFE = 720; // ms avant retrait auto d'une vignette
const TILE_W = 220; // largeur d'une vignette de traînée (px)
const MAX_TRAIL = 14; // plafond d'items simultanés (perf + une seule vidéo)

type TrailItem = {
  key: number;
  project: Project;
  x: number;
  y: number;
  rot: number;
};

/** Hash déterministe -> [0,1) pour une petite rotation seedée par key. */
function rand(i: number): number {
  const x = Math.sin(i * 91.7 + 13.1) * 43758.5453;
  return x - Math.floor(x);
}

function CalmGrid({ projects }: { projects: Project[] }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Survolez une tuile pour lancer son aperçu.
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: { xs: 1.25, md: 1.75 },
        }}
      >
        {projects.map((project) => (
          <ProjectTile
            key={project.id}
            project={project}
            as="div"
            aspect={4 / 3}
            overlayTitle
            previewOnHover
          />
        ))}
      </Box>
    </Box>
  );
}

export default function ImageTrailView({ projects }: GalleryViewProps) {
  const reduce = useReducedMotion() ?? false;
  const noHover = useMediaQuery('(hover:none)');
  const calm = reduce || noHover || projects.length === 0;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const [trail, setTrail] = useState<TrailItem[]>([]);
  const [activeKey, setActiveKeyState] = useState<number | null>(null);

  // refs : ne pas reconstruire les callbacks à chaque pop.
  const lastPop = useRef<{ x: number; y: number } | null>(null);
  const counter = useRef(0);
  const cursor = useRef(0); // round-robin sur les projets
  // miroir de `activeKey` lisible de façon synchrone dans les setTimeout
  // (évite d'appeler un setter dans l'updater d'un autre setter).
  const activeRef = useRef<number | null>(null);
  const setActiveKey = useCallback((k: number | null) => {
    activeRef.current = k;
    setActiveKeyState(k);
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      pointerX.set(e.clientX - rect.left);
      pointerY.set(e.clientY - rect.top);
    },
    [pointerX, pointerY],
  );

  // Pop d'une vignette quand le pointeur a parcouru > STEP depuis le dernier pop.
  useMotionValueEvent(pointerX, 'change', () => {
    if (calm) return;
    const x = pointerX.get();
    const y = pointerY.get();
    const last = lastPop.current;
    if (last && Math.hypot(x - last.x, y - last.y) < STEP) return;
    lastPop.current = { x, y };

    const project = projects[cursor.current % projects.length];
    cursor.current += 1;
    const key = counter.current++;
    const rot = (rand(key) - 0.5) * 10;

    setTrail((cur) => {
      const next = [...cur, { key, project, x, y, rot }];
      return next.length > MAX_TRAIL ? next.slice(next.length - MAX_TRAIL) : next;
    });

    // retrait auto après LIFE (sauf si l'utilisateur la survole -> figée active)
    window.setTimeout(() => {
      if (activeRef.current === key) return; // figée : on ne la retire pas
      setTrail((cur) => cur.filter((it) => it.key !== key));
    }, LIFE);
  });

  const onLeave = useCallback(() => {
    lastPop.current = null;
  }, []);

  const removeItem = useCallback(
    (key: number) => {
      setTrail((cur) => cur.filter((it) => it.key !== key));
      if (activeRef.current === key) setActiveKey(null);
    },
    [setActiveKey],
  );

  const hint = useMemo(
    () => 'Balayez la zone : une traînée de projets se dessine sous le curseur.',
    [],
  );

  if (calm) return <CalmGrid projects={projects} />;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {hint}
      </Typography>
      <Box
        ref={containerRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        sx={{
          position: 'relative',
          height: { xs: 460, sm: 560, md: 660 },
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.default',
          backgroundImage:
            'radial-gradient(circle at 50% 35%, rgba(0,0,0,0.04), transparent 65%)',
          cursor: 'crosshair',
        }}
      >
        {/* repère éditorial discret au repos */}
        {trail.length === 0 && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.disabled',
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, letterSpacing: '0.06em', opacity: 0.4 }}
            >
              {projects.length} projets
            </Typography>
          </Box>
        )}

        <AnimatePresence>
          {trail.map((item) => {
            const active = activeKey === item.key;
            return (
              <Box
                key={item.key}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.86 }}
                transition={active ? springs.snappy : tweens.enter}
                onMouseEnter={() => setActiveKey(item.key)}
                onMouseLeave={() => {
                  // en quittant une vignette figée, on la laisse s'effacer
                  if (activeRef.current === item.key) setActiveKey(null);
                  window.setTimeout(() => removeItem(item.key), LIFE / 2);
                }}
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  width: TILE_W,
                  maxWidth: '60vw',
                  translateX: '-50%',
                  translateY: '-50%',
                  rotate: item.rot,
                  zIndex: active ? 50 : 10 + (item.key % 10),
                  willChange: 'transform, opacity',
                }}
              >
                <Box
                  sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: active
                      ? '0 26px 48px -18px rgba(0,0,0,0.55)'
                      : '0 14px 30px -18px rgba(0,0,0,0.45)',
                  }}
                >
                  <ProjectTile
                    project={item.project}
                    as="div"
                    aspect={4 / 3}
                    overlayTitle
                    elevateOnHover={false}
                    playing={active}
                  />
                </Box>
              </Box>
            );
          })}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
