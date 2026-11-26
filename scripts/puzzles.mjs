// Datos de los retos e1 (hashes MD5) y e5 (cifrado encadenado) a partir de solutions/answers.local.json.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { caesar, hexEncode, b64encode } from '../src/kit/codec.ts';
import { loadSecrets, root } from './secrets.mjs';

const { e1, e5 } = loadSecrets().params;
const words = new Set(readFileSync(`${root}src/generated/wordlist.txt`, 'utf8').split('\n'));
for (const p of e1.passwords) if (!words.has(p)) { console.error(`✗ "${p}" no está en la wordlist: el Kit no podría crackearla`); process.exit(1); }

const md5 = (s) => createHash('md5').update(s, 'utf8').digest('hex');
// Orden de cifrado: César → hex → Base64. El alumno lo deshace al revés: Base64 → hex → César.
const cipher = b64encode(hexEncode(caesar(e5.plaintext, e5.shift)));
writeFileSync(`${root}src/generated/puzzles.json`, JSON.stringify({ e1Hashes: e1.passwords.map(md5), e5Cipher: cipher }, null, 2) + '\n');
console.log('puzzles.json: OK');
