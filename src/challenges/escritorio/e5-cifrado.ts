import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import puzzles from '../../generated/puzzles.json';

export const e5: Challenge = {
  id: 'e5',
  title: 'Notas «secretas»',
  difficulty: 'dificil',
  story: [
    'En «notas.txt» Laura guarda un mensaje que cree que está a salvo. Encima del texto se dejó apuntado cómo lo hizo, por si se le olvidaba.',
  ],
  render(el) {
    el.append(h('pre', { 'aria-label': 'Contenido de notas.txt' }, `// vigenère con mi bichito, luego lo di la vuelta y lo pasé a hex y base64\n${puzzles.e5Cipher}`),
      h('p', {}, 'Herramientas: ', h('a', { href: '#kit' }, 'kit > decodificador, vigenère')));
  },
  hints: [
    'Deshaz los pasos en orden inverso al que los hizo: base64, hex, invertir y por último Vigenère. ¿Quién es «mi bichito»? Lo sabes si has hecho el reto del Instagram.',
    'La clave de Vigenère es «kira».',
  ],
  answerHelp: 'La frase final en minúsculas, con espacios.',
  lesson: 'Base64, hex e invertir son codificaciones: cualquiera las deshace sin clave. Vigenère tiene clave, pero si la clave es un dato público (tu perra) no protege nada. Para proteger algo de verdad hace falta cifrado moderno (AES) y una contraseña fuerte.',
  tip: 'Guarda tus secretos en un gestor de contraseñas o una nota cifrada con contraseña, nunca en un .txt.',
};
