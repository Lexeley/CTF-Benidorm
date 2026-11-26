import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

const apps: [string, string, string[]][] = [
  ['WhatsApp', 'Comunicación', ['Contactos', 'Cámara', 'Micrófono', 'Notificaciones', 'Leer SMS (verificar tu número)']],
  ['Linterna LED', 'Herramientas', ['Cámara (para el flash)']],
  ['Instagram', 'Red social', ['Cámara', 'Micrófono', 'Fotos y vídeos', 'Notificaciones', 'Ubicación (opcional, para etiquetar)']],
  ['Calculadora Pro+', 'Herramientas', ['Notificaciones', 'Mostrar sobre otras apps', 'Servicio de accesibilidad', 'Leer y enviar SMS', 'Ejecutarse al encender el móvil']],
  ['EMT Madrid', 'Transporte', ['Ubicación precisa (mientras se usa)', 'Notificaciones']],
  ['Google Keep', 'Productividad', ['Notificaciones (recordatorios)', 'Micrófono (notas de voz)']],
  ['Spotify', 'Música', ['Notificaciones', 'Dispositivos cercanos (altavoces)', 'Micrófono (búsqueda por voz)']],
];

export const m1: Challenge = {
  id: 'm1',
  title: 'Permisos sospechosos',
  difficulty: 'facil',
  story: [
    'Laura tiene estas 7 apps. Las de marcas conocidas piden permisos parecidos a los reales; una de las apps es un troyano bancario.',
    '¿Cuál es?',
  ],
  render(el) {
    el.append(h('div', { class: 'table-wrap' }, h('table', {},
      h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'App'), h('th', { scope: 'col' }, 'Categoría'), h('th', { scope: 'col' }, 'Permisos'))),
      h('tbody', {}, ...apps.map(([name, cat, perms]) => h('tr', {},
        h('td', {}, name), h('td', {}, cat), h('td', { style: 'white-space:normal' }, perms.join(', '))))))));
  },
  hints: [
    'Pregúntate para cada app: ¿necesita ESTO para hacer su trabajo? Leer un SMS para verificar el número es normal en mensajería.',
    'Accesibilidad + mostrar sobre otras apps permite ver y tocar la pantalla por ti (por ejemplo, la app del banco). Con SMS, además, lee los códigos de verificación.',
  ],
  answerHelp: 'El nombre de la app tal cual aparece.',
  lesson: 'Los troyanos bancarios de Android se disfrazan de apps simples y piden Accesibilidad, mostrarse sobre otras apps y SMS: así leen la pantalla, ponen pantallas falsas encima del banco y roban los códigos.',
  tip: 'Revisa hoy Ajustes > Accesibilidad y Ajustes > Privacidad > Permisos y quítaselos a las apps que no los necesitan.',
};
