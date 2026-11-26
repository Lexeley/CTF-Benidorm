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
    'Pista de contraseña: «mi bichito + mi cumple (ddmm)»',
    'Su Instagram es público. Investígalo y deduce la contraseña.',
  ],
  render(el) {
    el.append(h('div', { class: 'phone', role: 'region', 'aria-label': 'Perfil de Instagram simulado' },
      h('p', {}, h('strong', {}, '@laura.vlogs'), ' · Instagram'),
      h('p', { class: 'muted' }, '17 · Madrid · Atleti hasta la muerte · perfil público · 1.204 seguidores'),
      post('22 jun 2026', 'perrita marrón con un lazo', 'Feliz cumple a la reina de la casa, 3 añazos ya 🐾 #KiraLaPerra'),
      post('3 may 2026', 'Laura con una niña pequeña en el Retiro', 'Domingo con la peque de la familia, Vega 💛'),
      post('15 mar 2026', 'tarta con velas 1 y 7', 'Ayer fue mi cumple y todavía estoy de resaca de tarta. Gracias a todos!!'),
      post('8 feb 2026', 'grada del Metropolitano', 'Partidazo. Desde los 6 años en la grada ❤️🤍'),
      post('20 ene 2026', 'Kira dormida en el sofá', 'Mi bichito no me deja sitio en el sofá', 'Comentario de @vega.mami: «esa perra manda más que tú»')));
  },
  hints: [
    '«Bichito» no es su hermana: busca el post que usa esa palabra y quién aparece en la foto.',
    'El post del cumpleaños dice «ayer». Mira la fecha del post y resta un día.',
  ],
  answerHelp: 'La contraseña completa, sin espacios.',
  lesson: 'Con datos públicos (mascota, cumpleaños, familia, equipo) se adivinan contraseñas y preguntas de seguridad. Lo que publicas también es una pista.',
  tip: 'Pon tus redes en privado y no uses nombres, fechas ni equipos en tus contraseñas.',
};
