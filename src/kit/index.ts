import { md5 } from 'js-md5';
import { h } from '../ui/dom';
import { b64decode, b64encode, caesar, hashType, vigenere, hexDecode, hexEncode, inspectUrl, urlDecode, urlEncode } from './codec';
import { exifViewer } from './exif';
import { loadCapture, packetViewer } from './packets';

let uid = 0;
const field = (label: string, el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
  el.id ||= `kit-${++uid}`;
  return [h('label', { for: el.id }, label), el];
};
const textarea = (attrs: Record<string, string | number> = {}) =>
  h('textarea', { rows: 3, autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', ...attrs }) as HTMLTextAreaElement;

async function digest(algo: 'SHA-1' | 'SHA-256', text: string) {
  const b = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}
const hashOf = (algo: 'MD5' | 'SHA-1' | 'SHA-256', t: string) => (algo === 'MD5' ? Promise.resolve(md5(t)) : digest(algo, t));

// ---------- Herramientas ----------
function decoderTool() {
  const input = textarea({ placeholder: 'Pega aquí el texto' });
  const output = textarea({ readonly: 'true' });
  const err = h('p', { class: 'feedback err', role: 'status' });
  const op = (label: string, fn: (s: string) => string) => h('button', { onclick: () => {
    err.textContent = '';
    try { output.value = fn(input.value); } catch (e) { output.value = ''; err.textContent = `No se pudo: ${(e as Error).message || 'formato no válido'}`; }
  } }, label);
  return [
    ...field('Entrada', input),
    h('div', { class: 'row' },
      op('base64 -> texto', b64decode), op('texto -> base64', b64encode),
      op('hex -> texto', hexDecode), op('texto -> hex', hexEncode),
      op('url -> texto', urlDecode), op('texto -> url', urlEncode),
      op('invertir', (t) => [...t].reverse().join(''))),
    err,
    ...field('Resultado', output),
    h('button', { onclick: () => { input.value = output.value; output.value = ''; input.focus(); } }, 'Usar el resultado como entrada'),
  ];
}

function caesarTool() {
  const input = textarea({ placeholder: 'Texto cifrado' });
  const shift = h('input', { type: 'number', min: -25, max: 25, value: 3, style: 'max-width:7rem' }) as HTMLInputElement;
  const output = textarea({ readonly: 'true' });
  const all = h('ol', { class: 'mono', start: 0, style: 'font-size:.9rem' });
  const run = () => { output.value = caesar(input.value, -Number(shift.value || 0)); };
  input.addEventListener('input', run); shift.addEventListener('input', run);
  return [
    ...field('Texto', input),
    ...field('Desplazamiento (cuántas letras se movió al cifrar; ROT13 = 13)', shift),
    ...field('Descifrado', output),
    h('button', { onclick: () => all.replaceChildren(...Array.from({ length: 26 }, (_, k) => h('li', {}, `ROT-${k}: ${caesar(input.value, -k)}`))) }, 'Probar los 26 desplazamientos'),
    all,
  ];
}

function vigenereTool() {
  const input = textarea({ placeholder: 'Texto cifrado' });
  const key = h('input', { autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', placeholder: 'clave (solo letras)' }) as HTMLInputElement;
  const output = textarea({ readonly: 'true' });
  const run = () => { output.value = vigenere(input.value, key.value, true); };
  input.addEventListener('input', run); key.addEventListener('input', run);
  return [
    h('p', { class: 'muted' }, 'Como César, pero cada letra se desplaza según una letra de la clave (a=0, b=1…), que se repite.'),
    ...field('Texto', input), ...field('Clave', key), ...field('Descifrado', output),
  ];
}

function hashTool() {
  const input = h('input', { autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', placeholder: 'Texto' }) as HTMLInputElement;
  const out = h('dl', { class: 'kv' });
  input.addEventListener('input', async () => {
    const t = input.value;
    const rows = await Promise.all((['MD5', 'SHA-1', 'SHA-256'] as const).map(async (a) => [a, await hashOf(a, t)] as const));
    if (input.value === t) out.replaceChildren(...rows.flatMap(([a, v]) => [h('dt', {}, a), h('dd', {}, v)]));
  });
  return [...field('Calcular el hash de', input), out];
}

let wordlist: string[] | null = null;
function crackTool() {
  const input = h('input', { autocomplete: 'off', spellcheck: 'false', placeholder: 'p. ej. e10adc3949ba59abbe56e057f20f883e' }) as HTMLInputElement;
  const salt = h('input', { autocomplete: 'off', spellcheck: 'false', placeholder: 'vacío si no hay sal' }) as HTMLInputElement;
  const out = h('p', { class: 'feedback', role: 'status' });
  const btn = h('button', { class: 'primary', onclick: async () => {
    const target = input.value.trim().toLowerCase();
    const type = hashType(target);
    if (!type) { out.className = 'feedback err'; out.textContent = 'Eso no parece un hash MD5 (32), SHA-1 (40) o SHA-256 (64 caracteres hex).'; return; }
    out.className = 'feedback'; out.textContent = `Buscando (${type})…`;
    wordlist ??= (await import('../generated/wordlist.txt?raw')).default.split('\n').filter(Boolean);
    const pre = salt.value;
    for (const w of wordlist) {
      if ((await hashOf(type, pre + w)) === target) { out.className = 'feedback ok'; out.textContent = `Encontrada: ${type}("${pre}${w}") → contraseña: ${w}`; return; }
    }
    out.className = 'feedback err'; out.textContent = `No está entre las ${wordlist.length} contraseñas de la lista. ¡Eso es bueno para su dueño!`;
  } }, 'Buscar en la wordlist');
  return [
    h('p', { class: 'muted' }, 'Compara el hash con los de ~5.000 contraseñas débiles. Así atacan los «crackeadores»: no «deshacen» el hash, prueban contraseñas comunes.'),
    ...field('Hash', input), ...field('Sal (se antepone a cada contraseña: sal + contraseña)', salt), btn, out,
  ];
}

function urlTool() {
  const input = h('input', { type: 'text', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', placeholder: 'https://ejemplo.com/ruta?x=1' }) as HTMLInputElement;
  const out = h('div', { class: 'stack', 'aria-live': 'polite' });
  const run = () => {
    if (!input.value.trim()) return out.replaceChildren();
    try {
      const i = inspectUrl(input.value);
      const row = (k: string, v: string) => (v ? [h('dt', {}, k), h('dd', {}, v)] : []);
      out.replaceChildren(
        h('dl', { class: 'kv' },
          ...row('Esquema', i.scheme), ...row('Usuario (¡ojo!)', i.user), ...row('Host completo', i.host),
          ...row('Subdominio', i.subdomain), ...row('Dominio real', i.registrable), ...row('Extensión', i.suffix),
          ...row('Puerto', i.port), ...row('Ruta', i.path), ...row('Fragmento', i.fragment),
          ...i.params.flatMap(([k, v]) => row(`Parámetro ${k}`, v))),
        h('p', {}, 'El que manda es el ', h('strong', {}, 'dominio real'), ': léelo de derecha a izquierda desde la primera «/».'),
        i.warnings.length
          ? h('ul', {}, ...i.warnings.map((w) => h('li', { class: 'feedback err' }, `[!] ${w}`)))
          : h('p', { class: 'feedback ok' }, 'Sin señales sospechosas evidentes (eso no garantiza que sea legítima).'));
    } catch { out.replaceChildren(h('p', { class: 'feedback err' }, 'No es una URL válida.')); }
  };
  input.addEventListener('input', run);
  return [h('p', { class: 'muted' }, 'Solo analiza el texto: no abre la web.'), ...field('URL', input), out];
}

function packetTool() {
  const box = h('div', {}, h('p', { class: 'muted' }, 'Cargando captura…'));
  loadCapture().then((c) => box.replaceChildren(packetViewer(c)));
  return [box];
}

// ---------- Contenedor ----------
const TOOLS: [string, string, () => Node[]][] = [
  ['decoder', 'decodificador base64 / hex / url', decoderTool],
  ['caesar', 'césar / rot', caesarTool],
  ['vigenere', 'vigenère', vigenereTool],
  ['hash', 'calculadora de hash', hashTool],
  ['crack', 'buscador de hash (wordlist)', crackTool],
  ['exif', 'visor exif', () => []],
  ['url', 'inspector de url', urlTool],
  ['packets', 'visor de paquetes', packetTool],
];

// Para abrir una herramienta ya rellena desde un reto (botones "analizar en el kit").
let pending: { tool: string; value: string } | null = null;
export function openInKit(tool: string, value: string): void {
  pending = { tool, value };
  if (location.hash === '#kit') dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = 'kit';
}

export function renderKit(samples: { label: string; url: string }[] = []): HTMLElement {
  const want = pending;
  pending = null;
  return h('section', { class: 'stack' },
    h('h1', {}, 'Kit de herramientas'),
    h('p', { class: 'muted' }, 'Todo funciona dentro de esta web, sin internet y sin enviar nada fuera.'),
    ...TOOLS.map(([id, title, make]) => {
      const body = h('div', { class: 'stack' });
      const d = h('details', { class: 'card', id: `tool-${id}` }, h('summary', {}, h('strong', {}, title)), body);
      const build = () => { if (!body.childElementCount) body.append(...(id === 'exif' ? [exifViewer(samples)] : make())); };
      d.addEventListener('toggle', () => { if (d.open) build(); });
      if (want?.tool === id) {
        build();
        d.open = true;
        const field = body.querySelector('input:not([type=file]), textarea') as HTMLInputElement | null;
        if (field) { field.value = want.value; field.dispatchEvent(new Event('input')); }
        setTimeout(() => { d.scrollIntoView({ block: 'start' }); field?.focus(); }, 50);
      }
      return d;
    }));
}

/** Precarga los trozos pesados en segundo plano: si luego se cae la red, el Kit sigue funcionando. */
export function prefetchKit(): void {
  const go = () => { void import('../generated/wordlist.txt?raw'); void import('exifr/dist/lite.esm.mjs'); void loadCapture(); };
  if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 1500);
}
