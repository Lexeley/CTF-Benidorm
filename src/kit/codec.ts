// Funciones puras del Kit (testeadas en tests/kit.test.ts).

const utf8 = new TextEncoder();
const fromUtf8 = (b: Uint8Array) => new TextDecoder('utf-8', { fatal: false }).decode(b);

export function b64encode(text: string): string {
  let bin = '';
  for (const b of utf8.encode(text)) bin += String.fromCharCode(b);
  return btoa(bin);
}
export function b64decode(b64: string): string {
  const clean = b64.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = clean + '='.repeat((4 - (clean.length % 4)) % 4);
  return fromUtf8(Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)));
}
export const hexEncode = (text: string) => [...utf8.encode(text)].map((b) => b.toString(16).padStart(2, '0')).join(' ');
export function hexDecode(hex: string): string {
  const clean = hex.replace(/0x/gi, '').replace(/[^0-9a-f]/gi, '');
  if (clean.length % 2) throw new Error('Número impar de dígitos hex');
  return fromUtf8(Uint8Array.from(clean.match(/../g) ?? [], (x) => parseInt(x, 16)));
}
export const urlDecode = (s: string) => decodeURIComponent(s.replace(/\+/g, ' '));
export const urlEncode = (s: string) => encodeURIComponent(s);

/** César sobre A-Z/a-z (la ñ y los símbolos no se tocan). */
export function caesar(text: string, shift: number): string {
  const k = ((shift % 26) + 26) % 26;
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + k) % 26) + base);
  });
}

export function hashType(hash: string): 'MD5' | 'SHA-1' | 'SHA-256' | null {
  const h = hash.trim().toLowerCase();
  if (!/^[0-9a-f]+$/.test(h)) return null;
  return h.length === 32 ? 'MD5' : h.length === 40 ? 'SHA-1' : h.length === 64 ? 'SHA-256' : null;
}

// ---- Inspector de URL ----
const MULTI_SUFFIX = ['co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com.es', 'org.es', 'nom.es', 'gob.es', 'edu.es',
  'com.mx', 'com.ar', 'com.br', 'com.au', 'co.jp', 'com.co', 'com.pe'];

export interface UrlInfo {
  scheme: string; user: string; host: string; port: string; suffix: string; registrable: string;
  subdomain: string; path: string; params: [string, string][]; fragment: string; warnings: string[];
}

export function inspectUrl(raw: string): UrlInfo {
  let input = raw.trim();
  const warnings: string[] = [];
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(input)) { input = `http://${input}`; warnings.push('Sin esquema: el navegador probablemente lo abriría con http:// (sin cifrar).'); }
  const u = new URL(input);
  const host = u.hostname.toLowerCase();
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[');
  const labels = host.split('.');
  let suffix = '', registrable = host, subdomain = '';
  if (!isIp && labels.length >= 2) {
    const two = labels.slice(-2).join('.');
    const n = MULTI_SUFFIX.includes(two) ? 2 : 1;
    suffix = labels.slice(-n).join('.');
    registrable = labels.slice(-(n + 1)).join('.');
    subdomain = labels.slice(0, -(n + 1)).join('.');
  }
  if (u.protocol === 'http:') warnings.push('Usa http: todo lo que escribas viaja sin cifrar.');
  if (u.username) warnings.push(`Lleva «${decodeURIComponent(u.username)}@» delante del host: lo de antes de la @ NO es la web real.`);
  if (isIp) warnings.push('El host es una dirección IP, no un nombre de dominio.');
  if (host.includes('xn--')) warnings.push('Dominio con caracteres internacionales (punycode): puede imitar letras.');
  if (subdomain && /(^|\.)(com|es|net|org)(\.|$)/.test(subdomain)) warnings.push(`El subdominio «${subdomain}» imita un dominio, pero el dominio real es «${registrable}».`);
  if (subdomain.split('.').length >= 3) warnings.push('Muchos subdominios: típico para esconder el dominio real.');
  if (/-/.test(registrable) && /(seguro|verifica|login|cuenta|pago|envio|multa|premio)/.test(registrable)) warnings.push('Dominio con guiones y palabras como «seguro», «pago» o «verifica»: muy típico del phishing.');
  if (registrable.length <= 12 && /^\/[A-Za-z0-9]{4,10}\/?$/.test(u.pathname) && !u.search) warnings.push('Parece un acortador de enlaces: no sabes a dónde te lleva de verdad.');
  if (u.port) warnings.push(`Puerto no habitual: ${u.port}.`);
  return {
    scheme: u.protocol.replace(':', ''), user: decodeURIComponent(u.username), host, port: u.port, suffix, registrable, subdomain,
    path: decodeURIComponent(u.pathname), params: [...u.searchParams.entries()], fragment: u.hash.slice(1), warnings,
  };
}

// ---- Geo ----
export function toDms(dec: number, pos: string, neg: string): string {
  const a = Math.abs(dec);
  const d = Math.floor(a), mFloat = (a - d) * 60, m = Math.floor(mFloat), s = (mFloat - m) * 60;
  return `${d}° ${m}' ${s.toFixed(1)}" ${dec >= 0 ? pos : neg}`;
}
export function distanceKm(a: [number, number], b: [number, number]): number {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad, dLon = (b[1] - a[1]) * rad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
