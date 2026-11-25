// Comprueba que cada respuesta de solutions/answers.local.json valida contra answers.json
// y que ninguna aparece en claro en dist/ (si existe).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { checkAnswer } from '../src/core/verify.ts';
import { loadSecrets, root } from './secrets.mjs';

const { answers } = loadSecrets();
const gen = JSON.parse(readFileSync(`${root}src/generated/answers.json`, 'utf8'));
let fail = 0;
for (const [id, { accept }] of Object.entries(answers)) {
  for (const a of accept) {
    const ok = gen[id] && (await checkAnswer(a, gen[id]));
    if (!ok) { fail++; console.error(`✗ ${id}: "${a}" no valida (¿falta npm run answers?)`); }
  }
  if (gen[id] && (await checkAnswer('respuesta-incorrecta', gen[id]))) { fail++; console.error(`✗ ${id} acepta basura`); }
}
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(`${d}/${f}`).isDirectory() ? walk(`${d}/${f}`) : [`${d}/${f}`]));
if (existsSync(`${root}dist`)) {
  const files = walk(`${root}dist`);
  for (const f of files) if (/SOLUCIONES|answers\.local/i.test(f)) { fail++; console.error(`✗ fichero de soluciones en dist: ${f}`); }
  // Respuestas que no deben aparecer en claro (las del tráfico/hashes forman parte del reto y se excluyen).
  const inBundle = new Set(['e1-hashes', 'e6-paquetes']);
  const text = files.filter((f) => /\.(js|html|css|json)$/.test(f)).map((f) => readFileSync(f, 'utf8').toLowerCase()).join('\n');
  for (const [id, { accept }] of Object.entries(answers)) {
    if (inBundle.has(id)) continue;
    for (const a of accept) if (a.length >= 6 && text.includes(`"${a.toLowerCase()}"`)) { fail++; console.error(`✗ ${id}: "${a}" aparece en claro en dist/`); }
  }
}
console.log(fail ? `${fail} errores` : `OK: ${Object.keys(answers).length} retos verificados`);
process.exit(fail ? 1 : 0);
