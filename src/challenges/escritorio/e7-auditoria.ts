import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { pickList } from '../widgets';

const item = (area: string, setting: string, value: string) =>
  h('span', {}, h('span', { class: 'muted' }, `${area} · `), `${setting}: `, h('strong', {}, value));

export const e7: Challenge = {
  id: 'e7',
  title: 'Auditoría rápida',
  difficulty: 'facil',
  bonus: true,
  story: [
    'Captura del «Centro de seguridad del sistema» del portátil de Lucía (simulado).',
    'Hay exactamente 3 ajustes mal configurados. Márcalos.',
  ],
  render(el, ctx) {
    el.append(h('div', { class: 'card', style: 'border-color:#6cc4ff' },
      h('h3', {}, '🛡 Centro de seguridad del sistema'),
      pickList(ctx, 'Ajustes mal configurados', [
        { key: 'A', node: item('Antivirus', 'Último análisis rápido', 'hace 2 días · 0 amenazas') },
        { key: 'B', node: item('Antivirus', 'Protección en tiempo real', 'Desactivada por el usuario hace 21 días') },
        { key: 'C', node: item('Cortafuegos', 'Red privada (casa)', 'Activado') },
        { key: 'D', node: item('Cuenta', 'Bloqueo automático de pantalla', 'A los 5 minutos') },
        { key: 'E', node: item('Cortafuegos', 'Red pública (wifi de bares, estaciones…)', 'Desactivado') },
        { key: 'F', node: item('Navegador', 'Filtro de webs y descargas peligrosas', 'Activado') },
        { key: 'G', node: item('Actualizaciones', 'Estado', 'En pausa · última instalación hace 64 días') },
        { key: 'H', node: item('Copia de seguridad', 'Carpeta Documentos', 'Sincronizada ayer') },
      ])));
  },
  hints: [
    'Piensa en las tres capas básicas: antivirus funcionando, cortafuegos encendido y sistema actualizado.',
    'Uno es del antivirus, otro del cortafuegos y otro de las actualizaciones.',
  ],
  answerHelp: 'Las 3 letras en orden alfabético (ej.: ACF).',
  lesson: 'Antivirus en tiempo real, cortafuegos en todas las redes (sobre todo las públicas) y actualizaciones al día cierran la mayoría de puertas a los ataques automáticos.',
  tip: 'Revisa hoy el centro de seguridad: antivirus activo, cortafuegos encendido y actualizaciones sin pausar.',
};
