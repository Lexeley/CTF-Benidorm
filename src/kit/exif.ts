import { h } from '../ui/dom';
import { toDms } from './codec';

// Lugares públicos conocidos (coordenadas aproximadas) para orientarse sin internet.
const PLACES: [string, number, number][] = [
  ['Templo de Debod (Madrid)', 40.4240, -3.7178], ['Palacio Real (Madrid)', 40.4180, -3.7143],
  ['Plaza de España (Madrid)', 40.4233, -3.7122], ['Puerta del Sol (Madrid)', 40.4169, -3.7035],
  ['Plaza Mayor (Madrid)', 40.4155, -3.7074], ['Fuente de Cibeles (Madrid)', 40.4193, -3.6931],
  ['Puerta de Alcalá (Madrid)', 40.4200, -3.6887], ['Museo del Prado (Madrid)', 40.4138, -3.6921],
  ['Palacio de Cristal, Retiro (Madrid)', 40.4137, -3.6820], ['Estación de Atocha (Madrid)', 40.4066, -3.6892],
  ['Sagrada Família (Barcelona)', 41.4036, 2.1744], ['Alhambra (Granada)', 37.1761, -3.5881],
  ['Mezquita-Catedral (Córdoba)', 37.8789, -4.7794], ['Acueducto (Segovia)', 40.9481, -4.1184],
  ['Catedral de Santiago de Compostela', 42.8806, -8.5446], ['Torre de Hércules (A Coruña)', 43.3859, -8.4065],
  ['Ciudad de las Artes y las Ciencias (Valencia)', 39.4546, -0.3505], ['Balcón del Mediterráneo (Benidorm)', 38.5346, -0.1310],
  ['Giralda (Sevilla)', 37.3862, -5.9926], ['Basílica del Pilar (Zaragoza)', 41.6567, -0.8786],
];

// Contorno muy simplificado de la península (lon, lat).
const IBERIA: [number, number][] = [[-8.9, 43.3], [-7.7, 43.75], [-5.8, 43.6], [-4, 43.45], [-1.8, 43.4], [0, 42.7], [1.5, 42.5],
  [3.2, 42.4], [3.2, 41.9], [2.2, 41.4], [0.9, 41], [0.2, 40.2], [-0.3, 39.4], [0.2, 38.8], [-0.5, 38.3], [-0.8, 37.6], [-1.6, 37.3],
  [-2.2, 36.7], [-4.4, 36.7], [-5.6, 36], [-6.3, 36.5], [-7.4, 37.2], [-8.9, 37], [-8.8, 38.5], [-9.5, 38.8], [-8.9, 40], [-8.7, 41.2], [-8.9, 42.2]];

const SVGNS = 'http://www.w3.org/2000/svg';
const svg = (tag: string, attrs: Record<string, string | number>) => {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
};

function miniMap(lat: number, lon: number): SVGSVGElement {
  const [x0, x1, y0, y1] = [-10, 4, 35.5, 44.2];
  const px = (lo: number) => ((lo - x0) / (x1 - x0)) * 280, py = (la: number) => ((y1 - la) / (y1 - y0)) * 200;
  const root = svg('svg', { viewBox: '0 0 280 200', width: 280, height: 200, role: 'img', 'aria-label': `Mapa esquemático con el punto en ${lat.toFixed(4)}, ${lon.toFixed(4)}` }) as SVGSVGElement;
  root.append(svg('rect', { width: 280, height: 200, fill: '#0d2236' }),
    svg('polygon', { points: IBERIA.map(([lo, la]) => `${px(lo)},${py(la)}`).join(' '), fill: '#1f3b2c', stroke: '#4ef08a', 'stroke-width': 1 }));
  if (lon > x0 && lon < x1 && lat > y0 && lat < y1) {
    root.append(svg('circle', { cx: px(lon), cy: py(lat), r: 9, fill: 'none', stroke: '#ffc261', 'stroke-width': 2 }),
      svg('circle', { cx: px(lon), cy: py(lat), r: 3, fill: '#ff7b7b' }));
  }
  return root;
}

const LABELS: Record<string, string> = {
  Make: 'Fabricante', Model: 'Modelo', Software: 'Software', DateTimeOriginal: 'Fecha de la foto', CreateDate: 'Fecha de creación',
  ImageDescription: 'Descripción', Artist: 'Autor', GPSAltitude: 'Altitud (m)',
};

async function showExif(out: HTMLElement, data: ArrayBuffer | Blob, name: string) {
  out.replaceChildren(h('p', { class: 'muted' }, 'Leyendo metadatos…'));
  const { default: exifr } = await import('exifr/dist/lite.esm.mjs');
  let tags: Record<string, unknown> | undefined;
  try { tags = await exifr.parse(data, { tiff: true, exif: true, gps: true, mergeOutput: true, reviveValues: true }); } catch { tags = undefined; }
  if (!tags) return out.replaceChildren(h('p', {}, `«${name}» no tiene metadatos EXIF (o no es una imagen JPG/TIFF).`));

  const fmt = (v: unknown) => (v instanceof Date ? v.toLocaleString('es-ES') : Array.isArray(v) ? v.join(', ') : String(v));
  const known = Object.keys(LABELS).filter((k) => k in tags!);
  const rest = Object.keys(tags).filter((k) => !(k in LABELS) && !/^(GPS(Latitude|Longitude)|latitude|longitude)/.test(k));
  const lat = tags.latitude as number | undefined, lon = tags.longitude as number | undefined;
  const nodes: Node[] = [
    h('h3', {}, `Metadatos de «${name}»`),
    h('dl', { class: 'kv' }, ...known.flatMap((k) => [h('dt', {}, LABELS[k]), h('dd', {}, fmt(tags![k]))])),
  ];
  if (typeof lat === 'number' && typeof lon === 'number') {
    nodes.push(
      h('h3', {}, 'GPS'),
      h('p', { class: 'mono' }, `${lat.toFixed(5)}, ${lon.toFixed(5)}`, h('br'), `${toDms(lat, 'N', 'S')}  ${toDms(lon, 'E', 'O')}`),
      miniMap(lat, lon),
      h('details', {}, h('summary', {}, 'Coordenadas de lugares conocidos (para comparar)'),
        h('div', { class: 'table-wrap' }, h('table', {},
          h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Lugar'), h('th', { scope: 'col' }, 'Latitud'), h('th', { scope: 'col' }, 'Longitud'))),
          h('tbody', {}, ...[...PLACES].sort((x, y) => x[0].localeCompare(y[0])).map(([n, la, lo]) =>
            h('tr', {}, h('td', {}, n), h('td', {}, la.toFixed(4)), h('td', {}, lo.toFixed(4)))))))));
  } else nodes.push(h('p', {}, 'Esta foto no tiene coordenadas GPS.'));
  nodes.push(h('details', {}, h('summary', {}, `Resto de etiquetas (${rest.length})`),
    h('dl', { class: 'kv' }, ...rest.flatMap((k) => [h('dt', {}, k), h('dd', {}, fmt(tags![k]).slice(0, 120))]))));
  out.replaceChildren(...nodes);
}

export function exifViewer(samples: { label: string; url: string }[]): HTMLElement {
  const out = h('div', { class: 'stack', 'aria-live': 'polite' });
  const file = h('input', { type: 'file', id: 'exif-file', accept: 'image/jpeg,image/*' }) as HTMLInputElement;
  file.addEventListener('change', () => { const f = file.files?.[0]; if (f) void showExif(out, f, f.name); });
  return h('div', { class: 'stack' },
    h('label', { for: 'exif-file' }, 'Abre una foto (no sale de tu dispositivo)'),
    file,
    samples.length > 0 && h('div', { class: 'row' }, ...samples.map((s) =>
      h('button', { onclick: async () => showExif(out, await (await fetch(s.url)).blob(), s.label) }, `Abrir ${s.label}`))),
    out);
}
