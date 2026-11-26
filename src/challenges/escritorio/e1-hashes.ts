import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import puzzles from '../../generated/puzzles.json';

export const e1: Challenge = {
  id: 'e1',
  title: 'Contraseñas viejas',
  difficulty: 'facil',
  story: [
    'En el escritorio del portátil hay un archivo «contraseñas_viejas.txt». No guarda las contraseñas, sino sus hashes MD5: la «huella» de cada una.',
    'Un hash no se puede «deshacer», pero si la contraseña es débil basta con calcular el hash de muchas contraseñas comunes y comparar.',
    '¿Cuál es la contraseña del tercer hash?',
  ],
  render(el) {
    el.append(
      h('pre', { 'aria-label': 'Contenido de contraseñas_viejas.txt' },
        `# contraseñas_viejas.txt\n${puzzles.e1Hashes.map((x, i) => `${i + 1}: ${x}`).join('\n')}`),
      h('p', {}, h('a', { class: 'btn', href: '#kit' }, '🧰 Ir al Kit → Buscador de hash')));
  },
  hints: [
    'Copia el tercer hash y pégalo en el Kit, herramienta «Buscador de hash (wordlist)».',
    'Los 32 caracteres hex son un MD5. El primero es la contraseña más usada del mundo; el tercero es un deporte seguido de un año.',
  ],
  answerHelp: 'La contraseña en texto, tal cual (sin comillas).',
  lesson: 'Las contraseñas cortas o comunes se encuentran en segundos comparando hashes con listas de contraseñas filtradas. Que esté «cifrada» no la salva si es débil.',
  tip: 'Usa un gestor de contraseñas y una frase larga y única para cada cuenta importante.',
};
