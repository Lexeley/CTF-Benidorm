// Datos de los retos e1 (hashes con sal) y e5 (cifrado encadenado) a partir de solutions/answers.local.json.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { hexEncode, b64encode, vigenere } from '../src/kit/codec.ts';
import { loadSecrets, root } from './secrets.mjs';

const { e1, e5 } = loadSecrets().params;
const words = new Set(readFileSync(`${root}src/generated/wordlist.txt`, 'utf8').split('\n'));
for (const [u, , p] of e1.entries) {
  const should = p.length < 20; // las débiles deben estar en la wordlist; la frase larga NO
  if (words.has(p) !== should) { console.error(`✗ ${u}: "${p}" ${should ? 'no está' : 'está'} en la wordlist`); process.exit(1); }
}
const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const shadow = ['# exportado de GestorClaves v1.2', '# formato: usuario:sal:sha256(sal + contraseña)', ...e1.entries.map(([u, salt, p]) => `${u}:${salt}:${sha256(salt + p)}`)];
// Orden de cifrado: Vigenère → invertir → hex → Base64. El alumno lo deshace al revés.
const reversed = [...vigenere(e5.plaintext, e5.key)].reverse().join('');
writeFileSync(`${root}src/generated/puzzles.json`, JSON.stringify({ e1Shadow: shadow.join('\n'), e5Cipher: b64encode(hexEncode(reversed)) }, null, 2) + '\n');
console.log('puzzles.json: OK');
