// @ts-check
/**
 * Télécharge localement les vignettes (colonne H du CSV) dans `public/vignettes/`.
 *
 * Pourquoi : Google bloque le hotlink `<img>` vers `drive.google.com/thumbnail`
 * (le `curl` passe, le navigateur non). On rapatrie donc chaque image dans le
 * dépôt et on la sert par chemin local, ce qui est aussi plus rapide et hors-ligne.
 *
 * Ce que fait le script :
 *   1. lit le CSV publié (le même que l'app, surchargeable via VITE_CSV_URL) ;
 *   2. pour chaque participant, extrait l'ID Drive de la vignette et télécharge
 *      `https://drive.google.com/thumbnail?id=ID&sz=w1280` ;
 *   3. écrit `public/vignettes/<slug>.<ext>` (slug = nom normalisé) ;
 *   4. régénère le manifeste `src/data/vignettes.ts` (slug -> chemin local).
 *
 * Lancer :  npm run vignettes   (ou : node scripts/fetch-vignettes.mjs)
 * À relancer chaque fois que la colonne « vignette » du Google Sheet change.
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'public/vignettes');
const MANIFEST = resolve(ROOT, 'src/data/vignettes.ts');

const CSV_URL =
  process.env.VITE_CSV_URL ??
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2J9znISYyRj69-SBMjGL1oYQgAJkZeZi4i0yeWDr_h5mDD7FNYVNB9m62xctahL3pBk2GP5YOCyst/pub?gid=0&single=true&output=csv';

/** Identifiant stable et lisible à partir du nom (idem `lib/csv.ts`). */
const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Extrait l'identifiant Drive d'une URL (idem `lib/drive.ts`). */
const driveId = (url) => {
  if (!url) return undefined;
  const m = url.match(/\/d\/([A-Za-z0-9_-]+)/) ?? url.match(/[?&]id=([A-Za-z0-9_-]+)/);
  return m?.[1];
};

/** Parseur CSV minimal (guillemets, `""` échappés, retours-ligne dans un champ). */
function parseCsv(text) {
  const s = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  row.push(field);
  if (row.length > 1 || row[0] !== '') rows.push(row);
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((c) => c.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

/** Choisit une extension à partir du content-type de la réponse. */
const extFor = (contentType) => {
  if (/png/i.test(contentType)) return 'png';
  if (/webp/i.test(contentType)) return 'webp';
  if (/gif/i.test(contentType)) return 'gif';
  return 'jpg'; // Drive renvoie du JPEG par défaut
};

async function main() {
  console.log('• Lecture du CSV…');
  const res = await fetch(CSV_URL, { redirect: 'follow' });
  if (!res.ok) throw new Error(`CSV indisponible (HTTP ${res.status})`);
  const rows = parseCsv(await res.text());
  if (rows.length === 0) throw new Error('CSV vide ou mal formé');

  // Dossier propre : on régénère intégralement.
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  /** @type {Record<string, string>} */
  const manifest = {};
  let ok = 0;
  let skip = 0;

  for (const row of rows) {
    const author = (row.participant ?? '').trim();
    if (!author) continue;
    const id = slug(author) || String(Number(row.num) || 0);

    // Source de la vignette : colonne dédiée, sinon poster de la vidéo héros
    // (utile quand la vignette Drive est absente/non partagée — ex. Klein LÉON).
    const sources = [
      { label: 'vignette', vid: driveId(row.vignette) },
      { label: 'vidéo héros', vid: driveId(row.video_01) },
    ].filter((s) => s.vid);

    if (sources.length === 0) {
      console.warn(`  ⚠ ${author} : aucune image Drive (vignette ni vidéo) — ignoré`);
      skip++;
      continue;
    }

    let done = false;
    for (const { label, vid } of sources) {
      const url = `https://drive.google.com/thumbnail?id=${vid}&sz=w1280`;
      try {
        const img = await fetch(url, { redirect: 'follow' });
        if (!img.ok) throw new Error(`HTTP ${img.status}`);
        const ext = extFor(img.headers.get('content-type') ?? '');
        const buf = Buffer.from(await img.arrayBuffer());
        if (buf.byteLength < 1024) throw new Error(`réponse trop petite (${buf.byteLength} o)`);
        const file = `${id}.${ext}`;
        await writeFile(resolve(OUT_DIR, file), buf);
        // Chemin RELATIF (sans `/` initial) : consommé via `import.meta.env.BASE_URL`
        // dans lib/csv.ts, il fonctionne aussi sous un sous-chemin (GitHub Pages projet).
        manifest[id] = `vignettes/${file}`;
        const via = label === 'vignette' ? '' : ` (repli ${label})`;
        console.log(`  ✓ ${author} → ${file} (${(buf.byteLength / 1024).toFixed(0)} Ko)${via}`);
        ok++;
        done = true;
        break;
      } catch (err) {
        // On tente la source suivante avant d'abandonner.
        if (label === sources[sources.length - 1].label) {
          console.warn(`  ⚠ ${author} : échec téléchargement (${label} : ${err.message}) — ignoré`);
        }
      }
    }
    if (!done) skip++;
  }

  // Manifeste consommé par `lib/csv.ts` (chemin local prioritaire sur le thumbnail Drive).
  const entries = Object.entries(manifest)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join('\n');
  const ts = `// Généré par scripts/fetch-vignettes.mjs — NE PAS éditer à la main.\n// Relancer \`npm run vignettes\` après modification de la colonne « vignette » du CSV.\n\n/** Vignettes locales (slug du participant -> chemin RELATIF, préfixé par import.meta.env.BASE_URL dans lib/csv.ts). */\nexport const VIGNETTES: Record<string, string> = {\n${entries}\n};\n`;
  await writeFile(MANIFEST, ts, 'utf8');

  console.log(`\n• Terminé : ${ok} vignette(s) téléchargée(s), ${skip} ignorée(s).`);
  console.log(`  Images : ${OUT_DIR}`);
  console.log(`  Manifeste : ${MANIFEST}`);
}

main().catch((err) => {
  console.error('✗ Échec :', err.message);
  process.exit(1);
});
