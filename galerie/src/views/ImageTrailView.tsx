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
import type { GalleryViewProps, Project } from '../types';
import ProjectTile from '../components/ProjectTile';
import { springs, tweens } from '../motion';
import { useI18n, type TFunction } from '../i18n';

/**
 * ImageTrailView — « Traînée d'images ».
 *
 * Vue alternative branchée sur les VRAIS participants. En bougeant la souris sur
 * la scène, une traînée de vignettes (un participant DIFFÉRENT à chaque pop)
 * apparaît puis s'efface. Survol/clic d'une vignette -> ouvre le lecteur Drive
 * partagé (`onOpenProject`). Repli mobile / reduced-motion : grille « calme ».
 *
 * Pas de navigation clavier dédiée (geste souris) — la grille calme reste l'accès
 * clavier/tactile via `ProjectTile`.
 */

const STEP = 80; // px parcourus entre deux pops
const LIFE = 720; // ms avant retrait auto
const TILE_W = 220;
const MAX_TRAIL = 14;

type ViewProps = GalleryViewProps & { onOpenProject?: (project: Project) => void };

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

/** Bandeau titre + note « shortlist du brainstorm », au-dessus du canevas. */
function Header({ t }: { t: TFunction }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography
        sx={{
          fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
          fontSize: 12,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        {t('trail.title')}
      </Typography>
      <Typography
        sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12.5, mt: 0.75, maxWidth: 720, lineHeight: 1.5 }}
      >
        {t('shortlist.note')}
      </Typography>
    </Box>
  );
}

function CalmGrid({
  projects,
  onOpenProject,
  t,
}: {
  projects: Project[];
  onOpenProject?: (p: Project) => void;
  t: TFunction;
}) {
  return (
    <Box>
      <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, mb: 1.5 }}>
        {t('trail.calmHint')}
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
            showBadge={false}
            onActivate={() => onOpenProject?.(project)}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function ImageTrailView({ projects, onOpenProject }: ViewProps) {
  const { t } = useI18n();
  const reduce = useReducedMotion() ?? false;
  const noHover = useMediaQuery('(hover:none)');
  const calm = reduce || noHover || projects.length === 0;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const [trail, setTrail] = useState<TrailItem[]>([]);
  const [activeKey, setActiveKeyState] = useState<number | null>(null);

  const lastPop = useRef<{ x: number; y: number } | null>(null);
  const counter = useRef(0);
  const cursor = useRef(0);
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

    window.setTimeout(() => {
      if (activeRef.current === key) return;
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

  const hint = useMemo(() => t('trail.hint'), [t]);

  if (calm) {
    return (
      <Box>
        <Header t={t} />
        <CalmGrid projects={projects} onOpenProject={onOpenProject} t={t} />
      </Box>
    );
  }

  return (
    <Box>
      <Header t={t} />
      <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, mb: 1.5 }}>{hint}</Typography>
      <Box
        ref={containerRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        sx={{
          position: 'relative',
          height: { xs: 460, sm: 560, md: 660 },
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: '#0c0d10',
          border: '1px solid rgba(255,255,255,0.06)',
          backgroundImage:
            'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.04), transparent 65%)',
          cursor: 'crosshair',
        }}
      >
        {trail.length === 0 && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.18)',
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 34, letterSpacing: '0.06em' }}>
              {t('trail.count', { n: projects.length })}
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
                    showBadge={false}
                    elevateOnHover={false}
                    onActivate={() => onOpenProject?.(item.project)}
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
