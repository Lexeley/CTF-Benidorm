import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { loadCapture, packetViewer } from '../../kit/packets';

export const e6: Challenge = {
  id: 'e6',
  title: 'El wifi de la cafetería',
  difficulty: 'dificil',
  story: [
    'Laura se conectó al wifi abierto de una cafetería y entró en la web de socios de su club. Alguien en la misma red capturó el tráfico.',
    'Casi todo va cifrado (TLS), pero la web del club no usa https. Encuentra la contraseña correcta de Laura.',
  ],
  render(el) {
    const box = h('div', {}, h('p', { class: 'muted' }, 'Cargando captura…'));
    el.append(box);
    loadCapture().then((c) => box.replaceChildren(packetViewer(c)));
  },
  hints: [
    'Filtra por «http». No hay formulario de login: mira las cabeceras de las peticiones a la zona de socios y qué responde el servidor a cada una (401 = rechazada).',
    'La cabecera «Authorization: Basic …» lleva usuario:contraseña en Base64. Decodifícala y quédate con lo que va después de los dos puntos.',
  ],
  answerHelp: 'La contraseña tal cual, ya decodificada.',
  lesson: 'En http todo viaja en claro: cualquiera en la misma red puede leer lo que envías. Con https (candado) el contenido va cifrado aunque la red sea abierta.',
  tip: 'Activa el modo «solo HTTPS» del navegador y evita iniciar sesión en wifis abiertas (usa tus datos móviles).',
};
