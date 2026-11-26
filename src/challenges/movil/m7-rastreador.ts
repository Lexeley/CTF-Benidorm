import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

const table = (caption: string, head: string[], rows: string[][]) =>
  h('div', { class: 'table-wrap' }, h('table', {},
    h('caption', { class: 'muted', style: 'text-align:left;padding:.4rem' }, caption),
    h('thead', {}, h('tr', {}, ...head.map((x) => h('th', { scope: 'col' }, x)))),
    h('tbody', {}, ...rows.map((r) => h('tr', {}, ...r.map((v) => h('td', { style: 'white-space:normal' }, v)))))));

export const m7: Challenge = {
  id: 'm7',
  title: 'Rastreador desconocido',
  difficulty: 'dificil',
  story: [
    'Por la noche, el móvil de Lucía muestra: «Se ha detectado un rastreador desconocido que se mueve contigo». Alguien le metió una etiqueta localizadora en la mochila.',
    'Cómo funcionan los avisos: el móvil SOLO avisa cuando el rastreador viaja contigo y su dueño NO está cerca. El primer aviso llega entre 15 y 60 minutos después de separarse del dueño.',
    'Todas las personas son inventadas. ¿Quién lo puso?',
  ],
  render(el) {
    el.append(
      table('La tarde de Lucía (martes)', ['Hora', 'Dónde'], [
        ['15:30 – 16:30', 'Polideportivo (entreno; la mochila se queda en el banco)'],
        ['16:30 – 17:15', 'Autobús y camino a casa'],
        ['17:15 – 18:45', 'Casa'],
        ['19:00 – 20:30', 'Academia de inglés'],
        ['20:45 – …', 'Casa'],
      ]),
      table('Historial de avisos del móvil', ['Hora', 'Aviso'], [
        ['16:52', '⚠ Rastreador desconocido cerca (calle del polideportivo)'],
        ['17:40', '⚠ Sigue contigo (casa)'],
        ['18:30', '⚠ Sigue contigo (casa)'],
        ['19:00 – 20:30', '— sin avisos —'],
        ['21:05', '⚠ Sigue contigo (casa)'],
        ['22:30', '⚠ Sigue contigo (casa)'],
      ]),
      table('Qué hicieron sus conocidos esa tarde', ['Persona', 'Horario'], [
        ['Marcos', '15:00 – 17:00 polideportivo (entrena en la pista de al lado) · 18:00 – 21:00 trabaja en una pizzería'],
        ['Sara', '16:00 – 18:00 biblioteca · 19:00 – 20:30 academia de inglés (misma clase que Lucía)'],
        ['Dani', '15:30 – 16:30 polideportivo (grada) · 19:00 – 20:30 academia de inglés (clase de al lado)'],
        ['Alba', '15:30 – 16:30 polideportivo (grada) · 19:00 – 21:00 cine en el centro'],
      ]));
  },
  hints: [
    'Fíjate en el hueco SIN avisos. ¿Por qué el móvil dejaría de avisar justo entonces?',
    'Si no hubo avisos, el dueño estaba cerca. Además, el dueño tuvo que estar en el polideportivo para meterlo en la mochila.',
  ],
  answerHelp: 'El nombre de la persona.',
  lesson: 'Los avisos de «rastreador desconocido» existen para detectar acoso. Si te aparece uno: no lo ignores, busca el objeto (el móvil puede hacerlo sonar), haz capturas y cuéntaselo a un adulto o a la policía.',
  tip: 'Activa las alertas de rastreadores desconocidos en el móvil y, si salta una, cuéntaselo a un adulto de confianza.',
};
