import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { classifyList, fakeLink } from '../widgets';

const sms = (from: string, text: string, link?: string) =>
  h('div', { class: 'msg' }, h('div', { class: 'from' }, from), h('p', {}, text), link ? fakeLink(link) : '');

export const m3: Challenge = {
  id: 'm3',
  title: 'SMS trampa',
  difficulty: 'facil',
  story: [
    'Estos SMS han llegado al móvil de Laura (y alguno al de su madre). Los textos son simulados.',
    'Clasifica cada uno como Fraude (F) o Legítimo (L).',
  ],
  render(el, ctx) {
    el.append(classifyList(ctx, [
      { key: '1', node: sms('Correos', 'Su envío ES2291 está retenido en aduanas. Abone 2,99 € hoy o será devuelto:', 'https://correos-aduanas.top/pago') },
      { key: '2', node: sms('DGT', 'Tiene una multa pendiente de 100 €. Pague en 24 h con un 50 % de descuento:', 'http://dgt-multas-pago.info/m/88213') },
      { key: '3', node: sms('BBVA', 'Tu código para confirmar el pago de 12,50 € en Amazon es 482913. No lo compartas con nadie: BBVA nunca te lo pedirá.') },
      { key: '4', node: sms('AEAT', 'Tiene una devolución de 312,40 € pendiente. Para recibirla llame al 806 41 22 90 antes del viernes.') },
      { key: '5', node: sms('CitaSanitaria', 'Recordatorio: cita el 12/12 a las 9:40 con su médico de familia. Para anularla use la app oficial de su comunidad.') },
      { key: '6', node: sms('+34 7XX XXX XXX', 'Hola mamá, se me ha caído el móvil al váter, este es mi número nuevo. Escríbeme por WhatsApp que necesito una cosa urgente') },
    ], [['F', 'Fraude'], ['L', 'Legítimo']]));
  },
  hints: [
    'No hace falta un enlace para que sea fraude: también te pueden pedir que llames a un número de pago o que contestes por otra app.',
    'Hay 4 fraudes. Los 806 son números de tarificación especial, y el «hijo en apuros» es una estafa muy común.',
  ],
  answerHelp: 'Una letra por mensaje, en orden del 1 al 6 (ej.: LFLFLL).',
  lesson: 'El smishing suplanta a Correos, la DGT, Hacienda o el banco y juega con la urgencia. Variantes sin enlace: llamar a un 806 o el «hola mamá, número nuevo». Un banco nunca te pide el código; Hacienda no devuelve dinero por SMS.',
  tip: 'Ante cualquier SMS urgente: no toques el enlace ni llames, entra tú en la app oficial o llama al número de siempre.',
};
