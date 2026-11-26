import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { avatar, phone } from '../../ui/sim';

const post = (date: string, img: string, caption: string, likes: number, comments: [string, string][] = []) =>
  h('article', { class: 'ig-post' },
    h('div', { class: 'who' }, avatar('laura', 28), 'laura.vlogs'),
    h('div', { class: 'ig-img' }, img),
    h('div', { class: 'ig-actions' }, `♡  ◯  ➤      ${likes.toLocaleString('es-ES')} Me gusta`),
    h('p', { class: 'ig-cmt' }, h('b', {}, 'laura.vlogs'), caption),
    ...comments.map(([u, t]) => h('p', { class: 'ig-cmt' }, h('b', {}, u), t)),
    h('p', { class: 'muted', style: 'font-size:.7rem;text-transform:uppercase;margin:.2rem 0' }, date));

export const e2: Challenge = {
  id: 'e2',
  title: 'Su vida, en abierto',
  difficulty: 'medio',
  category: 'OSINT',
  story: [
    'El portátil se ha bloqueado. Debajo del campo de contraseña aparece la pista que Laura se dejó a sí misma:',
    'Pista: «mi mejor amiguito de cuando era pequeña + el año de mi primer partido»',
    'Su Instagram es público.',
  ],
  render(el) {
    el.append(phone('21:14', 'laura.vlogs',
      h('div', { class: 'ig-head' }, avatar('laura', 64),
        h('div', { class: 'ig-stats' }, h('span', {}, h('b', {}, '214'), 'publicaciones'), h('span', {}, h('b', {}, '1.204'), 'seguidores'), h('span', {}, h('b', {}, '388'), 'seguidos'))),
      h('p', { style: 'font:.85rem system-ui;margin:.6rem 0' }, h('b', {}, 'Laura'), h('br'), '17 · Madrid · Atleti ❤️🤍 · 1º Bach', h('br'), h('span', { class: 'muted' }, 'IES Río Claro')),
      post('22 de junio', '[foto: perrita marrón con un lazo rosa y una tarta para perros]', 'Feliz cumple a la reina de la casa, 3 añazos ya 🐾 #KiraLaPerra', 412,
        [['carla_gmz', 'que bonitaaaa 😍'], ['vega.mami', 'la consentís demasiado']]),
      post('3 de mayo', '[foto: Laura con una niña pequeña en las barcas del Retiro]', 'Domingo con la peque de la familia, Vega 💛', 289),
      post('9 de abril', '[foto antigua: un perro blanco y una niña de unos 4 años abrazados]', 'Hoy hace un año que te fuiste. No había nadie como tú, mi mejor amiguito 💔', 631,
        [['vega.mami', 'Toby siempre será de la familia ❤️'], ['abuela_mari_58', 'el gato Misi todavía lo busca por el pasillo']]),
      post('15 de marzo', '[foto: tarta con velas y amigas soplando]', 'Ayer fue mi cumple y todavía estoy de resaca de tarta. Gracias a todos!!', 540,
        [['carla_gmz', 'felices 17 reinaaa 🎉']]),
      post('8 de febrero', '[foto: la grada del Metropolitano llena]', 'Mi primer partido del Atleti fue en el Calderón el día que cumplí 6 años. Desde entonces no he faltado ❤️🤍', 198),
      post('20 de enero', '[foto: Kira dormida ocupando todo el sofá]', 'Esta no me deja sitio en el sofá', 87)));
  },
  hints: [
    'Su «mejor amiguito de cuando era pequeña» no es Kira (tiene 3 años). Para el año: ¿cuándo nació Laura si el 15 de marzo de 2026 dice que «ayer» fue su cumple y le felicitan por los 17?',
    'Nació el 14/03/2009, así que cumplió 6 años en 2015. La contraseña es el nombre de ese perro + el año, todo junto y en minúsculas.',
  ],
  answerHelp: 'La contraseña completa, sin espacios.',
  lesson: 'Ningún post revela la contraseña, pero juntos sí: mascota, cumpleaños y un recuerdo bastan. Así se adivinan contraseñas y preguntas de seguridad («¿nombre de tu primera mascota?»).',
  tip: 'Pon tus redes en privado y no uses nombres, fechas ni equipos en tus contraseñas ni en las preguntas de seguridad.',
};
