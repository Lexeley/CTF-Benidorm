import type { Mode } from './types';

/**
 * Código de equipo: "LU1." + base64url(JSON) + "." + checksum.
 * Sistema de honor: el checksum solo detecta copias cortadas o con erratas, no trampas.
 */
export interface TeamData {
  n: string;                        // nombre del equipo
  m: Mode;
  p: number;                        // puntos
  s: [id: string, hints: number, secs: number][]; // retos resueltos
  h: number;                        // pistas usadas en total (incluidas las de retos no resueltos)
}

const PREFIX = 'LU1.';

function b64urlEncode(text: string): string {
  let bin = '';
  for (const b of new TextEncoder().encode(text)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): string {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** FNV-1a 32 bits en base36. */
function checksum(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36);
}

export function encodeTeam(d: TeamData): string {
  const body = b64urlEncode(JSON.stringify(d));
  return `${PREFIX}${body}.${checksum(body)}`;
}

export function decodeTeam(code: string): TeamData {
  const c = code.trim().replace(/\s+/g, '');
  if (!c.startsWith(PREFIX)) throw new Error('No parece un código de equipo (debe empezar por LU1.)');
  const [body, sum] = c.slice(PREFIX.length).split('.');
  if (!body || sum !== checksum(body)) throw new Error('Código incompleto o con erratas');
  let d: TeamData;
  try { d = JSON.parse(b64urlDecode(body)); } catch { throw new Error('Código ilegible'); }
  const ok = d && typeof d.n === 'string' && d.n.length <= 40 && (d.m === 'escritorio' || d.m === 'movil')
    && Number.isFinite(d.p) && Number.isFinite(d.h) && Array.isArray(d.s)
    && d.s.every((x) => Array.isArray(x) && typeof x[0] === 'string' && Number.isFinite(x[1]) && Number.isFinite(x[2]));
  if (!ok) throw new Error('Código con formato inesperado');
  return d;
}

/** Tiempo del último reto resuelto (desempate: antes es mejor). */
export const lastSolveSecs = (d: TeamData) => d.s.reduce((m, x) => Math.max(m, x[2]), 0);

export function rankTeams(list: TeamData[]): TeamData[] {
  return [...list].sort((a, b) => b.p - a.p || lastSolveSecs(a) - lastSolveSecs(b) || a.n.localeCompare(b.n));
}
