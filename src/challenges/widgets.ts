// Piezas reutilizables para los retos interactivos. Sin drag&drop: todo con botones y teclado.
import type { RenderCtx } from '../core/types';
import { h } from '../ui/dom';

let n = 0;

/** Lista con casillas (A, B, C…); el botón vuelca las letras marcadas al campo de respuesta. */
export function pickList(ctx: RenderCtx, legend: string, items: { key: string; node: Node }[], single = false): HTMLElement {
  const name = `pick-${++n}`;
  const inputs = items.map((it) => h('input', { type: single ? 'radio' : 'checkbox', name, value: it.key, id: `${name}-${it.key}` }) as HTMLInputElement);
  return h('fieldset', { class: 'stack', style: 'border:0;padding:0;margin:0' },
    h('legend', { class: 'sr-only' }, legend),
    // La etiqueta solo envuelve la letra: así el contenido (enlaces, texto) se puede seleccionar y copiar.
    ...items.map((it, i) => h('div', { class: 'pick' }, inputs[i],
      h('label', { for: inputs[i].id, class: 'pick-key' }, `${it.key}.`),
      h('div', { style: 'flex:1;min-width:0' }, it.node))),
    h('button', { type: 'button', onclick: () => ctx.fill(inputs.filter((x) => x.checked).map((x) => x.value).join('')) }, 'Usar lo marcado como respuesta'));
}

/** Cada elemento se clasifica con dos opciones (p. ej. Fraude / Legítimo). */
export function classifyList(ctx: RenderCtx, items: { key: string; node: Node }[], options: [string, string][]): HTMLElement {
  const groups = items.map((it) => {
    const name = `cls-${++n}`;
    const radios = options.map(([val, label]) => {
      const id = `${name}-${val}`;
      return [h('input', { type: 'radio', name, value: val, id }) as HTMLInputElement, h('label', { for: id, style: 'display:inline;margin:0 .75rem 0 .25rem' }, label)] as const;
    });
    return { it, radios };
  });
  return h('div', { class: 'stack' },
    ...groups.map(({ it, radios }) => h('fieldset', { class: 'card stack' },
      h('legend', { class: 'mono' }, `Mensaje ${it.key}`), it.node,
      h('div', { class: 'row pick' }, ...radios.flat()))),
    h('button', { type: 'button', onclick: () => ctx.fill(groups.map(({ radios }) => radios.find(([r]) => r.checked)?.[0].value ?? '?').join('')) },
      'Usar la clasificación como respuesta'));
}

/** Ordenar con botones ↑ ↓ (accesible con teclado y táctil). */
export function orderList(ctx: RenderCtx, items: { key: string; text: string }[]): HTMLElement {
  const order = [...items];
  const ol = h('ol', { class: 'stack', style: 'padding-left:1.5rem' });
  const live = h('p', { class: 'sr-only', 'aria-live': 'polite' });
  const draw = (focusKey?: string, dir?: string) => {
    ol.replaceChildren(...order.map((it, i) => h('li', { class: 'card' },
      h('div', { class: 'row', style: 'justify-content:space-between;flex-wrap:nowrap' },
        h('span', {}, h('strong', { class: 'mono' }, `${it.key}. `), it.text),
        h('span', { class: 'row', style: 'flex-wrap:nowrap' },
          h('button', { type: 'button', 'aria-label': `Subir ${it.key}`, 'data-k': `${it.key}up`, disabled: i === 0, onclick: () => move(i, -1) }, '↑'),
          h('button', { type: 'button', 'aria-label': `Bajar ${it.key}`, 'data-k': `${it.key}down`, disabled: i === order.length - 1, onclick: () => move(i, 1) }, '↓'))))));
    if (focusKey) (ol.querySelector(`[data-k="${focusKey}${dir}"]:not([disabled])`) as HTMLElement | null ?? ol.querySelector(`[data-k^="${focusKey}"]:not([disabled])`) as HTMLElement | null)?.focus();
  };
  const move = (i: number, d: number) => {
    [order[i], order[i + d]] = [order[i + d], order[i]];
    live.textContent = `${order[i + d].key} ahora en la posición ${i + d + 1}`;
    draw(order[i + d].key, d < 0 ? 'up' : 'down');
  };
  draw();
  return h('div', { class: 'stack' }, ol, live,
    h('button', { type: 'button', onclick: () => ctx.fill(order.map((x) => x.key).join('')) }, 'Usar este orden como respuesta'));
}

/** Enlace simulado: no navega; se puede copiar o mandar al inspector del kit. */
export { link as fakeLink } from '../ui/sim';
