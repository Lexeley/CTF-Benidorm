type Child = Node | string | number | false | null | undefined;
type Attrs = Record<string, string | number | boolean | EventListener | undefined | null>;

/** Crea un elemento. Atributos `on*` = listeners; texto siempre como textContent (sin innerHTML). */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
  for (const c of children) if (c !== false && c !== null && c !== undefined) el.append(c instanceof Node ? c : String(c));
  return el;
}

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T | null;

/** Diálogo de confirmación accesible (<dialog> nativo: foco atrapado y Esc). */
export function confirmDialog(message: string, okLabel = 'Sí', cancelLabel = 'Cancelar'): Promise<boolean> {
  return new Promise((resolve) => {
    const dlg = h('dialog', { 'aria-labelledby': 'dlg-msg' },
      h('p', { id: 'dlg-msg' }, message),
      h('div', { class: 'row' },
        h('button', { class: 'primary', value: 'ok', onclick: () => dlg.close('ok') }, okLabel),
        h('button', { value: 'no', onclick: () => dlg.close('no') }, cancelLabel)));
    dlg.addEventListener('close', () => { resolve(dlg.returnValue === 'ok'); dlg.remove(); });
    document.body.append(dlg);
    dlg.showModal();
  });
}

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

export const fmtTime = (secs: number) => {
  const s = Math.max(0, Math.floor(secs));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
