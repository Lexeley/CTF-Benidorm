import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

const post = (date: string, emoji: string, text: string, likes: number) =>
  h('div', { class: 'post' },
    h('div', { style: 'font-size:3rem;text-align:center;background:#1b2633;border-radius:10px;padding:1rem', 'aria-hidden': 'true' }, emoji),
    h('p', {}, text),
    h('p', { class: 'muted mono' }, `${date} · ❤ ${likes}`));

export const e2: Challenge = {
  id: 'e2',
  title: 'Su vida, en abierto',
  difficulty: 'medio',
  story: [
    'El portátil se bloqueó. En la pantalla de inicio aparece la pista que Lucía se dejó a sí misma:',
    '🔒 Pista de contraseña: «la peque de la casa + mi cumple (ddmm)»',
    'Su perfil en FotoRed (red social inventada) es público. Investígalo y deduce la contraseña.',
  ],
  render(el) {
    el.append(h('div', { class: 'phone', role: 'region', 'aria-label': 'Perfil simulado de FotoRed' },
      h('div', { class: 'row', style: 'flex-wrap:nowrap' },
        h('div', { class: 'avatar', 'aria-hidden': 'true' }, 'L'),
        h('div', {}, h('strong', {}, '@lucia.vlogs'), h('br'), h('span', { class: 'muted' }, '17 🎂 · Madrid · IES Río Claro · 💙 CD Lavanda'))),
      h('p', { class: 'muted' }, '🌍 Perfil público · 1.204 seguidores'),
      post('2 jun 2026', '🐶🎉', 'La peque de la casa cumple 3 añitos!! Kira eres la mejor perrita del mundo 🐾 #KiraLaPerra', 312),
      post('14 mar 2026', '🎂🎈', '¡Hoy cumplo 17! Gracias a todos por las felicitaciones, os quiero ❤️', 540),
      post('8 feb 2026', '⚽💙', 'Partidazo del CD Lavanda hoy. Desde los 6 años en la grada 💙 #VamosLavanda', 198),
      post('20 ene 2026', '😩🔑', 'Odio cambiar la contraseña del portátil… al final siempre pongo algo que no se me olvide jajaja', 87)));
  },
  hints: [
    '«La peque de la casa» no es una persona: busca el post donde aparece esa frase.',
    'Es el nombre de la mascota seguido del día y el mes del cumpleaños de Lucía (no del de la mascota), con 4 cifras.',
  ],
  answerHelp: 'La contraseña completa, sin espacios (ej.: nombre0101).',
  lesson: 'Con datos públicos (mascota, cumpleaños, equipo) un atacante adivina contraseñas y preguntas de seguridad. Lo que publicas también es una pista.',
  tip: 'Pon tus redes en privado y no uses nombres, fechas ni equipos en tus contraseñas.',
};
