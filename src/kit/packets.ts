import { h } from '../ui/dom';

export interface Packet {
  no: number; t: number; src: string; dst: string; proto: string; len: number; info: string;
  sport?: number; dport?: number; payload?: string; enc?: boolean;
}
export interface Capture { name: string; packets: Packet[] }

export const loadCapture = async (): Promise<Capture> => (await import('../generated/packets.json')).default as Capture;

function matches(p: Packet, f: string): boolean {
  if (!f) return true;
  const ip = f.match(/^ip\.addr\s*==\s*([\d.]+)$/);
  if (ip) return p.src === ip[1] || p.dst === ip[1];
  const port = f.match(/^(?:tcp\.)?port\s*==\s*(\d+)$/);
  if (port) return String(p.sport) === port[1] || String(p.dport) === port[1];
  if (['http', 'dns', 'tcp', 'tls'].includes(f)) return p.proto.toLowerCase().startsWith(f);
  return `${p.src} ${p.dst} ${p.proto} ${p.info}`.toLowerCase().includes(f);
}

/** Visor tipo Wireshark: tabla filtrable + panel de detalle. */
export function packetViewer(cap: Capture): HTMLElement {
  const filter = h('input', { type: 'search', id: 'pkt-filter', placeholder: 'http · dns · tls · ip.addr==192.168.1.1 · port==80 · texto', autocomplete: 'off' });
  const count = h('span', { class: 'muted', role: 'status' });
  const tbody = h('tbody');
  const detail = h('div', { class: 'card stack', 'aria-live': 'polite' }, h('p', { class: 'muted' }, 'Selecciona un paquete para ver su contenido.'));
  let selected: HTMLTableRowElement | null = null;

  const show = (p: Packet, tr: HTMLTableRowElement) => {
    selected?.classList.remove('sel');
    tr.classList.add('sel');
    selected = tr;
    detail.replaceChildren(
      h('h3', {}, `Paquete ${p.no} · ${p.proto}`),
      h('dl', { class: 'kv' },
        h('dt', {}, 'Tiempo'), h('dd', {}, `${p.t.toFixed(6)} s`),
        h('dt', {}, 'Origen'), h('dd', {}, `${p.src}${p.sport ? `:${p.sport}` : ''}`),
        h('dt', {}, 'Destino'), h('dd', {}, `${p.dst}${p.dport ? `:${p.dport}` : ''}`),
        h('dt', {}, 'Longitud'), h('dd', {}, `${p.len} bytes`)),
      p.payload
        ? h('div', {}, h('p', {}, h('strong', {}, p.enc ? 'Datos (cifrados con TLS, ilegibles):' : 'Datos (en claro):')), h('pre', {}, p.payload))
        : h('p', { class: 'muted' }, 'Paquete de control TCP, sin datos de aplicación.'));
  };

  const render = () => {
    const f = filter.value.trim().toLowerCase();
    const rows = cap.packets.filter((p) => matches(p, f));
    count.textContent = `${rows.length} de ${cap.packets.length} paquetes`;
    tbody.replaceChildren(...rows.map((p) => {
      const tr = h('tr', { tabindex: 0 },
        ...[p.no, p.t.toFixed(3), p.src, p.dst, p.proto, p.len, p.info].map((v) => h('td', {}, String(v))));
      tr.addEventListener('click', () => show(p, tr));
      tr.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(p, tr); } });
      return tr;
    }));
  };
  filter.addEventListener('input', render);
  render();

  return h('div', { class: 'stack' },
    h('p', { class: 'muted' }, `Captura: ${cap.name}`),
    h('label', { for: 'pkt-filter' }, 'Filtro'),
    filter, count,
    h('div', { class: 'table-wrap', style: 'max-height: 50vh' },
      h('table', {},
        h('thead', {}, h('tr', {}, ...['N.º', 'Tiempo', 'Origen', 'Destino', 'Protocolo', 'Long.', 'Info'].map((x) => h('th', { scope: 'col' }, x)))),
        tbody)),
    detail);
}
