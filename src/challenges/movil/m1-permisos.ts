import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { avatar, phone } from '../../ui/sim';

const COLS = ['SMS', 'Contactos', 'Ubicación', 'Accesibilidad', 'Sobre otras apps', 'Acceso a notificaciones'];
// [app, origen, descripción, permisos (1 = concedido)]
const apps: [string, string, string, number[]][] = [
  ['WhatsApp', 'Google Play', 'Mensajería', [1, 1, 1, 0, 0, 0]],
  ['Bitwarden', 'Google Play', 'Gestor de contraseñas con autorrelleno', [0, 0, 0, 1, 1, 0]],
  ['Instagram', 'Google Play', 'Red social', [0, 1, 1, 0, 0, 0]],
  ['PDF Reader Pro', 'Google Play', 'Lector de PDF', [1, 0, 0, 1, 1, 1]],
  ['Mi Banda Fit', 'Google Play', 'App de la pulsera deportiva: muestra en la pulsera tus avisos', [0, 1, 1, 0, 0, 1]],
  ['TalkBack', 'Preinstalada', 'Lector de pantalla para personas ciegas', [0, 0, 0, 1, 0, 1]],
  ['Linterna LED', 'Google Play', 'Linterna', [0, 0, 0, 0, 0, 0]],
];

export const m1: Challenge = {
  id: 'm1',
  title: 'Permisos sospechosos',
  difficulty: 'medio',
  category: 'Android',
  story: [
    'Estos son los permisos sensibles que Laura ha concedido. Varias apps tienen permisos peligrosos y aun así son legítimas.',
    'Una es un troyano bancario que ha superado los filtros de la tienda. ¿Cuál?',
  ],
  render(el) {
    el.append(phone('17:03', 'Ajustes > Aplicaciones', ...apps.map(([name, origin, desc, perms]) =>
      h('details', { style: 'border-bottom:1px solid #222;padding:.35rem 0' },
        h('summary', {}, h('span', { style: 'display:inline-flex;gap:.6rem;align-items:center;vertical-align:middle' }, avatar(name, 34),
          h('span', {}, h('b', {}, name), h('br'), h('span', { class: 'muted', style: 'font-size:.78rem' }, `${desc} · ${origin}`)))),
        ...COLS.map((c, i) => h('div', { class: 'set-item' }, h('span', {}, c), perms[i] ? h('span', { class: 'on' }, 'Permitido') : h('span', { class: 'off' }, 'No permitido')))))));
    el.append(h('p', { class: 'muted' }, 'Toca cada app para ver sus permisos.'));
  },
  hints: [
    'Para cada permiso peligroso, pregúntate si la función de la app lo justifica. Un gestor de contraseñas necesita ver la pantalla para rellenar formularios; una pulsera necesita leer tus notificaciones.',
    'Accesibilidad + mostrar sobre otras apps + leer notificaciones + SMS es el kit completo para robar códigos y poner pantallas falsas encima del banco. ¿Qué app no tiene ninguna razón para pedir nada de eso?',
  ],
  answerHelp: 'El nombre de la app tal cual aparece.',
  lesson: 'El mismo permiso puede ser legítimo o peligroso según la app. Los troyanos bancarios se cuelan en las tiendas como apps simples (lectores de PDF, limpiadores, calculadoras) y, tras instalarse, piden Accesibilidad, superposición, notificaciones y SMS.',
  tip: 'Revisa hoy Ajustes > Accesibilidad y Ajustes > Notificaciones > Acceso a notificaciones: solo deberían estar las apps que de verdad lo necesitan.',
};
