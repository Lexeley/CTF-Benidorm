import type { Mode } from './types';

/**
 * Código de equipo corto para copiar a mano: 8 caracteres Crockford base32 («4F7K-2XQ9»).
 * Lleva modo, retos resueltos, pistas, puntos y segundos del último reto; el nombre va aparte
 * (el profe escribe «CÓDIGO Nombre»). Sistema de honor: el checksum de 13 bits solo detecta
 * erratas al copiar, no trampas.
 */
export interface TeamData {
  n: string;   // nombre del equipo
  m: Mode;
  p: number;   // puntos
  k: number;   // retos resueltos
  h: number;   // pistas usadas en total (incluidas las de retos no resueltos)
  t: number;   // segundos hasta el último reto resuelto (desempate)
}

const ALPHA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // sin I, L, O, U: no se confunden al escribir
const CHK = 2 ** 13;
const STEP = 25; // ponytail: los puntos siempre son múltiplos de 25 (100/200/300 menos pistas del 25 %); si cambia HINT_COST, revisar

/** FNV-1a de 32 bits recortado a 13. */
function checksum(v: number): number {
  let h = 0x811c9dc5;
  for (const c of String(v)) { h ^= c.charCodeAt(0); h = Math.imul(h, 0x01000193); }
  return (h >>> 0) % CHK;
}

const clamp = (x: number, max: number) => Math.min(max, Math.max(0, Math.round(x)));

export function encodeTeam(d: Omit<TeamData, 'n'>): string {
  // 27 bits de datos: modo 1 · resueltos 3 · pistas 4 · puntos/25 7 · segundos 12
  let v = d.m === 'movil' ? 1 : 0;
  v = v * 8 + clamp(d.k, 7);
  v = v * 16 + clamp(d.h, 15);
  v = v * 128 + clamp(d.p / STEP, 127);
  v = v * 4096 + clamp(d.t, 4095);
  let n = v * CHK + checksum(v); // 40 bits: cabe de sobra en un Number
  let out = '';
  for (let i = 0; i < 8; i++) { out = ALPHA[n % 32] + out; n = Math.floor(n / 32); }
  return `${out.slice(0, 4)}-${out.slice(4)}`;
}

/** Acepta minúsculas, guiones/espacios y confusiones típicas (O→0, I/L→1). */
export function decodeTeam(code: string, name: string): TeamData {
  const c = code.toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
  if (!/^[0-9A-HJKMNP-TV-Z]{8}$/.test(c)) throw new Error('El código debe tener 8 caracteres (p. ej. 4F7K-2XQ9)');
  let n = 0;
  for (const ch of c) n = n * 32 + ALPHA.indexOf(ch);
  let v = Math.floor(n / CHK);
  if (n % CHK !== checksum(v)) throw new Error('Código con erratas: revisadlo carácter a carácter');
  const t = v % 4096; v = Math.floor(v / 4096);
  const p = (v % 128) * STEP; v = Math.floor(v / 128);
  const h = v % 16; v = Math.floor(v / 16);
  const k = v % 8; v = Math.floor(v / 8);
  const n2 = name.trim().replace(/\s+/g, ' ').slice(0, 40);
  if (!n2) throw new Error('Falta el nombre del equipo después del código');
  return { n: n2, m: v ? 'movil' : 'escritorio', p, k, h, t };
}

export function rankTeams(list: TeamData[]): TeamData[] {
  return [...list].sort((a, b) => b.p - a.p || a.t - b.t || a.n.localeCompare(b.n));
}
