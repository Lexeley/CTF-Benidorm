import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import puzzles from '../../generated/puzzles.json';

export const e1: Challenge = {
  id: 'e1',
  title: 'Contraseñas viejas',
  difficulty: 'facil',
  story: [
    'En el escritorio de Laura hay un archivo hashes.txt que exportó de un gestor antiguo. Son hashes de las contraseñas de la familia, sin indicar el algoritmo.',
    'Dos de ellos son SHA-256: uno es de su madre y otro de Laura. Su madre usa frases largas. ¿Cuál es la contraseña de Laura?',
  ],
  render(el) {
    el.append(
      h('pre', { 'aria-label': 'Contenido de hashes.txt' }, `$ cat hashes.txt\n${puzzles.e1Hashes.join('\n')}`),
      h('p', {}, 'Herramientas: ', h('a', { href: '#kit' }, 'kit > buscador de hash')));
  },
  hints: [
    'El algoritmo se deduce por la longitud: 32 caracteres hex = MD5, 40 = SHA-1, 64 = SHA-256.',
    'Prueba los dos hashes de 64 caracteres en el buscador. Uno no aparecerá en la wordlist: esa es la frase larga de su madre.',
  ],
  answerHelp: 'La contraseña en texto, tal cual.',
  lesson: 'Da igual el algoritmo (MD5, SHA-1 o SHA-256): si la contraseña es común, aparece en una wordlist. La frase larga de su madre no la encuentra nadie con este método.',
  tip: 'Usa un gestor de contraseñas y frases largas y únicas para cada cuenta.',
};
