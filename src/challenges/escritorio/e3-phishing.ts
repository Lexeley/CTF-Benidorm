import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { link, win } from '../../ui/sim';
import { pickList } from '../widgets';

interface Mail { from: string; addr: string; subject: string; time: string; brand: string; color: string; body: string[]; btn: string; url: string }

const mails: Mail[] = [
  { from: 'BBVA', addr: 'avisos@comunicaciones.bbva.es', subject: 'Tu extracto de septiembre ya está disponible', time: '09:12', brand: 'BBVA', color: '#1464a5',
    body: ['Hola, Laura:', 'Ya puedes consultar el extracto de tu Cuenta Joven correspondiente a septiembre de 2026.'], btn: 'Ver extracto', url: 'https://www.bbva.es/personas/extractos.html' },
  { from: 'BBVA', addr: 'avisos@comunicaciones.bbva.es', subject: 'Nuevo inicio de sesión en tu cuenta', time: '09:47', brand: 'BBVA', color: '#1464a5',
    body: ['Hola, Laura:', 'Hemos detectado un acceso a tu banca online desde un dispositivo nuevo (Windows · Chrome · Valencia).', 'Si no has sido tú, revisa tus dispositivos cuanto antes.'], btn: 'Revisar dispositivos', url: 'https://www.bbva.es@acceso-clientes.net/seguridad' },
  { from: 'Correos', addr: 'noreply@correos.es', subject: 'Tu envío PK43ES0028 está en reparto', time: '10:05', brand: 'Correos', color: '#ffcd00',
    body: ['Tu envío PK43ES0028 sale hoy a reparto.', '¿No vas a estar en casa? Elige otra franja horaria o un punto de recogida.'], btn: 'Cambiar entrega', url: 'https://seguimiento.correos.es.entregas-hoy.com/PK43ES0028' },
  { from: 'Correos', addr: 'noreply@correos.es', subject: 'Tu envío PK43ES0028 ha sido entregado', time: '13:31', brand: 'Correos', color: '#ffcd00',
    body: ['Tu envío PK43ES0028 se entregó a las 13:28.', 'Puedes descargar el justificante de entrega en nuestra web.'], btn: 'Ver justificante', url: 'https://www.correos.es/es/es/herramientas/localizador/envios' },
  { from: 'Amazon.es', addr: 'confirmar-envio@amazon.es', subject: 'Tu pedido 402-1185523 se ha retrasado', time: '15:20', brand: 'amazon.es', color: '#ff9900',
    body: ['Hola, Laura:', 'Lo sentimos, tu pedido (Auriculares inalámbricos, 1 ud.) no llegará en la fecha prevista.', 'Elige una nueva fecha de entrega o solicita el reembolso.'], btn: 'Gestionar pedido', url: 'https://аmazon.es/gp/your-account/orders' },
  { from: 'Instagram', addr: 'security@mail.instagram.com', subject: 'Tu cuenta podría ser desactivada', time: '17:02', brand: 'Instagram', color: '#d62976',
    body: ['Hola, laura.vlogs:', 'Hemos recibido una reclamación por infracción de derechos de autor en una de tus publicaciones.', 'Si crees que es un error, presenta una apelación en las próximas 48 horas o tu cuenta será desactivada.'], btn: 'Apelar', url: 'https://help.instagram.com.appeal-center.co/case/77812' },
  { from: 'Instagram', addr: 'security@mail.instagram.com', subject: 'Intento de inicio de sesión desde Lyon, Francia', time: '18:40', brand: 'Instagram', color: '#d62976',
    body: ['Hola, laura.vlogs:', 'Alguien ha intentado entrar en tu cuenta desde un dispositivo en Lyon (Francia).', 'Si no has sido tú, te recomendamos cambiar tu contraseña.'], btn: 'Revisar actividad', url: 'https://accountscenter.instagram.com/password_and_security' },
  { from: 'DGT', addr: 'notificaciones@dgt.es', subject: 'Notificación de expediente sancionador', time: '20:15', brand: 'DGT · Dirección General de Tráfico', color: '#0a5a2e',
    body: ['Estimado/a titular:', 'Tiene una notificación pendiente relativa a un expediente sancionador. Dispone de 20 días naturales para consultarla.'], btn: 'Consultar expediente', url: 'https://sede.dgt.gob.es.expediente-online.es/consulta' },
];

const mailView = (m: Mail) =>
  h('details', { class: 'card', style: 'padding:.5rem .7rem' },
    h('summary', {}, h('span', { style: 'display:inline-flex;width:calc(100% - 1.4rem);vertical-align:top;gap:.6rem;justify-content:space-between;flex-wrap:wrap' },
      h('span', {}, h('b', {}, m.from), ' — ', m.subject), h('span', { class: 'muted' }, m.time))),
    h('div', { style: 'margin-top:.6rem' },
      h('dl', { class: 'mail-head' },
        h('dt', {}, 'De:'), h('dd', {}, `${m.from} <${m.addr}>`),
        h('dt', {}, 'Para:'), h('dd', {}, 'laura.m.garcia@gmail.com'),
        h('dt', {}, 'Fecha:'), h('dd', {}, `vie, 2 oct 2026 ${m.time}`),
        h('dt', {}, 'Asunto:'), h('dd', {}, m.subject)),
      h('div', { class: 'mail-body' },
        h('div', { class: 'mail-brand', style: `color:${m.color}` }, m.brand),
        ...m.body.map((p) => h('p', {}, p)),
        link(m.url, m.btn),
        h('p', { class: 'muted', style: 'font-size:.75rem;margin-top:.8rem' }, `Este mensaje se ha enviado a laura.m.garcia@gmail.com. © 2026 ${m.from}.`))));

export const e3: Challenge = {
  id: 'e3',
  title: 'Bandeja de entrada',
  difficulty: 'medio',
  category: 'Phishing',
  story: [
    'Bandeja de entrada de Laura un viernes cualquiera (correos simulados). Todos parecen auténticos: logo, firma, remitente correcto y sin faltas de ortografía. El remitente de un correo se puede falsificar, así que no te fíes de él.',
    'Abre cada correo y mira a dónde lleva su botón (debajo aparece la dirección real). Marca los que te llevarían a un sitio que NO es de la marca. Usa «analizar en el kit»: a simple vista no basta.',
  ],
  render(el, ctx) {
    el.append(win('Correo - laura.m.garcia@gmail.com', '', pickList(ctx, 'Marca los correos fraudulentos',
      mails.map((m, i) => ({ key: String.fromCharCode(65 + i), node: mailView(m) })))));
  },
  hints: [
    'En una URL, lo que va antes de una «@» es un usuario, no el sitio. Y hay letras de otros alfabetos idénticas a las nuestras: el inspector las delata con «xn--».',
    'Hay 3 legítimos. El dominio real son las dos últimas partes antes de la primera «/» (tres si es .gob.es o .com.es).',
  ],
  answerHelp: 'Las letras de los fraudulentos en orden alfabético (ej.: ACG).',
  lesson: 'Trucos avanzados: usuario@dominio (todo lo de antes de la @ se ignora), homógrafos (una «а» cirílica idéntica a la latina; el navegador la muestra como xn--) y la marca como subdominio de otro dominio. El remitente se puede falsificar; el único dato fiable es el dominio real del enlace.',
  tip: 'No abras enlaces de correos o SMS con prisas: entra tú a mano en la web o la app oficial.',
};
