import { h } from '../ui/dom';
export function renderKit(): HTMLElement {
  return h('section', {}, h('h1', {}, 'Kit'), h('p', {}, 'Próximamente'));
}
