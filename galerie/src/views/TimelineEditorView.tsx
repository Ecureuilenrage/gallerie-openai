import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  motion,
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { GalleryViewProps, Project } from '../types';
import ProjectTile from '../components/ProjectTile';
import { useDragGuard } from '../hooks/useDragGuard';
import { springs, springsScroll, settleGreet, onScrollRest } from '../motion';
import { useI18n } from '../i18n';

/**
 * TimelineEditorView — « Banc de montage » (NLE).
 *
 * Vue alternative branchée sur les VRAIS participants. Une RÈGLE temporelle, une
 * TÊTE DE LECTURE (playhead) draggable et des PISTES où les projets sont posés en
 * CLIPS. On scrub (drag / clic règle / molette) ; le clip sous la tête devient
 * focal et s'affiche dans le MONITEUR. Clic sur le moniteur (ou Entrée) -> ouvre
 * le lecteur Drive partagé (`onOpenProject`). Flèches ←/→ = clip précédent/suivant.
 */

const ACCENT = '#3a8dde'; // bleu « playhead » NLE
const TRACK_BG = '#15171b';
const RULER_H = 28;
const TRACK_H = 92;
const TRACK_GAP = 8;

type ViewProps = GalleryViewProps & { onOpenProject?: (project: Project) => void };

/** Timecode déterministe HH:MM:SS:FF à partir d'un offset en « frames » (25 fps). */
function timecode(frames: number) {
  const fps = 25;
  const f = Math.max(0, Math.floor(frames));
  const ff = f % fps;
  const totalS = Math.floor(f / fps);
  const ss = totalS % 60;
  const mm = Math.floor(totalS / 60) % 60;
  const hh = Math.floor(totalS / 3600);
  const p2 = (n: number) => String(n).padStart(2, '0');
  return `${p2(hh)}:${p2(mm)}:${p2(ss)}:${p2(ff)}`;
}

type ClipMeta = {
  project: Project;
  start: number;
  span: number;
  track: number;
  durFrames: number;
};

export default function TimelineEditorView({ projects, onOpenProject }: ViewProps) {
  const { t } = useI18n();
  const reduce = useReducedMotion() ?? false;
  const n = projects.length;
  const { onPointerDown: guardDown, didMove } = useDragGuard();

  // Disposition déterministe des clips le long de la frise.
  const { clips, starts } = useMemo(() => {
    const gap = 0.012;
    const raw = projects.map((p) => 0.7 + ((p.title.length * 7) % 9) / 10); // 0.7..1.6
    const total = raw.reduce((a, b) => a + b, 0) + gap * Math.max(0, n - 1);
    let cursor = 0;
    const cl: ClipMeta[] = projects.map((project, i) => {
      const span = raw[i] / total;
      const start = cursor;
      cursor += span + gap / total;
      return {
        project,
        start,
        span,
        track: i % 2,
        durFrames: Math.round(raw[i] * 120),
      };
    });
    const st = cl.map((c) => c.start + c.span / 2);
    return { clips: cl, starts: st };
  }, [projects, n]);

  const [active, setActive] = useState(0);
  const lastActive = useRef(0);

  const head = useMotionValue(starts[0] ?? 0);

  const laneRef = useRef<HTMLDivElement | null>(null);
  const laneW = useRef(1);
  useEffect(() => {
    const el = laneRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      laneW.current = el.clientWidth || 1;
    });
    ro.observe(el);
    laneW.current = el.clientWidth || 1;
    return () => ro.disconnect();
  }, []);

  const resolveActive = useCallback(
    (pos: number) => {
      let found = -1;
      for (let i = 0; i < clips.length; i++) {
        const c = clips[i];
        if (pos >= c.start && pos <= c.start + c.span) {
          found = i;
          break;
        }
      }
      if (found < 0) {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < starts.length; i++) {
          const d = Math.abs(starts[i] - pos);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        found = best;
      }
      setActive((prev) => (prev === found ? prev : found));
    },
    [clips, starts],
  );

  useMotionValueEvent(head, 'change', resolveActive);

  // ----- SCROLL INTERNE (3e moyen de scrubber) -----------------------------
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollerRef });
  const scrollHead = useSpring(scrollYProgress, springsScroll);
  const scrollPos = useTransform(scrollHead, (v) => Math.max(0, Math.min(1, v)));

  const scrolling = useRef(false);
  const syncingScroll = useRef(false);

  const syncScrollToHead = useCallback((pos: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) return;
    syncingScroll.current = true;
    el.scrollTop = Math.max(0, Math.min(1, pos)) * max;
    requestAnimationFrame(() => {
      syncingScroll.current = false;
    });
  }, []);

  const goTo = useCallback(
    (i: number) => {
      scrolling.current = false;
      setActive(i);
      if (reduce) {
        head.set(starts[i]);
      } else {
        animate(head, starts[i], springs.settle);
      }
      requestAnimationFrame(() => syncScrollToHead(starts[i]));
    },
    [head, starts, reduce, syncScrollToHead],
  );

  useMotionValueEvent(scrollPos, 'change', (v) => {
    if (reduce) return;
    if (!scrolling.current) return;
    head.set(v);
  });

  const restRef = useRef<(() => void) | null>(null);
  if (!restRef.current) {
    restRef.current = onScrollRest(() => {
      scrolling.current = false;
      let best = 0;
      let bestD = Infinity;
      const pos = head.get();
      for (let i = 0; i < starts.length; i++) {
        const d = Math.abs(starts[i] - pos);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      setActive(best);
      animate(head, starts[best], springs.settle);
      requestAnimationFrame(() => syncScrollToHead(starts[best]));
    }, 140);
  }

  const onTimelineScroll = useCallback(() => {
    if (reduce) return;
    if (syncingScroll.current) return;
    scrolling.current = true;
    restRef.current?.();
  }, [reduce]);

  const snap = useCallback(() => {
    if (reduce) return;
    animate(head, starts[active], springs.settle);
    requestAnimationFrame(() => syncScrollToHead(starts[active]));
  }, [head, starts, active, reduce, syncScrollToHead]);

  const dragStart = useRef(0);

  useEffect(() => {
    if (reduce) return;
    requestAnimationFrame(() => syncScrollToHead(head.get()));
  }, [reduce, head, syncScrollToHead]);

  const monitorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (reduce) return;
    if (active === lastActive.current) return;
    lastActive.current = active;
    const el = monitorRef.current;
    if (el) animate(el, { scale: settleGreet.scale }, settleGreet.transition);
  }, [active, reduce]);

  const focal = projects[active];
  const openFocal = useCallback(() => {
    if (focal) onOpenProject?.(focal);
  }, [focal, onOpenProject]);

  // Navigation clavier au niveau vue (←/→ change de clip, Entrée ouvre le lecteur).
  // Garde `target === currentTarget` : les chips de clip gèrent déjà leurs flèches.
  const onViewKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goTo(Math.min(n - 1, active + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goTo(Math.max(0, active - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      openFocal();
    }
  };

  return (
    <Box
      tabIndex={0}
      onKeyDown={onViewKeyDown}
      aria-label={t('timeline.title')}
      sx={{
        bgcolor: '#0c0d10',
        borderRadius: 3,
        p: { xs: 1.5, md: 2.5 },
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.6)',
        color: 'rgba(236,239,244,0.92)',
        outline: 'none',
        '&:focus-visible': { boxShadow: `inset 0 0 0 2px ${ACCENT}` },
      }}
    >
      {/* Barre de titre + note « shortlist du brainstorm » */}
      <Box sx={{ mb: 1.5, px: 0.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
              fontSize: 12,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: ACCENT,
            }}
          >
            {t('timeline.title')} · {t('timeline.clips', { n })}
          </Typography>
          <Typography sx={{ color: 'rgba(236,239,244,0.5)', fontSize: 13 }}>
            {reduce ? t('timeline.hintReduce') : t('timeline.hint')}
          </Typography>
        </Box>
        <Typography
          sx={{ color: 'rgba(236,239,244,0.4)', fontSize: 12.5, mt: 0.75, maxWidth: 720, lineHeight: 1.5 }}
        >
          {t('shortlist.note')}
        </Typography>
      </Box>

      {/* MONITEUR de prévisualisation : clic -> lecteur Drive partagé. */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' }, mb: 1.5 }}>
        <Box
          component={motion.div}
          ref={monitorRef}
          sx={{
            position: 'relative',
            width: { xs: '100%', md: 360 },
            flex: { md: '0 0 360px' },
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            bgcolor: '#000',
          }}
        >
          {focal && (
            <ProjectTile
              key={focal.id}
              project={focal}
              as="div"
              aspect={16 / 9}
              overlayTitle
              showBadge={false}
              elevateOnHover={false}
              onActivate={openFocal}
            />
          )}
        </Box>

        {/* Bandeau d'infos focal */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 0.5, md: 1 },
            py: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
              fontSize: 11,
              letterSpacing: '0.18em',
              color: ACCENT,
              mb: 0.5,
            }}
          >
            {t('timeline.source', { n: String(active + 1).padStart(2, '0') })}
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 22 }, lineHeight: 1.2 }}>
            {focal?.title}
          </Typography>
          <Typography sx={{ color: 'rgba(236,239,244,0.6)', fontSize: 14, mt: 0.25 }}>
            {focal?.author}
            {focal?.group ? ` · ${focal.group}` : ''}
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              display: 'flex',
              gap: 2,
              fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
              fontSize: 12,
              color: 'rgba(236,239,244,0.7)',
            }}
          >
            <span>IN {timecode(0)}</span>
            <span>OUT {timecode(clips[active]?.durFrames ?? 0)}</span>
            <span style={{ color: ACCENT }}>{(focal?.kind ?? '').toUpperCase()}</span>
          </Box>
        </Box>
      </Box>

      {/* TIMELINE : règle + pistes + tête de lecture (scroll interne dédié). */}
      <Box
        ref={scrollerRef}
        onScroll={onTimelineScroll}
        role="group"
        aria-label={t('timeline.scrollerAria')}
        sx={{
          position: 'relative',
          borderRadius: 2,
          bgcolor: '#0f1115',
          border: '1px solid rgba(255,255,255,0.06)',
          maxHeight: 268,
          overflowY: reduce ? 'hidden' : 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
        }}
      >
        <Box
          ref={laneRef}
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            p: 1,
            bgcolor: '#0f1115',
            overflowX: { xs: 'auto', md: 'hidden' },
          }}
        >
          <Box sx={{ position: 'relative', minWidth: { xs: 680, md: 'auto' } }}>
            <Ruler
              ariaLabel={t('timeline.rulerAria')}
              onSeek={(frac) => {
                scrolling.current = false;
                if (reduce) {
                  head.set(frac);
                  resolveActive(frac);
                } else {
                  animate(head, frac, springs.snappy);
                }
                requestAnimationFrame(() => syncScrollToHead(frac));
              }}
            />

            {[0, 1].map((track) => (
              <Box
                key={track}
                sx={{
                  position: 'relative',
                  height: TRACK_H,
                  mt: TRACK_GAP / 8,
                  mb: track === 0 ? `${TRACK_GAP}px` : 0,
                  bgcolor: TRACK_BG,
                  borderRadius: 1,
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    left: 6,
                    top: 6,
                    fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    color: 'rgba(236,239,244,0.35)',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                >
                  V{track + 1}
                </Box>

                {clips
                  .filter((c) => c.track === track)
                  .map((c) => {
                    const idx = clips.indexOf(c);
                    return (
                      <Clip
                        key={c.project.id}
                        meta={c}
                        index={idx}
                        active={idx === active}
                        reduce={reduce}
                        ariaLabel={t('timeline.clipAria', {
                          title: c.project.title,
                          author: c.project.author,
                        })}
                        onPick={() => goTo(idx)}
                      />
                    );
                  })}
              </Box>
            ))}

            <Playhead
              head={head}
              disabled={reduce}
              onSeekStart={(e) => {
                scrolling.current = false;
                guardDown(e);
                dragStart.current = head.get();
              }}
              onSeek={(dxPx) => {
                const next = dragStart.current + dxPx / laneW.current;
                head.set(Math.max(0, Math.min(1, next)));
              }}
              onSeekEnd={(e) => {
                if (didMove(e)) snap();
                else requestAnimationFrame(() => syncScrollToHead(head.get()));
              }}
            />
          </Box>
        </Box>

        {!reduce && <Box aria-hidden sx={{ height: 1400, pointerEvents: 'none' }} />}
      </Box>

      {/* Accessibilité : sélection clavier des clips (←/→ + Entrée ouvre le lecteur). */}
      <Box
        role="group"
        aria-label={t('timeline.clipsAria')}
        sx={{ display: 'flex', gap: 0.75, mt: 2, flexWrap: 'wrap' }}
      >
        {projects.map((p, i) => (
          <Box
            key={p.id}
            role="button"
            tabIndex={0}
            aria-label={t('timeline.gotoClip', { title: p.title, author: p.author })}
            aria-pressed={i === active}
            onClick={() => goTo(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (i === active) onOpenProject?.(p);
                else goTo(i);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goTo(Math.min(n - 1, i + 1));
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goTo(Math.max(0, i - 1));
              }
            }}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              cursor: 'pointer',
              fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
              fontSize: 11,
              color: i === active ? '#fff' : 'rgba(236,239,244,0.45)',
              bgcolor: i === active ? ACCENT : 'rgba(255,255,255,0.04)',
              outline: 'none',
              '&:focus-visible': { boxShadow: `0 0 0 2px ${ACCENT}` },
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/** Règle temporelle graduée — clic pour positionner la tête. */
function Ruler({ onSeek, ariaLabel }: { onSeek: (frac: number) => void; ariaLabel: string }) {
  const ticks = 24;
  return (
    <Box
      role="slider"
      aria-label={ariaLabel}
      aria-hidden
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onSeek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
      }}
      sx={{
        position: 'relative',
        height: RULER_H,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        mb: 0.5,
      }}
    >
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const major = i % 4 === 0;
        return (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              left: `${(i / ticks) * 100}%`,
              bottom: 0,
              width: '1px',
              height: major ? 14 : 7,
              bgcolor: major ? 'rgba(236,239,244,0.35)' : 'rgba(236,239,244,0.16)',
            }}
          >
            {major && (
              <Box
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 14,
                  left: 3,
                  fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
                  fontSize: 9,
                  color: 'rgba(236,239,244,0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                {timecode(i * 75)}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

type ClipProps = {
  meta: ClipMeta;
  index: number;
  active: boolean;
  reduce: boolean;
  ariaLabel: string;
  onPick: () => void;
};

/** Un clip posé sur la frise : thumbnail + nom, surligné quand actif. */
function Clip({ meta, index, active, reduce, ariaLabel, onPick }: ClipProps) {
  return (
    <Box
      component={motion.div}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={active}
      onClick={onPick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPick();
        }
      }}
      animate={reduce ? undefined : { y: active ? -2 : 0 }}
      transition={springs.snappy}
      sx={{
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: `${meta.start * 100}%`,
        width: `${meta.span * 100}%`,
        borderRadius: 1,
        overflow: 'hidden',
        cursor: 'pointer',
        outline: 'none',
        border: active ? `2px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: active ? `0 8px 28px rgba(0,0,0,0.55), 0 0 0 1px ${ACCENT}` : 'none',
        opacity: active ? 1 : 0.78,
        transition: 'opacity 0.3s, border-color 0.3s',
        '&:focus-visible': { boxShadow: `0 0 0 2px ${ACCENT}` },
      }}
    >
      {meta.project.thumbnail ? (
        <Box
          component="img"
          src={meta.project.thumbnail}
          alt=""
          aria-hidden
          draggable={false}
          loading="lazy"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: active ? 'none' : 'saturate(0.75) brightness(0.82)',
            transition: 'filter 0.3s',
          }}
        />
      ) : (
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, bgcolor: '#0c0d10' }} />
      )}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          px: 0.75,
          py: 0.5,
          background: 'linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0))',
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {meta.project.title}
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 9,
            fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
          }}
        >
          {String(index + 1).padStart(2, '0')} · {timecode(meta.durFrames)}
        </Typography>
      </Box>
    </Box>
  );
}

type PlayheadProps = {
  head: ReturnType<typeof useMotionValue<number>>;
  disabled: boolean;
  onSeekStart: (e: React.PointerEvent) => void;
  onSeek: (dxPx: number) => void;
  onSeekEnd: (e: { clientX: number; clientY: number }) => void;
};

/** Tête de lecture : ligne verticale + poignée, draggable horizontalement. */
function Playhead({ head, disabled, onSeekStart, onSeek, onSeekEnd }: PlayheadProps) {
  const leftPct = useMotionValue('0%');
  useMotionValueEvent(head, 'change', (v) => leftPct.set(`${v * 100}%`));
  useEffect(() => {
    leftPct.set(`${head.get() * 100}%`);
  }, [head, leftPct]);

  const dragging = useRef(false);
  const startX = useRef(0);

  return (
    <Box
      component={motion.div}
      aria-hidden
      style={{ left: leftPct }}
      onPointerDown={
        disabled
          ? undefined
          : (e: React.PointerEvent) => {
              dragging.current = true;
              startX.current = e.clientX;
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              onSeekStart(e);
            }
      }
      onPointerMove={
        disabled
          ? undefined
          : (e: React.PointerEvent) => {
              if (!dragging.current) return;
              onSeek(e.clientX - startX.current);
            }
      }
      onPointerUp={
        disabled
          ? undefined
          : (e: React.PointerEvent) => {
              dragging.current = false;
              onSeekEnd(e);
            }
      }
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 4,
        width: 2,
        bgcolor: ACCENT,
        zIndex: 10,
        transform: 'translateX(-1px)',
        cursor: disabled ? 'default' : 'ew-resize',
        touchAction: 'none',
        boxShadow: `0 0 10px ${ACCENT}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '0 -8px',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -2,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: `9px solid ${ACCENT}`,
        }}
      />
    </Box>
  );
}
