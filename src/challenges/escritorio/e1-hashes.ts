import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import puzzles from '../../generated/puzzles.json';

export const e1: Challenge = {
  id: 'e1',
  title: 'Contraseñas viejas',
  difficulty: 'facil',
  story: [
    'En el portátil de Laura hay un archivo claves.bak que exportó de un gestor de contraseñas antiguo con las cuentas de la familia.',
    '¿Cuál es la contraseña de Laura?',
  ],
  render(el) {
    el.append(
      h('pre', { 'aria-label': 'Contenido de claves.bak' }, `$ cat claves.bak\n${puzzles.e1Shadow}`),
      h('p', {}, 'Herramientas: ', h('a', { href: '#kit' }, 'kit > buscador de hash')));
  },
  hints: [
    'Lee la cabecera del archivo: cada línea tiene usuario, sal y hash. Si buscas el hash a secas no lo vas a encontrar.',
    'Copia el hash de Laura y pon su sal en el campo «Sal» del buscador. La sal se pone delante de la contraseña antes de calcular el hash.',
  ],
  answerHelp: 'La contraseña en texto, tal cual.',
  lesson: 'La sal impide usar tablas precalculadas y hace que dos contraseñas iguales tengan hashes distintos, pero no salva una contraseña débil: basta con añadir la sal a cada palabra de la wordlist. La frase larga de su madre sigue sin aparecer.',
  tip: 'Usa un gestor de contraseñas y frases largas y únicas para cada cuenta.',
};
