import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { toKit, win } from '../../ui/sim';
import puzzles from '../../generated/puzzles.json';

export const e5: Challenge = {
  id: 'e5',
  title: 'Notas «secretas»',
  difficulty: 'dificil',
  category: 'Crypto',
  story: [
    'En el escritorio de Laura hay un notas.txt con la lista de la compra… y un mensaje que cree que está a salvo. Se dejó apuntado cómo lo hizo, por si se le olvidaba.',
  ],
  render(el) {
    el.append(win('notas.txt - Bloc de notas', 'light', h('pre', {}, `lista compra: leche, pilas AA\nexamen bio el 14!!!\n\n// lo secreto, por si se me olvida cómo lo hice:\n// clave: el nombre de mi perra. vigenère -> le di la vuelta -> hex -> base64\n${puzzles.e5Cipher}`)),
      h('p', {}, toKit('decoder', puzzles.e5Cipher, 'copiar el bloque al decodificador del kit')),
      h('p', {}, 'Herramientas: ', h('a', { href: '#kit' }, 'kit > decodificador, vigenère')));
  },
  hints: [
    'Deshaz los pasos en orden inverso al que los hizo: base64, hex, invertir y por último Vigenère. ¿Cómo se llama su perra? Lo sabes si has mirado su Instagram (reto 2).',
    'La clave de Vigenère es «kira».',
  ],
  answerHelp: 'La frase final en minúsculas, con espacios.',
  lesson: 'Base64, hex e invertir son codificaciones: cualquiera las deshace sin clave. Vigenère tiene clave, pero si la clave es un dato público (tu perra) no protege nada. Para proteger algo de verdad hace falta cifrado moderno (AES) y una contraseña fuerte.',
  tip: 'Guarda tus secretos en un gestor de contraseñas o una nota cifrada con contraseña, nunca en un .txt.',
};
