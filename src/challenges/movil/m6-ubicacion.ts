import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import foto from '../../generated/foto-movil.jpg?url';

// Barrios ESQUEMÁTICOS (rectángulos aproximados, no son límites oficiales): [nombre, latMin, latMax, lonMin, lonMax]
const ZONES: [string, number, number, number, number][] = [
  ['Moncloa', 40.425, 40.445, -3.730, -3.712], ['Chamberí', 40.428, 40.445, -3.712, -3.690],
  ['Salamanca', 40.420, 40.445, -3.690, -3.665], ['Centro', 40.405, 40.428, -3.718, -3.690],
  ['Retiro', 40.400, 40.420, -3.690, -3.665], ['Arganzuela', 40.390, 40.405, -3.718, -3.690],
];
// [etiqueta, lat, lon, color]: capturas del Snap Map (ver tabla del reto)
const SNAPS: [string, number, number, string][] = [
  ['1', 40.4370, -3.6935, '#ffcc00'], ['2', 40.4130, -3.6800, '#ff5c5c'], ['3', 40.4310, -3.7030, '#39ff6a'],
  ['4', 40.4225, -3.6760, '#ff9de2'], ['5', 40.4400, -3.7080, '#6cc4ff'],
];
const [LAT0, LAT1, LON0, LON1] = [40.388, 40.447, -3.732, -3.663];
const W = 520, H = 440;
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
    'aria-label': 'Mapa esquemático de barrios con cuadrícula de coordenadas y cinco círculos numerados de ubicación aproximada de Laura' }) as SVGSVGElement;
  svg.append(s('rect', { width: W, height: H, fill: '#0d1620' }));
  const fills = ['#22384f', '#2b4a36', '#4a3a24', '#3d2b45', '#24443f', '#47302e'];
  ZONES.forEach(([n, a, b, c, d], i) => {
    svg.append(s('rect', { x: x(c), y: y(b), width: x(d) - x(c), height: y(a) - y(b), fill: fills[i], stroke: '#a9b7c6', 'stroke-width': 1 }),
      s('text', { x: x(c) + 3, y: y(a) - 5, fill: '#eef3f8', 'font-size': 13, 'font-family': 'monospace' }, n));
  });
  for (let lat = 40.39; lat <= 40.445; lat += 0.01) {
    svg.append(s('line', { x1: 40, x2: W - 10, y1: y(lat), y2: y(lat), stroke: '#ffffff', 'stroke-opacity': 0.15 }),
      s('text', { x: 0, y: y(lat) + 4, fill: '#a9b7c6', 'font-size': 11, 'font-family': 'monospace' }, lat.toFixed(2)));
  }
  for (let lon = -3.73; lon <= -3.665; lon += 0.01) {
    svg.append(s('line', { y1: 10, y2: H - 30, x1: x(lon), x2: x(lon), stroke: '#ffffff', 'stroke-opacity': 0.15 }),
      s('text', { x: x(lon), y: H - 18, fill: '#a9b7c6', 'font-size': 11, 'text-anchor': 'middle', 'font-family': 'monospace' }, lon.toFixed(2)));
  }
  svg.append(s('text', { x: W / 2, y: H - 4, fill: '#a9b7c6', 'font-size': 9, 'text-anchor': 'middle' }, 'longitud →   (latitud a la izquierda)'));
  // Ubicaciones aproximadas (radio ~800 m) de varias capturas del Snap Map
  const R = 800, dLat = R / 111000, dLon = R / 84600;
  const sx = (W - 50) / (LON1 - LON0), sy = (H - 40) / (LAT1 - LAT0);
  SNAPS.forEach(([label, lat, lon, color]) => {
    svg.append(s('ellipse', { cx: x(lon), cy: y(lat), rx: dLon * sx, ry: dLat * sy, fill: color, 'fill-opacity': 0.12, stroke: color, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }),
      s('text', { x: x(lon), y: y(lat) + 3, fill: color, 'font-size': 16, 'text-anchor': 'middle', 'font-family': 'monospace', 'font-weight': 'bold' }, label));
  });
  return svg;
}

export const m6: Challenge = {
  id: 'm6',
  title: 'Ubicación compartida',
  difficulty: 'dificil',
  story: [
    'Laura subió esta foto a sus historias. Además comparte su ubicación aproximada en el Snap Map: un amigo ha ido guardando capturas en distintos momentos (simuladas). Cada círculo dice «está por aquí, a menos de 800 m».',
    '¿En qué barrio está su instituto?',
  ],
  attachments: [{ label: 'Descargar primer-dia.jpg', url: foto, filename: 'primer-dia.jpg' }],
  render(el) {
    el.append(
      h('img', { src: foto, alt: 'Calle con edificios de varias alturas y una carretera', width: 640, height: 480, style: 'border-radius:10px' }),
      h('div', { class: 'card stack' },
        h('h3', {}, 'Capturas del Snap Map'),
        h('div', { class: 'table-wrap' }, h('table', {},
          h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Círculo'), h('th', { scope: 'col' }, 'Cuándo'))),
          h('tbody', {}, ...[['1', 'martes 16 sep, 08:12'], ['2', 'sábado 20 sep, 12:30'], ['3', 'jueves 18 sep, 08:20'], ['4', 'martes 16 sep, 19:40'], ['5', 'viernes 19 sep, 11:15']]
            .map(([n, t]) => h('tr', {}, h('td', {}, n), h('td', {}, t)))))),
        map(),
        h('p', { class: 'muted' }, 'Mapa esquemático: barrios simplificados como rectángulos.')),
      h('p', {}, 'Herramientas: ', h('a', { href: '#kit' }, 'kit > visor EXIF')));
  },
  hints: [
    'Esta foto no tiene GPS, pero sus metadatos dicen cuándo y dónde se hizo. Eso te dice a qué horas está Laura en el instituto: no todos los círculos sirven.',
    'Quédate solo con los círculos de días de clase en horario de clase (1, 3 y 5). Cada uno cubre varios barrios, pero solo hay una zona donde se cruzan los tres.',
  ],
  answerHelp: 'El nombre del barrio (ej.: Retiro).',
  lesson: 'Una ubicación «aproximada» parece inofensiva, pero varias capturas a la misma hora se cruzan y dan un punto preciso (triangulación). Junto con una foto, revelan dónde estudias y tu horario: un patrón que alguien puede usar para encontrarte.',
  tip: 'Desactiva compartir ubicación en redes y apps de mapas, o compártela solo con 2-3 personas de confianza.',
};
