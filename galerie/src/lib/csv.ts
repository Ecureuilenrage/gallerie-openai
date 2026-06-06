import type { Project, Resource } from '../types';
import { driveId, drivePreview, driveThumb } from './drive';
import { VIGNETTES } from '../data/vignettes';

/**
 * Source de vérité : le Google Sheet publié en CSV. Éditer la feuille met à jour
 * la galerie au prochain chargement, sans rebuild. Surchargable via `VITE_CSV_URL`.
 *
 * Colonnes attendues :
 *   num, participant, lien, pdf, prompts, video_01, video_02, vignette
 */
export const CSV_URL =
  import.meta.env.VITE_CSV_URL ??
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2J9znISYyRj69-SBMjGL1oYQgAJkZeZi4i0yeWDr_h5mDD7FNYVNB9m62xctahL3pBk2GP5YOCyst/pub?gid=0&single=true&output=csv';

/** Identifiant stable et lisible à partir du nom (« Samuel DA SILVA » → « samuel-da-silva »). */
const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Parseur CSV minimal mais correct : gère les champs entre guillemets, les
 * guillemets échappés (`""`) et les retours-ligne dans un champ. Renvoie une
 * ligne de tableaux de cellules.
 */
function csvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const s = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.length > 1 || row[0] !== '') rows.push(row);
  return rows;
}

/** Transforme un CSV en lignes-objets indexées par l'en-tête. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows = csvRows(text);
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((c) => c.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

/** Convertit une ligne du CSV en `Project` (ou `null` si la ligne est inexploitable). */
export function rowToProject(row: Record<string, string>): Project | null {
  const author = (row.participant ?? '').trim();
  if (!author) return null;

  const num = Number(row.num) || 0;
  const id = slug(author) || String(num);

  const heroId = driveId(row.video_01);
  const video2Id = driveId(row.video_02);
  const site = (row.lien ?? '').trim() || undefined;
  const pdf = (row.pdf ?? '').trim() || undefined;
  const prompts = (row.prompts ?? '').trim() || undefined;

  // Identifiant Drive du PDF (si le document est hébergé sur Drive) : permet de
  // l'afficher en iframe (visionneuse intégrée) plutôt qu'en nouvel onglet.
  const pdfId = driveId(pdf);

  // Ressources annexes, dans l'ordre d'affichage de la barre de la lightbox.
  const resources: Resource[] = [];
  if (video2Id) {
    resources.push({ kind: 'video', label: 'Vidéo 2', href: drivePreview(video2Id), driveId: video2Id });
  }
  if (pdf) resources.push({ kind: 'pdf', label: 'Document', href: pdf, driveId: pdfId });
  if (prompts) resources.push({ kind: 'prompts', label: 'Prompts', href: prompts });
  if (site) resources.push({ kind: 'site', label: 'Site', href: site });

  // Vignette : image LOCALE (téléchargée par scripts/fetch-vignettes.mjs) en
  // priorité — c'est la seule qui s'affiche réellement dans le navigateur, Google
  // bloquant le hotlink `<img>` vers drive.google.com/thumbnail. Replis successifs :
  // thumbnail Drive de la colonne, puis poster de la vidéo héros. Aucun placeholder :
  // si rien n'est disponible, on laisse un fond sombre uni (cf. ProjectTile).
  const vignetteRaw = (row.vignette ?? '').trim();
  const vignetteId = driveId(vignetteRaw);
  // Chemin RELATIF dans le manifeste (« vignettes/x.png ») : on le préfixe par la
  // base Vite. En dev `BASE_URL = '/'` (servi depuis public/), en build `'./'`
  // (résolu relativement à la page hôte) → fonctionne aussi sous un sous-chemin.
  const localVignette = VIGNETTES[id];
  const thumbnail =
    (localVignette ? import.meta.env.BASE_URL + localVignette : '') ||
    (vignetteId ? driveThumb(vignetteId) : vignetteRaw) ||
    (heroId ? driveThumb(heroId) : '');

  // Un projet est « vidéo » dès qu'il a une vidéo héros ; sinon « site ».
  const kind: Project['kind'] = heroId ? 'video' : 'site';
  const href = heroId ? drivePreview(heroId) : site ?? '#';

  return {
    id,
    num,
    title: author,
    author,
    thumbnail,
    width: 1280,
    height: 720,
    href,
    kind,
    videoId: heroId,
    link: site,
    promptsHref: prompts,
    resources,
  };
}

/** Récupère et mappe les participants depuis le CSV publié, triés par `num`. */
export async function fetchParticipants(url: string = CSV_URL): Promise<Project[]> {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`CSV indisponible (HTTP ${res.status})`);
  const text = await res.text();
  const projects = parseCsv(text)
    .map(rowToProject)
    .filter((p): p is Project => p !== null)
    .sort((a, b) => a.num - b.num);
  if (projects.length === 0) throw new Error('CSV vide ou mal formé');
  return projects;
}
