import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

const card = (k: string, name: string, dev: string, stats: string, reviews: string[], perms: string, origin: string) =>
  h('div', { class: 'card stack' },
    h('h3', {}, `[${k}] ${name}`),
    h('dl', { class: 'kv' },
      h('dt', {}, 'Desarrollador'), h('dd', {}, dev),
      h('dt', {}, 'Datos'), h('dd', {}, stats),
      h('dt', {}, 'Permisos'), h('dd', {}, perms),
      h('dt', {}, 'Origen'), h('dd', {}, origin)),
    h('details', {}, h('summary', {}, 'Reseñas'), h('ul', {}, ...reviews.map((r) => h('li', {}, r)))));

export const m2: Challenge = {
  id: 'm2',
  title: 'La app pirata',
  difficulty: 'medio',
  story: [
    'Laura quiere gemas gratis en Brawl Stars. Un amigo le pasa un enlace a una «tienda alternativa». Compara estas 4 fichas (simuladas): una es malware.',
    '¿Cómo se llama el desarrollador de la ficha maliciosa?',
  ],
  render(el) {
    el.append(h('div', { class: 'grid' },
      card('A', 'Brawl Stars', 'Supercell', '100 M+ descargas · 4,2 (24 M reseñas)',
        ['3/5 Demasiadas compras dentro del juego.', '5/5 Lo juego todos los días con mis amigos.', '2/5 La última actualización me va lenta.'],
        'Internet, Vibración, Notificaciones', 'Google Play'),
      card('B', 'Brawl Stars Gems Generator 2026', 'Supercell Games Studio', '100 K+ descargas · 4,8 (3.100 reseñas)',
        ['5/5 funciona 100% me dio 5000 gemas', '5/5 FUNCIONA 100% gracias!!', '5/5 funciona 100 % recomendado', '1/5 me pide verificar con mi número y no da nada'],
        'SMS, Contactos, Servicio de accesibilidad, Administrador del dispositivo, Instalar apps desconocidas', 'Tienda alternativa (archivo .apk)'),
      card('C', 'Candy Crush Saga', 'King', '1.000 M+ descargas · 4,6 (36 M reseñas)',
        ['4/5 Adictivo, pero los niveles difíciles piden pagar.', '5/5 Clásico.'],
        'Internet, Vibración', 'Google Play'),
      card('D', 'Brawl Stars Tips & Guía', 'GamerGuides ES', '500 K+ descargas · 4,1 (8.000 reseñas)',
        ['4/5 Buenas guías de brawlers, muchos anuncios.', '2/5 Algunas guías están desactualizadas.'],
        'Internet', 'Google Play')));
  },
  hints: [
    'Que el nombre del desarrollador se parezca al oficial no lo hace oficial. Compara también permisos y de dónde se instala.',
    'Ningún juego necesita Accesibilidad ni ser Administrador del dispositivo. Y las reseñas repetidas son compradas.',
  ],
  answerHelp: 'El nombre del desarrollador tal cual aparece.',
  lesson: 'Los «generadores de gemas» y apps MOD fuera de la tienda oficial son de los cebos de malware más comunes entre adolescentes. Señales: desarrollador que imita al real, nota casi perfecta con reseñas copiadas y permisos de control total.',
  tip: 'Deja desactivado «Instalar apps desconocidas» y descarga solo de la tienda oficial.',
};
