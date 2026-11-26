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
    'Estos SMS han llegado al móvil de Lucía. Todas las entidades son inventadas.',
    'Clasifica cada uno como Fraude (F) o Legítimo (L).',
  ],
  render(el, ctx) {
    el.append(h('div', { class: 'phone' }, classifyList(ctx, [
      { key: '1', node: sms('PaqIberica', 'Tu envío #ES2291 está retenido en aduanas. Abona 2,99 € hoy o será devuelto:', 'https://paqiberica-aduanas.top/pago') },
      { key: '2', node: sms('TRAFICO-MULTAS', 'Tiene una multa pendiente de 100 €. Pague en 24 h con un 50 % de descuento:', 'http://multas-trafico-pago.info/m/88213') },
      { key: '3', node: sms('BancoNorte', 'Tu código para confirmar el pago de 12,50 € en TiendaPíxel es 482913. NO lo compartas con nadie: BancoNorte nunca te lo pedirá.') },
      { key: '4', node: sms('BancoNorte', 'Su cuenta ha sido BLOQUEADA por seguridad. Verifique sus datos para desbloquearla:', 'https://banconorte-seguro.info/acceso') },
      { key: '5', node: sms('CentroSalud', 'Recordatorio: cita el 12/12 a las 9:40 con su médico de familia. Para anularla, usa la app oficial de salud.') },
    ], [['F', 'Fraude'], ['L', 'Legítimo']])));
  },
  hints: [
    'Los fraudes meten prisa, piden dinero o datos y llevan un enlace. Los legítimos informan y te mandan a la app oficial, sin enlaces raros.',
    'Hay 3 fraudes y 2 legítimos. Mira los dominios con el Inspector de URL del Kit.',
  ],
  answerHelp: 'Una letra por mensaje, en orden del 1 al 5 (ej.: LFLFL).',
  lesson: 'El smishing (phishing por SMS) suplanta a paqueterías, tráfico o bancos y juega con la urgencia. Un banco nunca te pide el código por SMS ni te manda a verificar tu cuenta con un enlace.',
  tip: 'Ante cualquier SMS urgente con enlace: no lo toques, entra tú en la app oficial o llama al número de siempre.',
};
