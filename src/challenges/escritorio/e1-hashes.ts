import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { toKit, win } from '../../ui/sim';
import puzzles from '../../generated/puzzles.json';

const rows = puzzles.e1Shadow.split('\n').map((l) => l.split(','));

export const e1: Challenge = {
  id: 'e1',
  title: 'Contraseñas viejas',
  difficulty: 'facil',
  category: 'Crypto',
  story: [
    'En la carpeta Descargas del portátil hay un archivo export_claves.csv. Es la copia de seguridad que Laura exportó de «ClaveSegura», una app de contraseñas de la familia que dejaron de usar. Un CSV es una tabla en texto: cada línea es una fila y las columnas van separadas por comas (se abre con Excel o con el Bloc de notas).',
    'La app no guardaba las contraseñas, solo su hash con sal. ¿Cuál es la contraseña del portátil de Laura?',
  ],
  render(el) {
    el.append(
      win('export_claves.csv - Bloc de notas', 'light', h('pre', {}, puzzles.e1Shadow)),
      h('p', { class: 'muted' }, 'Así se ve abierto como tabla:'),
      h('div', { class: 'table-wrap' }, h('table', {},
        h('thead', {}, h('tr', {}, ...rows[0].map((c) => h('th', { scope: 'col' }, c)), h('th', {}, ''))),
        h('tbody', {}, ...rows.slice(1).map((r) => h('tr', {}, ...r.map((c) => h('td', { style: 'white-space:normal;word-break:break-all' }, c)),
          h('td', {}, toKit('crack', r[3], 'al buscador'))))))));
  },
  hints: [
    'Mira el nombre de la última columna: el hash se calculó sobre «sal + contraseña». Si buscas el hash a secas no lo vas a encontrar.',
    'En el buscador de hash pon el hash de Laura y escribe su sal (columna «sal») en el campo «Sal».',
  ],
  answerHelp: 'La contraseña en texto, tal cual.',
  lesson: 'La sal impide usar tablas precalculadas y hace que dos contraseñas iguales tengan hashes distintos, pero no salva una contraseña débil: basta con añadir la sal a cada palabra de la wordlist. La frase larga de su madre sigue sin aparecer.',
  tip: 'Usa un gestor de contraseñas y frases largas y únicas para cada cuenta.',
};
