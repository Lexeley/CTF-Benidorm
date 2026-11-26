import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { classifyList, fakeLink } from '../widgets';

const sms = (from: string, text: string, link?: string) =>
  h('div', { class: 'msg' }, h('div', { class: 'from' }, from), h('p', {}, text), link ? fakeLink(link) : '');

export const m3: Challenge = {
  id: 'm3',
  title: 'SMS trampa',
  difficulty: 'medio',
  story: [
    'Estos mensajes han llegado al móvil de Laura y al de su madre (simulados). Ojo: los estafadores pueden falsificar el remitente, así que un SMS puede aparecer en el mismo hilo que los mensajes reales del banco.',
    'Clasifica cada uno como Fraude (F) o Legítimo (L).',
  ],
  render(el, ctx) {
    el.append(classifyList(ctx, [
      { key: '1', node: sms('Correos', 'Tu envío PK43ES0028 llegará mañana entre 9:00 y 14:00. Síguelo en:', 'https://www.correos.es/es/es/herramientas/localizador') },
      { key: '2', node: sms('Correos', 'No hemos podido entregar tu envío PK43ES0028. Confirma tu dirección:', 'https://correos.es-entregas.info/PK43ES0028') },
      { key: '3', node: sms('BBVA', 'Tu código para confirmar el pago de 12,50 € en Amazon es 482913. No lo compartas con nadie, ni con BBVA.') },
      { key: '4', node: sms('BBVA', 'Hemos limitado tu tarjeta por un cargo sospechoso. Si no lo reconoces, actívala de nuevo en:', 'https://bbva.clientes-app.com/activar') },
      { key: '5', node: sms('AEAT', 'Tiene una devolución de 312,40 € pendiente. Para recibirla llame al 806 41 22 90 antes del viernes.') },
      { key: '6', node: sms('+34 7XX XXX XXX', 'Hola mamá, se me ha caído el móvil al váter, este es mi número nuevo. Escríbeme por WhatsApp que necesito una cosa urgente') },
      { key: '7', node: sms('CitaSanitaria', 'Recordatorio: cita el 12/12 a las 9:40 con su médico de familia. Para anularla use la app oficial de su comunidad.') },
      { key: '8', node: sms('Carla (contacto guardado)', 'Tiaaa te ha llegado un código de 6 cifras por WhatsApp? Lo puse en tu número sin querer, pásamelo porfa 🙏') },
    ], [['F', 'Fraude'], ['L', 'Legítimo']]));
  },
  hints: [
    'Que el remitente diga «BBVA» o que sea un contacto guardado no prueba nada: a Carla le pueden haber robado la cuenta. Fíjate en lo que te piden y adónde te mandan.',
    'Hay 5 fraudes. Uno de los de BBVA es legítimo y otro no; uno de los de Correos también.',
  ],
  answerHelp: 'Una letra por mensaje, del 1 al 8 (ej.: LFLFLLFL).',
  lesson: 'El remitente de un SMS se puede falsificar y las cuentas de tus amigos se pueden robar. El código de verificación de WhatsApp es la llave de tu cuenta: quien lo tenga te la quita y repite el truco con tus contactos.',
  tip: 'Activa la verificación en dos pasos de WhatsApp y nunca reenvíes un código, te lo pida quien te lo pida.',
};
