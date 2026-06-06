import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * i18n FR/EN de la galerie.
 *
 * La galerie est conçue pour être embarquée dans le site hôte de VES
 * (`ereyes/openai_creativelab_2026`). Ce site gère sa langue ainsi :
 *  - clé `localStorage['ocl-language']` (`'fr'` | `'en'`),
 *  - `document.documentElement.lang` mis à jour à chaque changement,
 *  - AUCUN événement custom n'est émis.
 *
 * On se synchronise donc en observant l'attribut `lang` du <html> (MutationObserver)
 * + l'événement `storage` (autres onglets). Notre mini-toggle interne écrit les
 * mêmes sources (`lang` + localStorage) pour rester cohérent avec le site hôte.
 */

export type Lang = 'fr' | 'en';

const LANG_KEY = 'ocl-language';

type Dict = Record<string, string>;

const STRINGS: Record<Lang, Dict> = {
  fr: {
    'app.loading': 'Chargement du générique…',
    'app.offline': 'Données hors-ligne',

    'nav.back': 'Retour',

    'credits.counter': '{i} / {n} · défilez',
    'credits.reducedTitle': 'Générique · {n} participants',
    'credits.aria.roledescription': 'carrousel de participants',
    'credits.aria.label': 'Générique des participants — flèches pour naviguer, Entrée pour lire',
    'credits.fullscreen': 'Ouvrir en plein écran',
    'credits.previewAria': 'Aperçu — {author}',
    'credits.openAria': '{author} · {title}, ouvrir',

    'rail.video2': 'Vidéo 2',
    'rail.document': 'Document',
    'rail.prompts': 'Prompts',
    'rail.link': 'Lien',

    'lightbox.close': 'Fermer',
    'lightbox.playerAria': 'Lecteur — {author}',
    'lightbox.playerAriaFallback': 'Lecteur vidéo',
    'lightbox.videoTitle': 'Vidéo de {author}',
    'lightbox.videoTitleFallback': 'Vidéo du participant',
    'lightbox.docTitle': 'Document — {author}',
    'lightbox.docFallback': 'Document',
    'lightbox.docIframeFallback': 'Document du participant',

    'tile.openSite': '{title} — {author}, ouvrir (site)',
    'tile.openVideo': '{title} — {author}, ouvrir (vidéo)',

    'switcher.altLabel': 'Vue alternative',
    'switcher.timeline': 'Banc de montage',
    'switcher.trail': 'Traînée d’images',
    'switcher.back': '← Retour',

    'timeline.title': 'Banc de montage',
    'timeline.clips': '{n} clips',
    'timeline.hint': 'Scrollez, glissez la tête de lecture ou cliquez sur la règle',
    'timeline.hintReduce': 'Touchez un clip pour le lire',
    'timeline.source': 'SOURCE · CLIP {n}',
    'timeline.clipsAria': 'Clips (participants)',
    'timeline.gotoClip': 'Aller au clip {title} — {author}',
    'timeline.clipAria': 'Clip {title} — {author}',
    'timeline.scrollerAria':
      'Timeline de montage : clips des participants posés sur la frise. Scroll, glissez la tête ou cliquez sur la règle.',
    'timeline.rulerAria': 'Règle temporelle : cliquez pour déplacer la tête de lecture.',

    'trail.title': 'Traînée d’images',
    'trail.hint': 'Balayez la zone : une traînée de projets se dessine sous le curseur.',
    'trail.calmHint': 'Survolez une tuile pour lancer son aperçu.',
    'trail.count': '{n} projets',

    'shortlist.note':
      'Cette vue n’a pas été retenue, mais elle faisait partie de la shortlist de nos galeries brainstormées — on la trouvait trop fun pour ne pas l’intégrer quand même.',
  },
  en: {
    'app.loading': 'Loading the credits…',
    'app.offline': 'Offline data',

    'nav.back': 'Back',

    'credits.counter': '{i} / {n} · scroll',
    'credits.reducedTitle': 'Credits · {n} participants',
    'credits.aria.roledescription': 'participant carousel',
    'credits.aria.label': 'Participants credits — arrow keys to navigate, Enter to play',
    'credits.fullscreen': 'Open fullscreen',
    'credits.previewAria': 'Preview — {author}',
    'credits.openAria': '{author} · {title}, open',

    'rail.video2': 'Video 2',
    'rail.document': 'Document',
    'rail.prompts': 'Prompts',
    'rail.link': 'Link',

    'lightbox.close': 'Close',
    'lightbox.playerAria': 'Player — {author}',
    'lightbox.playerAriaFallback': 'Video player',
    'lightbox.videoTitle': 'Video by {author}',
    'lightbox.videoTitleFallback': 'Participant video',
    'lightbox.docTitle': 'Document — {author}',
    'lightbox.docFallback': 'Document',
    'lightbox.docIframeFallback': 'Participant document',

    'tile.openSite': '{title} — {author}, open (site)',
    'tile.openVideo': '{title} — {author}, open (video)',

    'switcher.altLabel': 'Alternative view',
    'switcher.timeline': 'Editing bench',
    'switcher.trail': 'Image trail',
    'switcher.back': '← Back',

    'timeline.title': 'Editing bench',
    'timeline.clips': '{n} clips',
    'timeline.hint': 'Scroll, drag the playhead or click the ruler',
    'timeline.hintReduce': 'Tap a clip to play it',
    'timeline.source': 'SOURCE · CLIP {n}',
    'timeline.clipsAria': 'Clips (participants)',
    'timeline.gotoClip': 'Go to clip {title} — {author}',
    'timeline.clipAria': 'Clip {title} — {author}',
    'timeline.scrollerAria':
      'Editing timeline: participant clips laid on the track. Scroll, drag the playhead or click the ruler.',
    'timeline.rulerAria': 'Time ruler: click to move the playhead.',

    'trail.title': 'Image trail',
    'trail.hint': 'Sweep the area: a trail of projects is drawn under your cursor.',
    'trail.calmHint': 'Hover a tile to start its preview.',
    'trail.count': '{n} projects',

    'shortlist.note':
      'This view wasn’t selected, but it was part of our shortlist of brainstormed galleries — too fun not to include anyway.',
  },
};

export type TFunction = (key: string, params?: Record<string, string | number>) => string;

function format(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in params ? String(params[k]) : `{${k}}`,
  );
}

function normalize(v: string | null | undefined): Lang | null {
  if (!v) return null;
  const low = v.toLowerCase();
  if (low === 'en' || low.startsWith('en-')) return 'en';
  if (low === 'fr' || low.startsWith('fr-')) return 'fr';
  return null;
}

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'fr';
  try {
    const stored = normalize(window.localStorage.getItem(LANG_KEY));
    if (stored) return stored;
  } catch {
    /* localStorage indisponible (mode privé, etc.) */
  }
  return normalize(document.documentElement.lang) ?? 'fr';
}

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TFunction;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  // Notre toggle : met à jour l'état ET les sources du site hôte (lang + storage).
  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    if (typeof document !== 'undefined') {
      if (normalize(document.documentElement.lang) !== next) {
        document.documentElement.lang = next;
      }
    }
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  // Synchronisation avec le site hôte : il pose `document.documentElement.lang`
  // à chaque changement (pas d'event custom) -> on observe l'attribut `lang`.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;

    const sync = () => {
      const fromHtml = normalize(html.lang);
      if (fromHtml) setLangState(fromHtml);
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'lang') {
          sync();
          break;
        }
      }
    });
    observer.observe(html, { attributes: true, attributeFilter: ['lang'] });

    // Autres onglets : la préférence persistée change.
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY) {
        const fromStore = normalize(e.newValue);
        if (fromStore) setLangState(fromStore);
      }
    };
    window.addEventListener('storage', onStorage);

    // NB : pas de `sync()` au montage — `getInitialLang()` a déjà choisi la langue
    // de départ (préférence stockée prioritaire). On ne réagit qu'aux CHANGEMENTS
    // ultérieurs du site hôte, pour ne pas écraser une préférence par `<html lang>`.

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const value = useMemo<LangContextValue>(() => {
    const t: TFunction = (key, params) => {
      const template = STRINGS[lang][key] ?? STRINGS.fr[key] ?? key;
      return format(template, params);
    };
    return { lang, setLang, t };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/** Hook d'accès : `{ t, lang, setLang }`. Repli silencieux hors provider (tests). */
export function useI18n(): LangContextValue {
  const ctx = useContext(LangContext);
  if (ctx) return ctx;
  // Repli minimal : français, sans synchro (ne devrait pas arriver en prod).
  return {
    lang: 'fr',
    setLang: () => {},
    t: (key, params) => format(STRINGS.fr[key] ?? key, params),
  };
}
