// Wordlist reproducible de ~5.000 contraseñas débiles (ES/EN) generada por combinación.
// No usa filtraciones reales: patrones típicos (palabra común + número/año/símbolo, teclados, fechas).
import { writeFileSync } from 'node:fs';
import { root } from './secrets.mjs';

const TARGET = 5000;
const top = ['123456', '12345678', '123456789', '1234567890', '12345', '1234', '111111', '000000', '123123', '654321',
  '666666', '121212', '112233', '987654321', 'qwerty', 'qwerty123', 'qwertyuiop', 'asdfgh', 'asdfghjkl', 'zxcvbnm',
  '1q2w3e4r', '1qaz2wsx', 'qazwsx', 'abc123', 'abcd1234', 'a1b2c3', 'password', 'password1', 'passw0rd', 'contraseña',
  'contrasena', 'clave', 'clave123', 'admin', 'admin123', 'root', 'usuario', 'user', 'login', 'welcome', 'letmein',
  'iloveyou', 'teamo', 'tequiero', 'hola', 'hola123', 'holamundo', 'secret', 'secreto', 'qwe123', '0000', '1111', '7777777'];
const words = [
  // ES
  'amor', 'princesa', 'mariposa', 'futbol', 'estrella', 'tesoro', 'corazon', 'verano', 'invierno', 'primavera', 'otoño',
  'chocolate', 'bonita', 'guapa', 'guapo', 'familia', 'mama', 'papa', 'abuela', 'perro', 'gato', 'perrito', 'gatito',
  'conejo', 'tigre', 'leon', 'lobo', 'dragon', 'pelota', 'playa', 'sol', 'luna', 'cielo', 'mar', 'fresa', 'manzana',
  'naranja', 'pikachu', 'musica', 'baile', 'escuela', 'instituto', 'clase', 'colegio', 'madrid', 'españa', 'espana',
  'barcelona', 'valencia', 'sevilla', 'malaga', 'benidorm', 'alicante', 'dios', 'angel', 'diablo', 'campeon', 'ganador',
  'fiesta', 'feliz', 'vida', 'muerte', 'rosa', 'azul', 'rojo', 'verde', 'negro', 'blanco', 'amigos', 'novio', 'novia',
  'carlos', 'maria', 'lucia', 'pablo', 'alejandro', 'daniel', 'javier', 'sergio', 'laura', 'paula', 'sara', 'marta',
  'david', 'jorge', 'hugo', 'martina', 'sofia', 'alba', 'carmen', 'antonio', 'manuel', 'jose', 'juan', 'ana',
  // EN
  'love', 'princess', 'football', 'soccer', 'baseball', 'basketball', 'monkey', 'shadow', 'sunshine', 'master', 'michael',
  'jordan', 'superman', 'batman', 'starwars', 'pokemon', 'minecraft', 'fortnite', 'gamer', 'killer', 'hunter', 'ninja',
  'pepper', 'cookie', 'summer', 'winter', 'flower', 'butterfly', 'freedom', 'whatever', 'trustno1', 'hello', 'charlie',
  'thomas', 'jessica', 'ashley', 'daniel', 'hannah', 'tigger', 'buster', 'maggie', 'ginger', 'lucky', 'bailey', 'coco',
  'max', 'luna', 'nala', 'simba', 'rocky', 'toby', 'bella', 'chloe', 'oliver', 'jack',
];
const suffixes = ['', '1', '12', '123', '1234', '!', '01', '07', '10', '11', '13', '22', '69', '99', '00', '2', '7', '.',
  ...Array.from({ length: 21 }, (_, i) => String(1995 + i))]; // años 1995-2015
const leet = (w) => w.replace(/a/g, '4').replace(/e/g, '3').replace(/o/g, '0').replace(/i/g, '1');
const cap = (w) => w[0].toUpperCase() + w.slice(1);

const out = new Set(top);
// Ronda por sufijo para que todas las palabras tengan sus variantes más típicas antes de llegar al límite.
for (const suf of suffixes) for (const w of words) out.add(w + suf);
for (const w of words) { out.add(cap(w)); out.add(cap(w) + '123'); out.add(cap(w) + '1'); out.add(leet(w)); out.add(w + w); }
for (let d = 1; d <= 31 && out.size < TARGET + 400; d++) for (let m = 1; m <= 12; m++) out.add(`${String(d).padStart(2, '0')}${String(m).padStart(2, '0')}${d % 2 ? '2008' : '2009'}`);
const list = [...out].slice(0, TARGET);
writeFileSync(`${root}src/generated/wordlist.txt`, list.join('\n') + '\n');
console.log(`wordlist.txt: ${list.length} contraseñas`);
