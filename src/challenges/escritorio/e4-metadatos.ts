import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import foto from '../../generated/foto-portatil.jpg?url';

export const e4: Challenge = {
  id: 'e4',
  title: 'La foto del atardecer',
  difficulty: 'medio',
  story: [
    'Laura mandó esta foto por WhatsApp al grupo de clase como documento («para que no pierda calidad»).',
    'Las cámaras de los móviles guardan dentro de la foto datos EXIF: modelo, fecha… y a veces la ubicación GPS exacta.',
    '¿En qué lugar conocido se hizo la foto?',
  ],
  attachments: [{ label: 'Descargar atardecer.jpg', url: foto, filename: 'atardecer.jpg' }],
  render(el) {
    el.append(
      h('img', { src: foto, alt: 'Atardecer con la silueta de un templo de columnas reflejado en el agua', width: 640, height: 480, style: 'border-radius:10px' }),
      h('p', {}, 'Herramientas: ', h('a', { href: '#kit' }, 'kit > visor EXIF')));
  },
  hints: [
    'Abre la foto en el Visor EXIF del Kit (botón «atardecer.jpg» o sube el archivo descargado). Busca la sección GPS.',
    'Compara las coordenadas con la tabla de lugares del visor. Ojo: hay dos lugares muy cerca; el bueno está a menos de 50 m.',
  ],
  answerHelp: 'El nombre del lugar (ej.: Puerta del Sol).',
  lesson: 'Una foto enviada como archivo puede revelar dónde estabas al metro. Muchas redes borran el EXIF al publicar, pero las apps de mensajería al «enviar como documento» o el correo no.',
  tip: 'Desactiva la ubicación en la app de cámara (Ajustes → Cámara → Ubicación).',
};
