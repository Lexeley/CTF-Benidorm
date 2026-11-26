import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { avatar, phone } from '../../ui/sim';
import foto from '../../generated/foto-portatil.jpg?url';

const FILE = '20261003_184210.jpg';
const bubble = (text: string | Node, t: string, me = false) => h('div', { class: `bubble${me ? ' me' : ''}`, style: 'margin:.35rem 0' }, text, h('span', { class: 't' }, t));

export const e4: Challenge = {
  id: 'e4',
  title: 'La foto del atardecer',
  difficulty: 'medio',
  category: 'Forense',
  story: [
    'Capturas del WhatsApp de Laura el sábado 3 de octubre. Por la noche mandó una foto al grupo de clase «como documento, para que no pierda calidad».',
    '¿Dónde estaba realmente y a qué hora hizo la foto?',
  ],
  attachments: [{ label: `Descargar ${FILE}`, url: foto, filename: FILE }],
  render(el) {
    el.append(
      h('div', { class: 'grid' },
        phone('18:46', 'Mamá',
          bubble('dónde estás? 🙄', '18:44'),
          bubble('sigo en la biblio estudiando, llego a las 9', '18:45 ✓✓', true),
          bubble('vale cariño, abrígate que refresca', '18:46')),
        phone('21:32', '1º Bach B (27)',
          h('div', { class: 'thread-name' }, avatar('Carla', 22), 'Carla'),
          bubble('alguien ha hecho algo del finde? 😴', '21:20'),
          h('div', { class: 'bubble me', style: 'margin:.35rem 0' },
            h('div', { class: 'doc' }, h('span', { class: 'doc-ico' }, 'JPG'), h('span', {}, FILE, h('br'), h('span', { class: 'muted', style: 'font-size:.75rem' }, '1 página · 41 kB · JPG'))),
            'mirad qué atardecer 😍', h('span', { class: 't' }, '21:31 ✓✓')),
          bubble('qué pasada!! dónde es??', '21:31'))),
      h('img', { src: foto, alt: 'Atardecer con la silueta de un templo de columnas reflejado en el agua', width: 640, height: 480, style: 'margin-top:.75rem' }),
      h('p', {}, 'Herramientas: ', h('a', { href: '#kit' }, 'kit > visor EXIF')));
  },
  hints: [
    'Una foto enviada como documento conserva sus datos EXIF: modelo, fecha y a veces GPS. Ábrela en el visor EXIF del kit.',
    'Compara las coordenadas con la tabla de lugares del visor, con 4 decimales: hay varios sitios a pocos cientos de metros. La hora sale en «Fecha de la foto» (y en el nombre del archivo).',
  ],
  answerHelp: 'Lugar y hora HH:MM (ej.: Puerta del Sol 17:05).',
  lesson: 'Una foto enviada como documento (o por correo) puede revelar dónde estabas al metro. Las redes suelen borrar el EXIF al publicar, pero los documentos no. Y los nombres de archivo de muchas cámaras ya llevan fecha y hora.',
  tip: 'Desactiva la ubicación en la app de cámara (Ajustes > Cámara > Etiquetas de ubicación).',
};
