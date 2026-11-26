import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { fakeLink, pickList } from '../widgets';

const msg = (from: string, text: string, url: string) =>
  h('div', { class: 'msg' }, h('div', { class: 'from' }, from), h('p', {}, text), fakeLink(url));

export const e3: Challenge = {
  id: 'e3',
  title: 'Bandeja de entrada',
  difficulty: 'medio',
  story: [
    'Laura ha recibido estos 8 mensajes (simulados). Todos parecen venir de la marca que dicen y ninguno tiene faltas de ortografía.',
    'Marca los que la llevarían a un sitio que NO es de la marca. Copia los enlaces en el inspector de URL: a simple vista no basta.',
  ],
  render(el, ctx) {
    el.append(pickList(ctx, 'Marca los enlaces fraudulentos', [
      { key: 'A', node: msg('BBVA', 'Ya tienes disponible tu extracto mensual.', 'https://www.bbva.es/personas/extractos.html') },
      { key: 'B', node: msg('BBVA', 'Hemos detectado un acceso desde un dispositivo nuevo. Si no has sido tú, revísalo:', 'https://www.bbva.es@acceso-clientes.net/seguridad') },
      { key: 'C', node: msg('Correos', 'Tu envío PK43ES0028 está en reparto. Cambia la franja de entrega:', 'https://seguimiento.correos.es.entregas-hoy.com/PK43ES0028') },
      { key: 'D', node: msg('Correos', 'Tu envío PK43ES0028 ha sido entregado. Consulta el justificante:', 'https://www.correos.es/es/es/herramientas/localizador/envios') },
      { key: 'E', node: msg('Amazon', 'Tu pedido 402-118 se ha retrasado. Elige nueva fecha:', 'https://аmazon.es/gp/your-account/orders') },
      { key: 'F', node: msg('Instagram', 'Tu cuenta podría ser desactivada por infringir derechos de autor. Revisa la apelación:', 'https://help.instagram.com.appeal-center.co/case/77812') },
      { key: 'G', node: msg('Instagram', 'Alguien ha intentado iniciar sesión desde Lyon. Si no fuiste tú, revisa tu actividad:', 'https://accountscenter.instagram.com/password_and_security') },
      { key: 'H', node: msg('DGT', 'Tiene una sanción pendiente de notificar. Consulte el expediente:', 'https://sede.dgt.gob.es.expediente-online.es/consulta') },
    ]));
  },
  hints: [
    'En una URL, lo que va antes de una «@» es un usuario, no el sitio. Y hay letras de otros alfabetos que son idénticas a las nuestras: el inspector las delata con «xn--».',
    'Hay 3 legítimos. En cada enlace, el dominio real son las dos últimas partes antes de la primera «/» (tres si es .gob.es o .com.es).',
  ],
  answerHelp: 'Las letras de los fraudulentos en orden alfabético (ej.: ACG).',
  lesson: 'Trucos avanzados: usuario@dominio (todo lo de antes de la @ se ignora), homógrafos (una «а» cirílica idéntica a la latina; el navegador la muestra como xn--) y la marca como subdominio de otro dominio. El único dato fiable es el dominio real.',
  tip: 'No abras enlaces de SMS o correos con prisas: entra tú a mano en la web o la app oficial.',
};
