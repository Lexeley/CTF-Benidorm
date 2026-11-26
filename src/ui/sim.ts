// Marcos "realistas" para las simulaciones: ventanas de escritorio y pantallas de móvil.
import { copyText, h } from './dom';
import { openInKit } from '../kit';

type Kid = Node | string | false | null | undefined;

/** Ventana de escritorio con barra de título. variant: '' | 'ps' (PowerShell) | 'light' (Bloc de notas). */
export function win(title: string, variant: '' | 'ps' | 'light', ...body: Kid[]): HTMLElement {
  return h('div', { class: `win ${variant}`, role: 'group', 'aria-label': `Ventana: ${title}` },
    h('div', { class: 'win-bar' }, h('span', {}, title), h('span', { class: 'win-ctrl', 'aria-hidden': 'true' }, '_  □  ×')),
    h('div', { class: 'win-body' }, ...body));
}

/** Pantalla de móvil con barra de estado y barra de la app. */
export function phone(time: string, app: string, ...body: Kid[]): HTMLElement {
  return h('div', { class: 'phone', role: 'group', 'aria-label': `Pantalla del móvil: ${app}` },
    h('div', { class: 'statusbar', 'aria-hidden': 'true' }, h('span', {}, time), h('span', {}, '4G  ▂▄▆█  87%')),
    h('div', { class: 'appbar' }, app),
    h('div', { class: 'phone-body' }, ...body));
}

/** Enlace simulado (no navega) con botones para copiarlo o mandarlo al inspector de URL. */
export function link(url: string, label?: string): HTMLElement {
  const st = h('span', { class: 'muted', role: 'status' });
  return h('span', { class: 'linkbox' },
    label ? h('span', { class: 'fake-btn', title: url }, label) : h('span', { class: 'fake-link' }, url),
    label && h('span', { class: 'fake-link small' }, url),
    h('span', { class: 'row', style: 'gap:.35rem' },
      h('button', { type: 'button', class: 'mini', onclick: async () => { st.textContent = (await copyText(url)) ? 'copiado' : 'no se pudo copiar'; } }, 'copiar'),
      h('button', { type: 'button', class: 'mini', onclick: () => openInKit('url', url) }, 'analizar en el kit'),
      st));
}

/** Botón "abrir en el kit" para cualquier texto (decodificador, etc.). */
export const toKit = (tool: string, value: string, label: string) =>
  h('button', { type: 'button', class: 'mini', onclick: () => openInKit(tool, value) }, label);

/** Avatar con iniciales y color estable. */
export function avatar(name: string, size = 40): HTMLElement {
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return h('span', { class: 'avatar', 'aria-hidden': 'true', style: `width:${size}px;height:${size}px;background:hsl(${hue} 45% 35%)` },
    name.replace(/[^A-Za-zÁÉÍÓÚÑ]/g, '').slice(0, 2).toUpperCase() || '?');
}
