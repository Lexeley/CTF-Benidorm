import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import puzzles from '../../generated/puzzles.json';

export const e5: Challenge = {
  id: 'e5',
  title: 'Notas «secretas»',
  difficulty: 'medio',
  story: [
    'En «notas.txt» Laura guarda un mensaje que cree que está «encriptado». Lo «protegió» cuatro veces seguidas.',
    'Deshaz las capas en el Kit hasta leer el mensaje original.',
  ],
  render(el) {
    el.append(h('pre', { 'aria-label': 'Contenido de notas.txt' }, puzzles.e5Cipher),
      h('p', {}, 'Herramientas: ', h('a', { href: '#kit' }, 'kit > decodificador, césar')));
  },
  hints: [
    'El «=» del final delata Base64. Lo que sale son parejas de números y letras a-f: eso es hexadecimal. Usa «Usar el resultado como entrada» para encadenar.',
    'Tras Base64 y hex el texto sigue sin tener sentido, ni siquiera probando los 26 César… ¿y si está escrito al revés? Hay un botón «Invertir».',
  ],
  answerHelp: 'La frase final en minúsculas, con espacios.',
  lesson: 'Base64, hex e invertir son codificaciones, no cifrados: cualquiera las deshace sin clave. El César tiene solo 25 claves posibles. Para proteger algo de verdad hace falta cifrado moderno (AES) y una contraseña fuerte.',
  tip: 'Guarda tus secretos en un gestor de contraseñas o una nota cifrada con contraseña, nunca en un .txt.',
};
