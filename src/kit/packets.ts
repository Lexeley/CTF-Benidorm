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

function hexdump(p: Packet): string {
  const bytes = p.enc && p.payload
    ? p.payload.split(' ').map((x) => parseInt(x, 16))
    : [...new TextEncoder().encode(p.payload ?? '')];
  if (!bytes.length) return '(sin datos de aplicación)';
  const lines: string[] = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const chunk = bytes.slice(i, i + 16);
    const hex = chunk.map((b) => b.toString(16).padStart(2, '0')).join(' ').padEnd(47, ' ');
    const ascii = chunk.map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : '.')).join('');
    lines.push(`${i.toString(16).padStart(4, '0')}  ${hex}  ${ascii}`);
  }
  return lines.join('\n');
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
    const udp = p.proto === 'DNS';
    const layer = (title: string, open: boolean, ...lines: string[]) =>
      h('details', { open }, h('summary', {}, title), ...lines.map((l) => h('div', {}, l)));
    const app = p.proto === 'HTTP'
      ? layer('Hypertext Transfer Protocol', true, ...(p.payload ?? '').split('\r\n').filter((l, i, arr) => l || i < arr.length - 1).map((l) => l || '(línea vacía: aquí empieza el cuerpo)'))
      : p.proto === 'DNS' ? layer('Domain Name System', true, p.info, p.payload ?? '')
      : p.enc ? layer('Transport Layer Security', true, `TLSv1.3 Record Layer: ${p.info}`, 'Contenido cifrado: no se puede leer sin la clave de la sesión')
      : null;
    detail.replaceChildren(
      h('h3', {}, `Paquete ${p.no}: ${p.proto}`),
      h('div', { class: 'tree' },
        layer(`Frame ${p.no}: ${p.len} bytes capturados`, false, `Tiempo relativo: ${p.t.toFixed(6)} s`, 'Interfaz: wlan0'),
        layer('Ethernet II', false, 'Origen: 3c:22:fb:51:0a:9e', 'Destino: 3c:84:6a:11:20:01'),
        layer(`Internet Protocol Version 4, Src: ${p.src}, Dst: ${p.dst}`, false, `Origen: ${p.src}`, `Destino: ${p.dst}`, `TTL: ${p.src.startsWith('192.168') ? 128 : 54}`),
        p.sport ? layer(`${udp ? 'User Datagram Protocol' : 'Transmission Control Protocol'}, Src Port: ${p.sport}, Dst Port: ${p.dport}`, false, `Puerto origen: ${p.sport}`, `Puerto destino: ${p.dport}`) : null,
        app),
      h('h3', {}, 'Bytes'),
      h('div', { class: 'card' }, h('div', { class: 'hexdump', 'aria-label': 'Volcado hexadecimal' }, hexdump(p))));
  };

  const render = () => {
    const f = filter.value.trim().toLowerCase();
    const rows = cap.packets.filter((p) => matches(p, f));
    count.textContent = `${rows.length} de ${cap.packets.length} paquetes`;
    tbody.replaceChildren(...rows.map((p) => {
      const tr = h('tr', { tabindex: 0, class: `ws-proto-${p.proto}` },
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
