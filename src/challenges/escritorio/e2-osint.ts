import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

const post = (date: string, img: string, text: string, extra = '') =>
  h('div', { class: 'post' },
    h('div', { class: 'imgph' }, `[foto: ${img}]`),
    h('p', {}, text),
    extra && h('p', { class: 'muted' }, extra),
    h('p', { class: 'muted mono' }, date));

export const e2: Challenge = {
  id: 'e2',
  title: 'Su vida, en abierto',
  difficulty: 'medio',
  story: [
    'El portátil se ha bloqueado. La pantalla de inicio muestra la pista que Laura se dejó a sí misma:',
    'Pista de contraseña: «mi primer peludo + el año de mi primer partido»',
    'Su Instagram es público.',
  ],
  render(el) {
    el.append(h('div', { class: 'phone', role: 'region', 'aria-label': 'Perfil de Instagram simulado' },
      h('p', {}, h('strong', {}, '@laura.vlogs'), ' · Instagram'),
      h('p', { class: 'muted' }, '17 · Madrid · Atleti · perfil público · 1.204 seguidores'),
      post('22 jun 2026', 'perrita marrón con un lazo', 'Feliz cumple a la reina de la casa, 3 añazos ya 🐾 #KiraLaPerra'),
      post('3 may 2026', 'Laura con una niña pequeña en el Retiro', 'Domingo con la peque de la familia, Vega 💛'),
      post('9 abr 2026', 'foto antigua de un perro blanco con Laura de pequeña', 'Hoy hace un año que te fuiste. Fuiste el primero y el mejor 💔', 'Comentario de @vega.mami: «el gato de la abuela siempre le tuvo celos a Toby jaja»'),
      post('15 mar 2026', 'tarta con velas', 'Ayer fue mi cumple y todavía estoy de resaca de tarta. Gracias a todos!!'),
      post('8 feb 2026', 'grada del Metropolitano', 'Mi primer partido del Atleti fue en el Calderón el día que cumplí 6 años. Desde entonces no he faltado ❤️🤍'),
      post('20 ene 2026', 'Kira dormida en el sofá', 'Mi bichito no me deja sitio en el sofá')));
  },
  hints: [
    '«Primer peludo» es su primera mascota, no la actual. Para el año: ¿en qué año nació Laura si el 15 de marzo de 2026 dice que «ayer» fue su cumple y tiene 17?',
    'Nació el 14/03/2009, así que cumplió 6 años en 2015. La contraseña es el nombre de su primer perro + ese año, todo junto y en minúsculas.',
  ],
  answerHelp: 'La contraseña completa, sin espacios.',
  lesson: 'Ningún post revela la contraseña, pero juntos sí: mascota, cumpleaños y un recuerdo bastan. Así se adivinan contraseñas y preguntas de seguridad («¿nombre de tu primera mascota?»).',
  tip: 'Pon tus redes en privado y no uses nombres, fechas ni equipos en tus contraseñas ni en las preguntas de seguridad.',
};
