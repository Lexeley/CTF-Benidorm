import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { fakeLink, pickList } from '../widgets';

const msg = (from: string, text: string, url: string) =>
  h('div', { class: 'msg' }, h('div', { class: 'from' }, from), h('p', {}, text), fakeLink(url));

export const e3: Challenge = {
  id: 'e3',
  title: 'Bandeja de entrada',
  difficulty: 'facil',
  story: [
    'Laura ha recibido estos 7 mensajes. Los textos son inventados para el reto: algunos enlaces llevan a la web real de la marca y otros intentan engañarla.',
    'Marca los FALSOS. Puedes analizar cada enlace con el inspector de URL del kit.',
  ],
  render(el, ctx) {
    el.append(pickList(ctx, 'Marca los mensajes falsos', [
      { key: 'A', node: msg('Correos', 'Tu envío está retenido. Paga 1,99 € de gastos de gestión para recibirlo hoy.', 'http://correos-envios.com/pago') },
      { key: 'B', node: msg('BBVA', 'Ya tienes disponible tu extracto mensual. Consúltalo en la app o en la web.', 'https://www.bbva.es/personas/extractos') },
      { key: 'C', node: msg('BBVA Seguridad', 'Hemos detectado un acceso extraño. Verifica tu cuenta en 24 h o será bloqueada.', 'https://bbva.es.verificacion-clientes.net/login') },
      { key: 'D', node: msg('Amazon', 'Ofertas flash: 90 % de descuento en consolas, solo hoy.', 'https://www.arnazon.es/ofertas') },
      { key: 'E', node: msg('+34 6XX XXX XXX', 'Has ganado un iPhone 17. Reclámalo antes de las 20:00', 'https://bit.ly/3x9Kp2a') },
      { key: 'F', node: msg('Instagram', 'Alguien ha intentado iniciar sesión en tu cuenta desde Lyon. Si no fuiste tú, revisa tu actividad.', 'https://accountscenter.instagram.com/password_and_security') },
      { key: 'G', node: msg('Instagram Support', 'Tu cuenta infringe derechos de autor y será eliminada en 24 h. Apela aquí.', 'https://instagram.com-copyright-appeal.help/form') },
    ]));
  },
  hints: [
    'Lee el dominio de derecha a izquierda desde la primera «/». Lo que va delante (subdominios) lo puede poner cualquiera.',
    'Fíjate en: http sin s, «rn» que parece «m», la marca como subdominio, guiones que alargan el dominio y acortadores. Hay 2 legítimos.',
  ],
  answerHelp: 'Las letras de los mensajes falsos en orden alfabético (ej.: ABF).',
  lesson: 'Técnicas típicas: dominios parecidos (arnazon), la marca como subdominio (bbva.es.algo.net, instagram.com-algo.help), http sin cifrar y acortadores que esconden el destino. Que un aviso dé miedo no lo hace falso: el de Instagram que lleva a accountscenter.instagram.com es real.',
  tip: 'No abras enlaces de SMS o correos con prisas: entra tú a mano en la web o la app oficial.',
};
