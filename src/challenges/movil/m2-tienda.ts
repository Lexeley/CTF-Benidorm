import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { phone } from '../../ui/sim';

interface App { k: string; name: string; dev: string; pkg: string; ver: string; src: string; cert: string; perms: string[]; color: string; note: string }

const apps: App[] = [
  { k: 'A', name: 'Brawl Stars', dev: 'Supercell', pkg: 'com.supercell.brawlstars', ver: '58.1 (instalada)', src: 'Google Play Store', cert: 'CN=Supercell Oy · SHA-256 7A:3F:91:…:0D:C2', perms: ['Internet', 'Vibración', 'Notificaciones'], color: '#f5b400', note: 'App instalada' },
  { k: 'B', name: 'Brawl Stars', dev: 'Supercell', pkg: 'com.supercell.brawlstars.update', ver: '59.0', src: 'Archivo .apk descargado de Telegram', cert: 'CN=Supercell Games Dev · SHA-256 1E:90:4C:…:7A:4B', perms: ['Internet', 'Vibración', 'Notificaciones', 'Servicio de accesibilidad', 'Instalar apps desconocidas', 'Mostrar sobre otras apps'], color: '#f5b400', note: 'Pantalla de instalación del .apk' },
  { k: 'C', name: 'Brawl Stars', dev: 'Supercell', pkg: 'com.supercell.brawlstars', ver: '59.0 (actualización)', src: 'Google Play Store', cert: 'CN=Supercell Oy · SHA-256 7A:3F:91:…:0D:C2', perms: ['Internet', 'Vibración', 'Notificaciones'], color: '#f5b400', note: 'Actualización en Google Play' },
  { k: 'D', name: 'Brawl Stats', dev: 'BrawlTools', pkg: 'com.brawltools.stats', ver: '3.2.1', src: 'Google Play Store', cert: 'CN=BrawlTools S.L. · SHA-256 55:01:AE:…:3B:9E', perms: ['Internet'], color: '#3a7bd5', note: 'Ficha en Google Play' },
];

const sheet = (a: App) => phone('20:11', a.note,
  h('div', { style: 'display:flex;gap:.75rem;align-items:center' },
    h('span', { class: 'store-ico', style: `background:${a.color}`, 'aria-hidden': 'true' }, a.name.slice(0, 2).toUpperCase()),
    h('div', {}, h('b', {}, `[${a.k}] ${a.name}`), h('br'), h('span', { style: 'color:#8ab4f8;font-size:.85rem' }, a.dev))),
  h('div', { class: 'set-item' }, h('span', {}, 'Versión'), h('span', {}, a.ver)),
  h('div', { class: 'set-item' }, h('span', {}, 'Origen'), h('span', { style: 'text-align:right' }, a.src)),
  h('details', {}, h('summary', { style: 'font-size:.85rem;padding:.4rem 0' }, 'Información técnica'),
    h('div', { class: 'set-item' }, h('span', {}, 'Paquete'), h('span', { class: 'mono', style: 'font-size:.78rem;word-break:break-all;text-align:right' }, a.pkg)),
    h('div', { class: 'set-item' }, h('span', {}, 'Firma'), h('span', { class: 'mono', style: 'font-size:.72rem;word-break:break-all;text-align:right' }, a.cert))),
  h('details', {}, h('summary', { style: 'font-size:.85rem;padding:.4rem 0' }, `Permisos (${a.perms.length})`),
    h('ul', { style: 'font-size:.85rem;margin:.2rem 0' }, ...a.perms.map((p) => h('li', {}, p)))));

export const m2: Challenge = {
  id: 'm2',
  title: 'La actualización',
  difficulty: 'medio',
  category: 'Malware',
  story: [
    'Un amigo le pasa a Laura por Telegram un archivo: «actualización de Brawl Stars con la temporada nueva antes que nadie». Antes de instalar nada, Laura compara lo que ya tiene con lo que se va a instalar (pantallas simuladas).',
    '¿Cuál es el nombre de paquete del malware?',
  ],
  render(el) {
    el.append(h('div', { class: 'grid' }, ...apps.map(sheet)));
  },
  hints: [
    'El nombre, el icono y el desarrollador que se muestran los puede poner cualquiera. Lo que identifica a una app de verdad es el nombre de paquete y la firma (en «Información técnica»).',
    'Una actualización legítima tiene el MISMO paquete y la MISMA firma que la app instalada. ¿Cuál no cumple ninguna de las dos?',
  ],
  answerHelp: 'El nombre de paquete completo (ej.: com.ejemplo.app).',
  lesson: 'Android solo deja actualizar una app si la nueva versión está firmada con la misma clave. Por eso el malware usa otro nombre de paquete y se instala como app aparte con el mismo icono y nombre. Las «actualizaciones antes que nadie» fuera de la tienda son un cebo clásico.',
  tip: 'Deja desactivado «Instalar apps desconocidas» y actualiza solo desde la tienda oficial.',
};
