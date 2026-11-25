// Carga solutions/answers.local.json (NO está en git). Plantilla: scripts/answers.example.json
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('..', import.meta.url));
const file = `${root}solutions/answers.local.json`;

export function loadSecrets() {
  if (!existsSync(file)) {
    console.error(`Falta ${file}\nCópialo de scripts/answers.example.json y rellénalo (ver README).`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}
