import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

const nets: [string, string, string, string, string][] = [
  ['IES_Rio_Claro_Alumnos', 'WPA2-Enterprise', '▂▄▆_ (-62 dBm)', '3C:84:6A:11:20:01', 'No'],
  ['IES_Rio_Claro_Alumnos', 'Abierta', '▂▄▆█ (-38 dBm)', 'DE:AD:4B:9F:00:13', 'Sí'],
  ['IES_Rio_Claro_Profes', 'WPA2-Enterprise', '▂▄__ (-74 dBm)', '3C:84:6A:11:20:02', 'No'],
  ['Cafeteria_Libre', 'Abierta', '▂___ (-81 dBm)', '7A:10:EE:32:9B:40', 'Sí'],
  ['Router_5G_8A21', 'WPA3-Personal', '▂▄__ (-70 dBm)', 'F4:6B:8C:21:8A:21', 'No'],
];

export const m4: Challenge = {
  id: 'm4',
  title: 'La wifi gemela',
  difficulty: 'medio',
  story: [
    'En el recreo, el móvil de Lucía ve estas redes. En el tablón del instituto pone: «La wifi del alumnado es IES_Rio_Claro_Alumnos (WPA2-Enterprise). NUNCA pide la contraseña en una página web».',
    'Alguien ha montado una red trampa (un «gemelo malvado»). ¿Cuál es su BSSID?',
  ],
  render(el) {
    el.append(
      h('div', { class: 'table-wrap' }, h('table', {},
        h('thead', {}, h('tr', {}, ...['SSID (nombre)', 'Seguridad', 'Señal', 'BSSID', 'Portal cautivo'].map((x) => h('th', { scope: 'col' }, x)))),
        h('tbody', {}, ...nets.map((n) => h('tr', {}, ...n.map((v) => h('td', {}, v))))))),
      h('details', { class: 'card' },
        h('summary', {}, 'Captura del portal que aparece al conectarse a una de las redes abiertas'),
        h('div', { class: 'phone stack', 'aria-label': 'Captura simulada, no es un formulario real' },
          h('p', { style: 'text-align:center' }, h('strong', {}, '📶 IES Río Claro – Acceso alumnado')),
          h('p', {}, 'Para navegar, inicia sesión con tu usuario y contraseña del aula virtual.'),
          h('div', { class: 'card muted' }, 'Usuario: ____________'),
          h('div', { class: 'card muted' }, 'Contraseña: ____________'),
          h('p', { class: 'muted', style: 'font-size:.8rem' }, '(Imagen simulada: aquí no se puede escribir nada)'))));
  },
  hints: [
    'Hay dos redes con el mismo nombre. Compara su seguridad y si piden datos en una web.',
    'El atacante pone su antena cerca para tener MÁS señal, y la deja abierta con un portal que pide la contraseña.',
  ],
  answerHelp: 'El BSSID, con o sin los dos puntos (ej.: AA:BB:CC:DD:EE:FF).',
  lesson: 'Un «evil twin» copia el nombre de una wifi conocida, suele tener más señal y un portal que roba contraseñas. El nombre (SSID) lo puede poner cualquiera: fíjate en la seguridad y desconfía si te piden credenciales.',
  tip: 'Desactiva «Conectar automáticamente a redes abiertas» y olvida las wifis públicas que ya no uses.',
};
