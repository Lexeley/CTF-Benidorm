// Genera src/generated/answers.json: por reto solo { mode, salt, hashes }. Nunca la respuesta en claro.
import { writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { normalize } from '../src/core/normalize.ts';
import { answerHash } from '../src/core/verify.ts';
import { loadSecrets, root } from './secrets.mjs';

const { answers } = loadSecrets();
const out = {};
for (const [id, { mode = 'text', accept }] of Object.entries(answers)) {
  const salt = randomBytes(12).toString('hex');
  const norms = [...new Set(accept.map((a) => normalize(a, mode)))];
  out[id] = { mode, salt, hashes: await Promise.all(norms.map((n) => answerHash(salt, n))) };
}
writeFileSync(`${root}src/generated/answers.json`, JSON.stringify(out, null, 2) + '\n');
console.log(`answers.json: ${Object.keys(out).length} retos`);
