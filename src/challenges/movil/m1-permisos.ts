import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

const apps: [string, string, string, string[]][] = [
  ['🔦', 'Linterna Turbo', 'Herramientas · 4,1★', ['Cámara (para el flash)', 'Leer y enviar SMS', 'Leer contactos', 'Ubicación precisa', 'Ejecutarse al encender el móvil']],
  ['🚌', 'RutaBus', 'Transporte · 4,5★', ['Ubicación precisa (mientras se usa)', 'Notificaciones']],
  ['📸', 'FotoRed', 'Red social · 4,3★', ['Cámara', 'Micrófono', 'Fotos y vídeos', 'Notificaciones', 'Contactos (opcional, para buscar amigos)']],
  ['📝', 'Notas Rápidas', 'Productividad · 4,7★', ['Notificaciones (recordatorios)']],
  ['💬', 'ChatAmigos', 'Comunicación · 4,4★', ['Contactos', 'Cámara', 'Micrófono', 'Notificaciones', 'Leer SMS (solo para verificar tu número)']],
];

export const m1: Challenge = {
  id: 'm1',
  title: 'Permisos sospechosos',
  difficulty: 'facil',
  story: [
    'Lucía tiene estas 5 apps (inventadas). Cada una pide sus permisos.',
    'Una de ellas pide cosas que no necesita para nada: es la que roba datos. ¿Cuál?',
  ],
  render(el) {
    el.append(h('div', { class: 'grid' }, ...apps.map(([icon, name, cat, perms]) =>
      h('div', { class: 'card' },
        h('h3', {}, `${icon} ${name}`), h('p', { class: 'muted' }, cat),
        h('ul', {}, ...perms.map((p) => h('li', {}, p)))))));
  },
  hints: [
    'Pregúntate para cada app: ¿para qué necesita ESTO para hacer su trabajo?',
    'Algunas apps de mensajería leen un SMS para verificar tu número. Pero, ¿para qué quiere tus SMS y contactos algo que solo enciende una luz?',
  ],
  answerHelp: 'El nombre de la app (ej.: Notas Rápidas).',
  lesson: 'Los permisos deben encajar con la función de la app. Una linterna que lee SMS puede robar códigos de verificación del banco y suscribirte a servicios de pago.',
  tip: 'Revisa hoy Ajustes → Privacidad → Gestor de permisos y quita SMS, contactos y ubicación a las apps que no los necesitan.',
};
