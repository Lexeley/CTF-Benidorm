import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';

const card = (k: string, name: string, dev: string, pkg: string, stats: string, cert: string, perms: string, origin: string) =>
  h('div', { class: 'card stack' },
    h('h3', {}, `[${k}] ${name}`),
    h('dl', { class: 'kv' },
      h('dt', {}, 'Desarrollador'), h('dd', {}, dev),
      h('dt', {}, 'Paquete'), h('dd', {}, pkg),
      h('dt', {}, 'Datos'), h('dd', {}, stats),
      h('dt', {}, 'Firma'), h('dd', {}, cert),
      h('dt', {}, 'Permisos'), h('dd', {}, perms),
      h('dt', {}, 'Origen'), h('dd', {}, origin)));

export const m2: Challenge = {
  id: 'm2',
  title: 'La actualización',
  difficulty: 'medio',
  story: [
    'Un amigo le pasa a Laura un enlace: «actualización de Brawl Stars con la temporada nueva antes que nadie». Antes de instalar nada, Laura compara lo que ya tiene en el móvil con lo que se va a instalar (fichas simuladas).',
    '¿Cuál es el nombre de paquete del malware?',
  ],
  render(el) {
    el.append(h('div', { class: 'grid' },
      card('A', 'Brawl Stars', 'Supercell', 'com.supercell.brawlstars', 'Instalada · v58.1 · Google Play',
        'Supercell Oy (SHA-256 7A:3F:…:C2)', 'Internet, Vibración, Notificaciones', 'Google Play'),
      card('B', 'Brawl Stars', 'Supercell', 'com.supercell.brawlstars.update', 'v59.0 · 48 MB',
        'Supercell Games Dev (SHA-256 1E:90:…:4B)', 'Internet, Vibración, Notificaciones, Servicio de accesibilidad, Instalar apps desconocidas', 'Enlace en Telegram (.apk)'),
      card('C', 'Brawl Stars', 'Supercell', 'com.supercell.brawlstars', 'v59.0 · actualización disponible',
        'Supercell Oy (SHA-256 7A:3F:…:C2)', 'Internet, Vibración, Notificaciones', 'Google Play'),
      card('D', 'Brawl Stats', 'BrawlTools', 'com.brawltools.stats', '1 M+ descargas · 4,4',
        'BrawlTools S.L. (SHA-256 55:01:…:9E)', 'Internet', 'Google Play')));
  },
  hints: [
    'El nombre y el desarrollador que se muestran los puede poner cualquiera. Lo que identifica a una app de verdad es el nombre de paquete y la firma del desarrollador.',
    'Una actualización legítima tiene el MISMO paquete y la MISMA firma que la app instalada. ¿Cuál no cumple ninguna de las dos?',
  ],
  answerHelp: 'El nombre de paquete completo (ej.: com.ejemplo.app).',
  lesson: 'Android solo deja actualizar una app si la nueva versión está firmada con la misma clave. Por eso el malware usa otro nombre de paquete y se instala como app aparte con el mismo icono y nombre. Las «actualizaciones antes que nadie» fuera de la tienda son un cebo clásico.',
  tip: 'Deja desactivado «Instalar apps desconocidas» y actualiza solo desde la tienda oficial.',
};
