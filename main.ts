// Leonida Platinum — a gta6-trophy-guide-01 entry (Node 22, standard library only).
//
// The guide itself is app/: plain static files (index.html, style.css, js modules and
// data/trophies.json) that open in a desktop browser and work with the network off.
// This program hands the guide in: it copies app/ and screenshots/ from beside this
// file into /output and writes /output/dossier.json with the vendored make.fun
// library. vendor/makefun-frontend.ts is the kit's copy and must stay unchanged — the
// scorer rebuilds the dossier with its own copy and compares the two byte for byte.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps: at most 4 screenshots of at most 256 KiB, app/ at most 993 files
// and directories and 48 MiB, and the dossier text at most 163,840 bytes.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

// Say what was handed in, so a local run shows its result at a glance: the dossier's
// size, how many screenshots went with it, and the trophy file's size as a sanity check.
const dossierSize = statSync(join(out, 'dossier.json')).size;
const trophyBytes = statSync(join(out, 'app', 'data', 'trophies.json')).size;
const shotCount = readdirSync(join(out, 'screenshots')).filter((f) => !f.startsWith('.')).length;
console.log(`Wrote ${out}/dossier.json (${dossierSize} bytes) with ${shotCount} screenshots from app/ and screenshots/ (trophies.json ${trophyBytes} bytes).`);
