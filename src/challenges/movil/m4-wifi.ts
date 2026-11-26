import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

const nets: [string, string, string, string, string][] = [
  ['IES_Rio_Claro_Alumnos', 'WPA2-Enterprise', '-71 dBm', '3C:84:6A:11:20:01', 'No'],
  ['IES_Rio_Claro_Alumnos', 'WPA2-Personal', '-39 dBm', 'DE:AD:4B:9F:00:13', 'Sí'],
  ['IES_Rio_Claro_Alumnos', 'WPA2-Enterprise', '-58 dBm', '3C:84:6A:11:20:05', 'No'],
  ['IES_Rio_Claro_Invitados', 'Abierta', '-66 dBm', '3C:84:6A:11:20:09', 'Sí'],
  ['MOVISTAR_8A21', 'WPA3-Personal', '-70 dBm', 'F4:6B:8C:21:8A:21', 'No'],
  ['Cafeteria_Libre', 'Abierta', '-81 dBm', '7A:10:EE:32:9B:40', 'Sí'],
];

export const m4: Challenge = {
  id: 'm4',
  title: 'La wifi gemela',
  difficulty: 'medio',
  story: [
    'En el recreo, el móvil de Laura ve estas redes. En el tablón del instituto pone: «La wifi del alumnado es IES_Rio_Claro_Alumnos (WPA2-Enterprise). NUNCA pide la contraseña en una página web».',
    'Alguien ha montado una red trampa (un «gemelo malvado»). Ojo: un instituto grande tiene varios puntos de acceso con el mismo nombre. ¿Cuál es el BSSID de la trampa?',
  ],
  render(el) {
    el.append(
      h('div', { class: 'table-wrap' }, h('table', {},
        h('thead', {}, h('tr', {}, ...['SSID (nombre)', 'Seguridad', 'Señal', 'BSSID', 'Portal cautivo'].map((x) => h('th', { scope: 'col' }, x)))),
        h('tbody', {}, ...nets.map((n) => h('tr', {}, ...n.map((v) => h('td', {}, v))))))),
      h('details', { class: 'card' },
        h('summary', {}, 'Captura del portal que aparece al conectarse a una de las redes'),
        h('div', { class: 'phone stack', 'aria-label': 'Captura simulada, no es un formulario real' },
          h('p', { style: 'text-align:center' }, h('strong', {}, 'IES Río Claro - Acceso alumnado')),
          h('p', {}, 'Para navegar, inicia sesión con tu usuario y contraseña del aula virtual.'),
          h('div', { class: 'card muted' }, 'Usuario: ____________'),
          h('div', { class: 'card muted' }, 'Contraseña: ____________'),
          h('p', { class: 'muted', style: 'font-size:.8rem' }, '(Imagen simulada: aquí no se puede escribir nada)'))));
  },
  hints: [
    'Varias redes comparten nombre. Compara la seguridad con lo que dice el tablón. La red de invitados no imita a nadie.',
    'Los 6 primeros caracteres del BSSID identifican al fabricante. Los puntos de acceso del instituto son todos del mismo fabricante.',
  ],
  answerHelp: 'El BSSID, con o sin los dos puntos (ej.: AA:BB:CC:DD:EE:FF).',
  lesson: 'Un «evil twin» copia el nombre de una wifi conocida, suele tener más señal y un portal que roba contraseñas. El nombre (SSID) lo puede poner cualquiera: fíjate en el tipo de seguridad, en el fabricante del BSSID y desconfía si te piden credenciales.',
  tip: 'Desactiva «Conectar automáticamente a redes abiertas» y olvida las wifis públicas que ya no uses.',
};
