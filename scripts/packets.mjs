// Captura de red simulada (reto e6) reproducible: PRNG con semilla fija.
// IPs de los rangos de documentación (RFC 5737) y dominios inventados.
import { writeFileSync } from 'node:fs';
import { loadSecrets, root } from './secrets.mjs';

const { e6 } = loadSecrets().params;
let seed = 20261126;
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const hex = (n) => Array.from({ length: n }, () => Math.floor(rnd() * 256).toString(16).padStart(2, '0')).join(' ');

const ME = '192.168.1.34', DNS = '192.168.1.1';
const sites = [
  ['cdn.streamnube.es', '203.0.113.21'], ['api.chatamigos.app', '203.0.113.55'], ['correo.mailnube.es', '198.51.100.12'],
  ['aula.iesrioclaro.es', '198.51.100.40'], ['img.fotored.app', '203.0.113.90'], ['tienda.ropaurbana.es', '198.51.100.77'],
  ['juegos.pixelarena.app', '203.0.113.130'], [e6.host, '198.51.100.200'],
];
const ipOf = Object.fromEntries(sites);
const pk = []; let t = 0;
const add = (p) => { t += 0.004 + rnd() * 0.09; pk.push({ no: pk.length + 1, t: +t.toFixed(6), ...p }); };
let port = 51000;

function dns(name) {
  const id = Math.floor(rnd() * 65535).toString(16).padStart(4, '0');
  add({ src: ME, dst: DNS, proto: 'DNS', len: 70 + name.length, sport: port, dport: 53, info: `Standard query 0x${id} A ${name}`, payload: `Consulta: ¿qué IP tiene ${name}?` });
  add({ src: DNS, dst: ME, proto: 'DNS', len: 86 + name.length, sport: 53, dport: port++, info: `Standard query response 0x${id} A ${name} A ${ipOf[name]}`, payload: `Respuesta: ${name} → ${ipOf[name]}` });
}
function handshake(ip, dport, sport) {
  add({ src: ME, dst: ip, proto: 'TCP', len: 66, sport, dport, info: `${sport} → ${dport} [SYN] Seq=0 Win=64240` });
  add({ src: ip, dst: ME, proto: 'TCP', len: 66, sport: dport, dport: sport, info: `${dport} → ${sport} [SYN, ACK] Seq=0 Ack=1` });
  add({ src: ME, dst: ip, proto: 'TCP', len: 54, sport, dport, info: `${sport} → ${dport} [ACK] Seq=1 Ack=1` });
}
function tlsSession(name, n) {
  const ip = ipOf[name], sport = port++;
  handshake(ip, 443, sport);
  add({ src: ME, dst: ip, proto: 'TLSv1.3', len: 571, sport, dport: 443, info: `Client Hello (SNI=${name})`, enc: true, payload: hex(48) });
  add({ src: ip, dst: ME, proto: 'TLSv1.3', len: 1514, sport: 443, dport: sport, info: 'Server Hello, Change Cipher Spec, Application Data', enc: true, payload: hex(48) });
  for (let i = 0; i < n; i++) {
    const out = rnd() < 0.4;
    add({ src: out ? ME : ip, dst: out ? ip : ME, proto: 'TLSv1.3', len: 90 + Math.floor(rnd() * 1400), sport: out ? sport : 443, dport: out ? 443 : sport, info: 'Application Data', enc: true, payload: hex(48) });
    if (rnd() < 0.3) add({ src: out ? ip : ME, dst: out ? ME : ip, proto: 'TCP', len: 54, sport: out ? 443 : sport, dport: out ? sport : 443, info: `[ACK] Win=${500 + Math.floor(rnd() * 3000)}` });
  }
}
function http(name, lines, body, respInfo) {
  const ip = ipOf[name], sport = port++;
  handshake(ip, 80, sport);
  const payload = [...lines, `Host: ${name}`, 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)', ...(body ? ['Content-Type: application/x-www-form-urlencoded', `Content-Length: ${body.length}`] : []), '', body ?? ''].join('\r\n');
  add({ src: ME, dst: ip, proto: 'HTTP', len: 54 + payload.length, sport, dport: 80, info: lines[0], payload });
  add({ src: ip, dst: ME, proto: 'HTTP', len: 240, sport: 80, dport: sport, info: respInfo, payload: `${respInfo}\r\nServer: nginx\r\nContent-Type: text/html; charset=utf-8\r\n\r\n<html>…</html>` });
}

const noise = () => { const s = pick(sites.slice(0, 7))[0]; if (rnd() < 0.5) dns(s); tlsSession(s, 2 + Math.floor(rnd() * 5)); };
for (let i = 0; i < 9; i++) noise();
dns(e6.host);
http(e6.host, ['GET /login.php HTTP/1.1'], null, 'HTTP/1.1 200 OK (text/html)');
for (let i = 0; i < 3; i++) noise();
http(e6.host, ['POST /api/stats HTTP/1.1'], 'evento=click&pagina=inicio', 'HTTP/1.1 204 No Content');
for (let i = 0; i < 2; i++) noise();
const creds = new URLSearchParams({ usuario: e6.user, clave: e6.password, recordar: '1' }).toString();
http(e6.host, ['POST /login.php HTTP/1.1'], creds, 'HTTP/1.1 302 Found  (Location: /panel.php)');
for (let i = 0; i < 10; i++) noise();

writeFileSync(`${root}src/generated/packets.json`, JSON.stringify({ name: 'wifi-cafeteria.pcap', packets: pk }) + '\n');
console.log(`packets.json: ${pk.length} paquetes`);
