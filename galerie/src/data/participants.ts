import type { Project } from '../types';
import { parseCsv, rowToProject } from '../lib/csv';

/**
 * Repli hors-ligne : instantané du CSV publié (au 2026-06-05). Sert uniquement
 * si le `fetch` du Google Sheet échoue (hors-ligne, CORS, feuille dépubliée).
 * En fonctionnement normal, les données viennent du CSV en direct
 * (voir `lib/csv.ts` → `fetchParticipants`, consommé par `hooks/useParticipants`).
 *
 * Pour rafraîchir cet instantané : ouvrir l'URL du CSV et recoller son contenu.
 */
const SNAPSHOT = `num,participant,lien,pdf,prompts,video_01,video_02,vignette
1,Samuel DA SILVA,,https://drive.google.com/file/d/1lcUtM1q0LphfjmNxGWjTLhofOFqosAzy/preview,,https://drive.google.com/file/d/1yRB6fjVYWyuGMrHiTtNjZqRLXpR5SFKh/preview,,https://drive.google.com/file/d/1OgfoBXpFdxA3BnykHvvwo9Rh7hdnX6Zx/preview
2,Rosa CINELLI,,https://drive.google.com/file/d/1tN8SvomTolT604-ILc37jTWG0wzBO9aj/preview,https://drive.google.com/file/d/1cETkBINZFPokekvAqxESvbPylZpJIN6v/view?usp=sharing,https://drive.google.com/file/d/1jZ6T_4QzQKCxKiKK347uErNrIWmZ3qSj/view?usp=sharing,,https://drive.google.com/file/d/1TVsyaqTxdyv1sW8NYQ6cpwalxYzRz5zB/preview
3,Everardo REYES,https://github.com/ereyes/sora,https://ereyes.github.io/sora/presentation.pdf,,https://drive.google.com/file/d/1MmUzuih-O1Gy3qNdBMNgKPyrmW8UqhT0/preview,https://drive.google.com/file/d/1ufrd_1G-_GZcDpY8DB3TN-_4Y_LUAFZC/preview,https://drive.google.com/file/d/1gZu_-FeljfJz-SwgGuDGzH9PAmKtUfdI/preview
4,Arthur GILLIER,https://seg1-exe.github.io/openai-sora-research/,,,https://drive.google.com/file/d/1oGOoFJHp4ShAT9bgK8inVq-p0EPSwwAz/preview,,https://drive.google.com/file/d/1CQYq89aoMFbPLSCWRgo5mm30x1RD7093/preview
5,Jéssica NICOLETTI,,https://drive.google.com/file/d/17d1lQGVlIK0we0iOIkz-l-qjS-yg5n8f/preview,,https://drive.google.com/file/d/1GGSZJXhIrjspYBwtywOF25ucZAlpNFEp/preview,https://drive.google.com/file/d/1gMQ63Q-nZLWiA4FGinmVz_PMDGo3ZmMR/preview,https://drive.google.com/file/d/1ZzWOeCo4L0mxluT1ynLlzfLdIa8GvdzZ/preview
6,Kilyan SZMIDT,,https://drive.google.com/file/d/17SLYerbmxMSGdKmUNR3FNOcGYfSrdFZD/preview,,https://drive.google.com/file/d/1YXUD1pWJWPaQ9UlLcCa827btheMmI2Nr/preview,https://drive.google.com/file/d/1qezEC3hpEyMkwDDhwhEYHRgFlCqLeULi/preview,https://drive.google.com/file/d/1jaXlglUgYX2jqnTPjyKkpubfTnpkhwP5/preview
7,Klein LÉON,https://openai.exoniq.io/,,,https://drive.google.com/file/d/1Fm10Hq6x0O2MY_b_0cdmNZcPYFfFPk0W/preview,,https://drive.google.com/file/d/1B2OpeMEhetlqLNUtu2K76j73ZDUELWUh/preview
8,Federico BIGGIO,,https://drive.google.com/file/d/13t7au1Q2c_KfLqcGt4YWTzoebTsU-1c5/preview,https://drive.google.com/file/d/1VUOrf7EC80uxQcbJG94i2FmaLRA94Zlw/view?usp=sharing,https://drive.google.com/file/d/1-ICUyT1gn4WHr502e7FtTeqHTumtUpVN/preview,,https://drive.google.com/file/d/1V649BdUtDkTaP-JSOem5c1LEnItXWR-l/preview
9,Khanh Dan TRAN,,https://drive.google.com/file/d/1Q_KZE-L58f2hM0Q51eP6F-juaKjjeDZr/preview,,https://drive.google.com/file/d/1X9KEZH4W2Ft9moaZoyX-3DTuBU8k83kS/preview,,https://drive.google.com/file/d/11Sy2q8Zx79umfIh4eWrNqi_-1ntpaicF/preview`;

/** Participants de secours, dérivés de l'instantané ci-dessus (même mapping que le live). */
export const FALLBACK: Project[] = parseCsv(SNAPSHOT)
  .map(rowToProject)
  .filter((p): p is Project => p !== null)
  .sort((a, b) => a.num - b.num);
