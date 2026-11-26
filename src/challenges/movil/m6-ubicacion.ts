import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import foto from '../../generated/foto-movil.jpg?url';

// Barrios ESQUEMÁTICOS (rectángulos aproximados, no son límites oficiales): [nombre, latMin, latMax, lonMin, lonMax]
const ZONES: [string, number, number, number, number][] = [
  ['Moncloa', 40.425, 40.445, -3.730, -3.712], ['Chamberí', 40.428, 40.445, -3.712, -3.690],
  ['Salamanca', 40.420, 40.445, -3.690, -3.665], ['Centro', 40.405, 40.428, -3.718, -3.690],
  ['Retiro', 40.400, 40.420, -3.690, -3.665], ['Arganzuela', 40.390, 40.405, -3.718, -3.690],
];
const [LAT0, LAT1, LON0, LON1] = [40.388, 40.447, -3.732, -3.663];
const W = 340, H = 300;
const x = (lon: number) => 40 + ((lon - LON0) / (LON1 - LON0)) * (W - 50);
const y = (lat: number) => 10 + ((LAT1 - lat) / (LAT1 - LAT0)) * (H - 40);

const NS = 'http://www.w3.org/2000/svg';
const s = (tag: string, a: Record<string, string | number>, text?: string) => {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(a)) el.setAttribute(k, String(v));
  if (text) el.textContent = text;
  return el;
};

function map(): SVGSVGElement {
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img',
    'aria-label': 'Mapa esquemático de barrios con cuadrícula de coordenadas y un círculo de ubicación aproximada de Lucía entre Chamberí y Salamanca' }) as SVGSVGElement;
  svg.append(s('rect', { width: W, height: H, fill: '#0d1620' }));
  const fills = ['#22384f', '#2b4a36', '#4a3a24', '#3d2b45', '#24443f', '#47302e'];
  ZONES.forEach(([n, a, b, c, d], i) => {
    svg.append(s('rect', { x: x(c), y: y(b), width: x(d) - x(c), height: y(a) - y(b), fill: fills[i], stroke: '#a9b7c6', 'stroke-width': 1 }),
      s('text', { x: (x(c) + x(d)) / 2, y: (y(a) + y(b)) / 2, fill: '#eef3f8', 'font-size': 11, 'text-anchor': 'middle', 'font-family': 'monospace' }, n));
  });
  for (let lat = 40.39; lat <= 40.445; lat += 0.01) {
    svg.append(s('line', { x1: 40, x2: W - 10, y1: y(lat), y2: y(lat), stroke: '#ffffff', 'stroke-opacity': 0.15 }),
      s('text', { x: 2, y: y(lat) + 3, fill: '#a9b7c6', 'font-size': 8, 'font-family': 'monospace' }, lat.toFixed(2)));
  }
  for (let lon = -3.73; lon <= -3.665; lon += 0.01) {
    svg.append(s('line', { y1: 10, y2: H - 30, x1: x(lon), x2: x(lon), stroke: '#ffffff', 'stroke-opacity': 0.15 }),
      s('text', { x: x(lon), y: H - 18, fill: '#a9b7c6', 'font-size': 8, 'text-anchor': 'middle', 'font-family': 'monospace' }, lon.toFixed(2)));
  }
  svg.append(s('text', { x: W / 2, y: H - 4, fill: '#a9b7c6', 'font-size': 9, 'text-anchor': 'middle' }, 'longitud →   (latitud a la izquierda)'));
  // Ubicación aproximada que comparte la app (círculo grande a caballo entre dos barrios)
  svg.append(s('circle', { cx: x(-3.690), cy: y(40.436), r: 34, fill: '#ffc261', 'fill-opacity': 0.25, stroke: '#ffc261', 'stroke-dasharray': '4 3' }),
    s('text', { x: x(-3.690), y: y(40.436) - 38, fill: '#ffc261', 'font-size': 10, 'text-anchor': 'middle' }, 'Lucía · aprox.'));
  return svg;
}

export const m6: Challenge = {
  id: 'm6',
  title: 'Ubicación compartida',
  difficulty: 'medio',
  story: [
    'Lucía publicó esta foto: «Primer día de curso 📚». Además tiene activada la ubicación aproximada en MapaAmigos (app inventada), que ese día a las 08:10 la mostraba así.',
    'Con la foto y el mapa, deduce en qué barrio está su instituto.',
  ],
  attachments: [{ label: 'Descargar primer-dia.jpg', url: foto, filename: 'primer-dia.jpg' }],
  render(el) {
    el.append(
      h('img', { src: foto, alt: 'Calle con edificios de varias alturas y una carretera', width: 640, height: 480, style: 'border-radius:10px' }),
      h('div', { class: 'card stack' },
        h('h3', {}, '🗺 MapaAmigos · lunes 15 sep · 08:10'),
        map(),
        h('p', { class: 'muted' }, 'Mapa esquemático: barrios simplificados como rectángulos.')),
      h('p', {}, h('a', { class: 'btn', href: '#kit' }, '🧰 Ir al Kit → Visor EXIF')));
  },
  hints: [
    'El círculo de la app cae entre dos barrios. La foto se hizo 6 minutos antes: mira su GPS en el Visor EXIF.',
    'Busca la latitud de la foto en el eje vertical y la longitud en el horizontal: ¿en qué rectángulo cae el punto?',
  ],
  answerHelp: 'El nombre del barrio (ej.: Retiro).',
  lesson: 'Por separado, una ubicación «aproximada» y una foto parecen inofensivas. Juntas revelan dónde estudias y a qué hora llegas: un patrón que alguien puede usar para encontrarte.',
  tip: 'Desactiva compartir ubicación en redes y apps de mapas, o compártela solo con 2-3 personas de confianza.',
};
