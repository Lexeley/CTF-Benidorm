import './styles.css';
import { scoreSync } from './core/scoresync';
import { decodeTeam, rankTeams, type TeamData } from './core/teamcode';
import { confirmDialog, fmtTime, h } from './ui/dom';

document.body.classList.add('wide');
const app = document.getElementById('app')!;
const MODE_LABEL = { escritorio: 'portátil', movil: 'móvil' } as const;

const paste = h('textarea', { id: 'codes', rows: 4, spellcheck: 'false', placeholder: '4F7K-2XQ9 Los Cortafuegos\n(un equipo por línea: código y nombre)' }) as HTMLTextAreaElement;
const msg = h('p', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
const filter = h('select', { id: 'filter' },
  h('option', { value: '' }, 'Todos'), h('option', { value: 'escritorio' }, 'Portátil'), h('option', { value: 'movil' }, 'Móvil')) as HTMLSelectElement;
const board = h('section', { class: 'card stack', id: 'board', style: 'background:var(--bg)' });
const video = h('video', { playsinline: true, muted: true, style: 'max-width:420px;width:100%;border-radius:10px;display:none' }) as HTMLVideoElement;
const scanBtn = h('button', {}, 'Escanear QR');

async function addCodes(text: string) {
  // Una línea por equipo: «CÓDIGO Nombre». El código admite guion o no (4F7K-2XQ9 / 4F7K2XQ9).
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const ok: string[] = [], bad: string[] = [];
  for (const l of lines) {
    const m = l.match(/^([0-9a-z]{4}[\s-]?[0-9a-z]{4})\s+(.+)$/i);
    try {
      if (!m) throw new Error('Formato: CÓDIGO Nombre (p. ej. 4F7K-2XQ9 Los Cortafuegos)');
      const t = decodeTeam(m[1], m[2]); await scoreSync.publish(t); ok.push(t.n);
    } catch (e) { bad.push(`«${l}»: ${(e as Error).message}`); }
  }
  msg.className = `feedback ${bad.length ? 'err' : 'ok'}`;
  msg.textContent = [ok.length && `[ok] Añadido: ${ok.join(', ')}`, bad.length && `[error] ${bad.length} código(s) no válidos: ${bad[0]}`].filter(Boolean).join(' · ');
  await render();
}

async function render() {
  const all = rankTeams(await scoreSync.list()).filter((t) => !filter.value || t.m === filter.value);
  board.replaceChildren(
    h('h2', {}, `Clasificación (${all.length} equipos)`),
    all.length === 0
      ? h('p', { class: 'muted' }, 'Aún no hay equipos. Pega o escanea sus códigos.')
      : h('div', { class: 'table-wrap' }, h('table', { class: 'ranking' },
        h('thead', {}, h('tr', {}, ...['#', 'Equipo', 'Modo', 'Puntos', 'Retos', 'Pistas', 'Último reto', ''].map((x) => h('th', { scope: 'col' }, x)))),
        h('tbody', {}, ...all.map((t: TeamData, i) => h('tr', {},
          h('td', {}, String(i + 1)),
          h('td', {}, t.n), h('td', {}, MODE_LABEL[t.m]),
          h('td', {}, h('strong', {}, String(t.p))), h('td', {}, `${t.k}/7`), h('td', {}, String(t.h)),
          h('td', {}, t.k ? fmtTime(t.t) : '—'),
          h('td', {}, h('button', { 'aria-label': `Quitar ${t.n}`, onclick: async () => {
            if (await confirmDialog(`¿Quitar a «${t.n}» del marcador?`, 'Quitar')) { await scoreSync.remove(t.n, t.m); await render(); }
          } }, 'x'))))))));
}

// ---------- Escáner QR: BarcodeDetector nativo si existe, si no jsQR (Chrome de Windows no lo trae) ----------
let stream: MediaStream | null = null;
let lastCode = '';
async function startScan() {
  if (stream) return stopScan();
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  } catch {
    msg.className = 'feedback err';
    msg.textContent = 'No se pudo abrir la cámara (¿permiso denegado o la web no va por https?). Pega los códigos a mano.';
    return;
  }
  video.srcObject = stream;
  video.style.display = 'block';
  await video.play();
  scanBtn.textContent = 'Parar escáner';
  type Detector = { detect(v: HTMLVideoElement): Promise<{ rawValue: string }[]> };
  const BD = (window as unknown as { BarcodeDetector?: new (o: object) => Detector }).BarcodeDetector;
  const native = BD ? new BD({ formats: ['qr_code'] }) : null;
  const jsQR = native ? null : (await import('jsqr')).default;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const loop = async () => {
    if (!stream) return;
    let found: string | undefined;
    if (video.readyState >= 2) {
      if (native) found = (await native.detect(video).catch(() => []))[0]?.rawValue;
      else if (jsQR) {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        found = jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height)?.data;
      }
    }
    if (found && found !== lastCode) { lastCode = found; await addCodes(found); }
    setTimeout(loop, 250);
  };
  loop();
}
function stopScan() {
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
  video.style.display = 'none';
  scanBtn.textContent = 'Escanear QR';
}
scanBtn.addEventListener('click', startScan);

filter.addEventListener('change', render);
addEventListener('storage', render); // si el marcador está abierto en otra pestaña

app.append(
  h('header', { class: 'topbar' }, h('a', { class: 'title', href: '../' }, 'CTF Laura · Profe'), h('span', { class: 'muted' }, 'Sistema de honor')),
  h('h1', {}, 'Marcador'),
  h('div', { class: 'card stack' },
    h('label', { for: 'codes' }, 'Códigos de equipo'),
    paste,
    h('div', { class: 'row' },
      h('button', { class: 'primary', onclick: () => { void addCodes(paste.value); paste.value = ''; } }, 'Añadir'),
      scanBtn),
    video, msg),
  h('div', { class: 'row', style: 'margin:1rem 0' },
    h('label', { for: 'filter', style: 'margin:0' }, 'Mostrar'), filter,
    h('button', { onclick: () => board.requestFullscreen?.().catch(() => {}) }, 'Pantalla completa'),
    h('button', { class: 'danger', onclick: async () => {
      if (await confirmDialog('¿Vaciar el marcador de este dispositivo? No se puede deshacer.', 'Vaciar')) { await scoreSync.clear(); await render(); }
    } }, 'Vaciar')),
  board,
  h('details', { class: 'card', style: 'margin-top:1rem' },
    h('summary', {}, 'Cómo funciona'),
    h('p', {}, 'Cada equipo tiene un código (pestaña «Equipo») con su nombre, retos, pistas y tiempos. Aquí se juntan y ordenan por puntos; a igualdad, gana quien resolvió antes su último reto.'),
    h('p', {}, 'Los datos se guardan solo en este navegador. Si un equipo manda un código nuevo, se queda el más avanzado.'),
    h('p', { class: 'muted' }, 'Es un sistema de honor: un alumno con conocimientos podría falsificar su código. Para este taller es suficiente.')),
);
void render();
