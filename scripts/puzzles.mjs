// Datos de los retos e1 (hashes de varios tipos) y e5 (cifrado encadenado) a partir de solutions/answers.local.json.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { caesar, hexEncode, b64encode } from '../src/kit/codec.ts';
import { loadSecrets, root } from './secrets.mjs';

const { e1, e5 } = loadSecrets().params;
const words = new Set(readFileSync(`${root}src/generated/wordlist.txt`, 'utf8').split('\n'));
for (const [, p] of e1.hashes) {
  const should = p.length < 20; // las débiles deben estar en la wordlist; la frase larga NO
  if (words.has(p) !== should) { console.error(`✗ "${p}" ${should ? 'no está' : 'está'} en la wordlist`); process.exit(1); }
}
const algo = { MD5: 'md5', 'SHA-1': 'sha1', 'SHA-256': 'sha256' };
const hash = (a, s) => createHash(algo[a]).update(s, 'utf8').digest('hex');
// Orden de cifrado: César → invertir → hex → Base64. El alumno lo deshace al revés.
const reversed = [...caesar(e5.plaintext, e5.shift)].reverse().join('');
const cipher = b64encode(hexEncode(reversed));
writeFileSync(`${root}src/generated/puzzles.json`, JSON.stringify({ e1Hashes: e1.hashes.map(([a, p]) => hash(a, p)), e5Cipher: cipher }, null, 2) + '\n');
console.log('puzzles.json: OK');
