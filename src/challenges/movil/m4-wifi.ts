import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { phone } from '../../ui/sim';

interface Net { ssid: string; sec: string; dbm: number; ch: string; bssid: string; extra: [string, string][] }
const nets: Net[] = [
  { ssid: 'IES_Rio_Claro_Alumnos', sec: 'WPA2-Enterprise', dbm: -41, ch: '11 (2,4 GHz)', bssid: '3C:84:6A:11:20:0F',
    extra: [['Método EAP', 'PEAP'], ['Certificado del servidor', 'radius.iesrioclaro.es'], ['Emitido por', 'radius.iesrioclaro.es'], ['Validez', 'No verificado: «El certificado no está firmado por una autoridad de confianza»']] },
  { ssid: 'IES_Rio_Claro_Alumnos', sec: 'WPA2-Enterprise', dbm: -58, ch: '36 (5 GHz)', bssid: '3C:84:6A:11:20:05',
    extra: [['Método EAP', 'PEAP'], ['Certificado del servidor', 'radius.iesrioclaro.es'], ['Emitido por', 'AC FNMT-RCM'], ['Validez', 'Válido hasta 11/2027']] },
  { ssid: 'IES_Rio_Claro_Invitados', sec: 'Abierta', dbm: -66, ch: '1 (2,4 GHz)', bssid: '3C:84:6A:11:20:09',
    extra: [['Portal cautivo', '«Acepta las normas de uso para navegar»']] },
  { ssid: 'MOVISTAR_8A21', sec: 'WPA3-Personal', dbm: -70, ch: '44 (5 GHz)', bssid: 'F4:6B:8C:21:8A:21', extra: [] },
  { ssid: 'IES_Rio_Claro_Alumnos', sec: 'WPA2-Enterprise', dbm: -71, ch: '6 (2,4 GHz)', bssid: '3C:84:6A:11:20:01',
    extra: [['Método EAP', 'PEAP'], ['Certificado del servidor', 'radius.iesrioclaro.es'], ['Emitido por', 'AC FNMT-RCM'], ['Validez', 'Válido hasta 11/2027']] },
  { ssid: 'IES_Rio_Claro_Alumnos', sec: 'WPA2-Personal', dbm: -83, ch: '6 (2,4 GHz)', bssid: '7A:10:EE:32:9B:40',
    extra: [['Portal cautivo', '«Introduce tu usuario y contraseña del aula virtual para navegar»']] },
];

const bars = (dbm: number) => (dbm > -50 ? '▂▄▆█' : dbm > -65 ? '▂▄▆_' : dbm > -75 ? '▂▄__' : '▂___');

export const m4: Challenge = {
  id: 'm4',
  title: 'La wifi gemela',
  difficulty: 'dificil',
  category: 'Redes',
  story: [
    'Tablón del instituto: «Wifi del alumnado: IES_Rio_Claro_Alumnos (WPA2-Enterprise, entra con tu usuario del aula virtual). La primera vez, acepta solo el certificado radius.iesrioclaro.es emitido por AC FNMT-RCM. Hay varias antenas por el edificio».',
    'Alguien ha montado un punto de acceso falso que se hace pasar por la wifi del instituto, copiando hasta el fabricante del router. Hay una red cutre que salta a la vista… pero esa no es la que engañaría a casi todo el mundo. ¿Cuál es el BSSID del punto de acceso falso bien hecho?',
  ],
  render(el) {
    el.append(phone('10:47', 'Ajustes > Wi-Fi', ...nets.map((n) =>
      h('details', { style: 'border-bottom:1px solid #222;padding:.35rem 0' },
        h('summary', {}, h('span', { style: 'display:inline-flex;justify-content:space-between;width:calc(100% - 1.2rem);vertical-align:middle;gap:.5rem' },
          h('span', {}, h('b', {}, n.ssid), h('br'), h('span', { class: 'muted', style: 'font-size:.78rem' }, `${n.sec === 'Abierta' ? 'Abierta' : `Protegida (${n.sec})`}`)),
          h('span', { class: 'mono', 'aria-label': `Señal ${n.dbm} dBm` }, bars(n.dbm)))),
        h('div', { class: 'set-item' }, h('span', {}, 'Señal'), h('span', {}, `${n.dbm} dBm`)),
        h('div', { class: 'set-item' }, h('span', {}, 'BSSID'), h('span', { class: 'mono' }, n.bssid)),
        h('div', { class: 'set-item' }, h('span', {}, 'Canal'), h('span', {}, n.ch)),
        ...n.extra.map(([k, v]) => h('div', { class: 'set-item' }, h('span', {}, k), h('span', { style: 'text-align:right' }, v)))))),
      h('p', { class: 'muted' }, 'Toca cada red para ver sus detalles.'));
  },
  hints: [
    'Con WPA2-Enterprise, el móvil comprueba un certificado antes de enviar tu usuario y contraseña. Un atacante puede copiar el nombre del certificado, pero no conseguir uno firmado por una autoridad de verdad.',
    'Mira el «Emitido por» de cada red del instituto. Que la falsa tenga la mejor señal tampoco es casualidad.',
  ],
  answerHelp: 'El BSSID, con o sin los dos puntos.',
  lesson: 'Un evil twin bien montado copia el nombre, el tipo de seguridad y hasta el fabricante (las 3 primeras parejas del BSSID). Lo que no puede falsificar es un certificado firmado por una autoridad de confianza: si el móvil te pide aceptar un certificado no verificado, para.',
  tip: 'Al conectarte a una wifi del trabajo o del instituto, configura el certificado del servidor y no aceptes nunca uno «no verificado».',
};
