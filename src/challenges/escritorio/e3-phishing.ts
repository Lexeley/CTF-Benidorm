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
    'Lucía ha recibido estos 5 mensajes. Todas las empresas son inventadas. Algunos enlaces son legítimos y otros intentan engañarla.',
    'Marca los FALSOS. Puedes analizar cada enlace con el Inspector de URL del Kit.',
  ],
  render(el, ctx) {
    el.append(pickList(ctx, 'Marca los mensajes falsos', [
      { key: 'A', node: msg('PaqueteríaIbérica', 'Tu paquete está retenido. Paga 1,99 € de gastos para recibirlo hoy.', 'http://paqueteriaiberica-envios.com/pago') },
      { key: 'B', node: msg('BancoNorte', 'Ya tienes disponible tu extracto mensual. Consúltalo desde la app o en la web de siempre.', 'https://www.banconorte.es/extractos') },
      { key: 'C', node: msg('BancoNorte Seguridad', 'Hemos detectado un acceso extraño. Verifica tu cuenta en 24 h o será bloqueada.', 'https://banconorte.es.verificacion-cuentas.net/login') },
      { key: 'D', node: msg('TiendaPíxel', '¡Rebajas del 90 % solo hoy en consolas! Últimas unidades.', 'https://www.tlendapixel.es/ofertas') },
      { key: 'E', node: msg('+34 6XX XXX XXX', '¡Has ganado un móvil nuevo! Reclámalo antes de las 20:00 👉', 'https://cort.ly/x9Kp') },
    ]));
    el.append(h('p', { class: 'muted' }, 'Referencias reales de las marcas (inventadas): banconorte.es · tiendapixel.es · paqueteriaiberica.es'));
  },
  hints: [
    'Lee el dominio de derecha a izquierda empezando por la primera «/». Lo que va antes del dominio real (subdominios) lo puede poner cualquiera.',
    'Fíjate en: http sin «s», letras cambiadas (l por i), un dominio real usado como subdominio y enlaces acortados. Solo uno es legítimo.',
  ],
  answerHelp: 'Las letras de los mensajes falsos en orden alfabético (ej.: ABD).',
  lesson: 'Las técnicas más comunes: dominios parecidos (typosquatting), la marca metida como subdominio, http sin cifrar y acortadores que esconden el destino. El dominio real es lo que va justo antes de la extensión.',
  tip: 'No abras enlaces de SMS o correos con prisas: entra tú a mano en la web o la app oficial.',
};
