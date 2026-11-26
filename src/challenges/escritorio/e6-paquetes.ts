import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { loadCapture, packetViewer } from '../../kit/packets';

export const e6: Challenge = {
  id: 'e6',
  title: 'El wifi de la cafetería',
  difficulty: 'dificil',
  story: [
    'Lucía se conectó al wifi abierto de una cafetería y entró en la web de socios de su club. Alguien en la misma red capturó el tráfico.',
    'Casi todo va cifrado (TLS), pero una web no usa https. Encuentra la contraseña de Lucía en la captura.',
  ],
  render(el) {
    const box = h('div', {}, h('p', { class: 'muted' }, 'Cargando captura…'));
    el.append(box);
    loadCapture().then((c) => box.replaceChildren(packetViewer(c)));
  },
  hints: [
    'Escribe «http» en el filtro. Hay varias peticiones POST; solo una es un inicio de sesión.',
    'En los formularios los símbolos van codificados (%23, %21…). Pasa el valor de «clave» por «URL → texto» en el Decodificador del Kit.',
  ],
  answerHelp: 'La contraseña tal cual, ya decodificada.',
  lesson: 'En http todo viaja en claro: cualquiera en la misma red puede leer lo que envías. Con https (candado) el contenido va cifrado aunque la red sea abierta.',
  tip: 'Activa el modo «solo HTTPS» del navegador y evita iniciar sesión en wifis abiertas (usa tus datos móviles).',
};
