import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

// SSID, seguridad, señal, canal, BSSID, certificado del servidor / portal
const nets: string[][] = [
  ['IES_Rio_Claro_Alumnos', 'WPA2-Enterprise', '-71 dBm', '6', '3C:84:6A:11:20:01', 'radius.iesrioclaro.es · emitido por FNMT-RCM · válido'],
  ['IES_Rio_Claro_Alumnos', 'WPA2-Enterprise', '-41 dBm', '11', '3C:84:6A:11:20:0F', 'radius.iesrioclaro.es · emitido por radius.iesrioclaro.es · no verificado'],
  ['IES_Rio_Claro_Alumnos', 'WPA2-Enterprise', '-58 dBm', '36 (5 GHz)', '3C:84:6A:11:20:05', 'radius.iesrioclaro.es · emitido por FNMT-RCM · válido'],
  ['IES_Rio_Claro_Invitados', 'Abierta', '-66 dBm', '1', '3C:84:6A:11:20:09', 'Portal: «Acepta las normas de uso»'],
  ['MOVISTAR_8A21', 'WPA3-Personal', '-70 dBm', '44 (5 GHz)', 'F4:6B:8C:21:8A:21', '-'],
  ['IES_Rio_Claro_Alumnos', 'WPA2-Personal', '-83 dBm', '6', '7A:10:EE:32:9B:40', 'Portal: «Introduce tu usuario del aula virtual»'],
];

export const m4: Challenge = {
  id: 'm4',
  title: 'La wifi gemela',
  difficulty: 'dificil',
  story: [
    'Tablón del instituto: «Wifi del alumnado: IES_Rio_Claro_Alumnos (WPA2-Enterprise, entra con tu usuario del aula virtual). La primera vez, acepta solo el certificado radius.iesrioclaro.es emitido por FNMT-RCM».',
    'Alguien ha montado un punto de acceso falso que se hace pasar por la wifi del instituto, copiando hasta el fabricante del router. Hay una red cutre que salta a la vista… pero esa no es la que te va a engañar. ¿Cuál es el BSSID del punto de acceso falso que SÍ podría engañar a alguien?',
  ],
  render(el) {
    el.append(h('div', { class: 'table-wrap' }, h('table', {},
      h('thead', {}, h('tr', {}, ...['SSID', 'Seguridad', 'Señal', 'Canal', 'BSSID', 'Certificado / portal'].map((x) => h('th', { scope: 'col' }, x)))),
      h('tbody', {}, ...nets.map((n) => h('tr', {}, ...n.map((v) => h('td', {}, v))))))));
  },
  hints: [
    'Con WPA2-Enterprise, el móvil comprueba un certificado antes de enviar tu usuario y contraseña. Un atacante puede copiar el nombre del certificado, pero no puede conseguir uno firmado por una autoridad de verdad.',
    'Busca un certificado «autofirmado»: emitido por sí mismo en vez de por FNMT-RCM. Que tenga la mejor señal tampoco es casualidad.',
  ],
  answerHelp: 'El BSSID, con o sin los dos puntos.',
  lesson: 'Un evil twin bien montado copia el nombre, el tipo de seguridad y hasta el fabricante (las 3 primeras parejas del BSSID). Lo que no puede falsificar es un certificado firmado por una autoridad de confianza: si el móvil te pide aceptar un certificado no verificado, para.',
  tip: 'Al conectarte a una wifi del trabajo o del instituto, configura el certificado del servidor y no aceptes nunca uno «no verificado».',
};
