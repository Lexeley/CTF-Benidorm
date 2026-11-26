import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

const card = (k: string, icon: string, name: string, dev: string, stats: string, reviews: string[], perms: string, origin: string) =>
  h('div', { class: 'card stack' },
    h('h3', {}, `${k}. ${icon} ${name}`),
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
    'Lucía quiere el «Juego X» (inventado) sin pagar. Encuentra estas 4 fichas. Una es una trampa con malware.',
    '¿Cómo se llama el desarrollador de la ficha falsa?',
  ],
  render(el) {
    el.append(h('div', { class: 'grid' },
      card('A', '🧩', 'Brain Puzzle Plus', 'Estudio Nube Azul', '5 M descargas · 4,5★ (82.000 reseñas)',
        ['★★★★★ Me encanta, aunque tiene anuncios.', '★★★☆☆ Los últimos niveles son muy difíciles.', '★★★★☆ Entretenido para el bus.'],
        'Internet', 'Tienda oficial del móvil'),
      card('B', '🎮', 'Juego X GRATIS APK – Versión completa desbloqueada', 'FreeGamesAPK_Oficial', '500+ descargas · 5,0★ (6 reseñas)',
        ['★★★★★ muy bueno funciona 100%', '★★★★★ muy bueno funciona 100%!!', '★★★★★ Muy bueno funciona 100 %', '★★★★★ excelente app recomendado'],
        'SMS, Contactos, Accesibilidad (control total), Administrador del dispositivo, Instalar otras apps', 'Descarga directa (.apk) desde una web'),
      card('C', '🎮', 'Juego X', 'Estudio X Games', '50 M descargas · 4,2★ (1,3 M reseñas)',
        ['★★★★☆ Muy buen juego, la última actualización va algo lenta.', '★★☆☆☆ Demasiadas compras dentro del juego.', '★★★★★ Los gráficos son increíbles.'],
        'Internet, Vibración', 'Tienda oficial del móvil'),
      card('D', '🗒', 'Horario Escolar', 'Apps Pupitre S.L.', '1 M descargas · 4,6★ (21.000 reseñas)',
        ['★★★★★ Por fin aclaro mi horario.', '★★★★☆ Echo de menos un modo oscuro.'],
        'Notificaciones, Calendario', 'Tienda oficial del móvil')));
  },
  hints: [
    'Compara la ficha oficial con la que promete lo mismo «gratis»: descargas, reseñas, permisos y de dónde se instala.',
    'Reseñas casi idénticas, pocas descargas, permisos de accesibilidad/administrador y un .apk fuera de la tienda: todo apunta a la misma ficha.',
  ],
  answerHelp: 'El nombre del desarrollador tal cual aparece.',
  lesson: 'Las apps «pirata» fuera de la tienda oficial son la vía nº 1 de malware en Android. Señales: nombre exagerado, pocas descargas con nota perfecta, reseñas copiadas y permisos de control total.',
  tip: 'Deja desactivado «Instalar apps de origen desconocido» y descarga solo de la tienda oficial.',
};
