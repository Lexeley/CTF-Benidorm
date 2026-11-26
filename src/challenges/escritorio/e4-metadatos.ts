import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import foto from '../../generated/foto-portatil.jpg?url';

export const e4: Challenge = {
  id: 'e4',
  title: 'La foto del atardecer',
  difficulty: 'medio',
  story: [
    'El 3 de octubre, a las 18:45, Laura escribe a su madre: «sigo en la biblio, llego a las 9». Esa noche manda esta foto al grupo de clase como documento.',
    '¿Dónde estaba realmente y a qué hora hizo la foto?',
  ],
  attachments: [{ label: 'Descargar atardecer.jpg', url: foto, filename: 'atardecer.jpg' }],
  render(el) {
    el.append(
      h('img', { src: foto, alt: 'Atardecer con la silueta de un templo de columnas reflejado en el agua', width: 640, height: 480, style: 'border-radius:10px' }),
      h('p', {}, 'Herramientas: ', h('a', { href: '#kit' }, 'kit > visor EXIF')));
  },
  hints: [
    'Las fotos guardan datos EXIF: modelo, fecha y a veces GPS. Abre la foto en el visor EXIF del kit.',
    'Compara las coordenadas con la tabla de lugares del visor, con 4 decimales: hay varios sitios a pocos cientos de metros. La hora es la de «Fecha de la foto», en formato HH:MM.',
  ],
  answerHelp: 'Lugar y hora HH:MM (ej.: Puerta del Sol 17:05).',
  lesson: 'Una foto enviada como archivo puede revelar dónde estabas al metro. Muchas redes borran el EXIF al publicar, pero las apps de mensajería al «enviar como documento» o el correo no.',
  tip: 'Desactiva la ubicación en la app de cámara (Ajustes → Cámara → Ubicación).',
};
