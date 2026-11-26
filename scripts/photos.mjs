// Genera las fotos de los retos (dibujo procedural, sin fotos reales) con EXIF GPS.
import { writeFileSync } from 'node:fs';
import jpeg from 'jpeg-js';
import piexif from 'piexifjs';
import { loadSecrets, root } from './secrets.mjs';

const { e4, m6 } = loadSecrets().params;
const W = 640, H = 480;

function canvas(draw) {
  const data = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const [r, g, b] = draw(x, y);
    const i = (y * W + x) * 4;
    data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
  }
  return jpeg.encode({ data, width: W, height: H }, 85).data;
}
const lerp = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

// Atardecer con un templo de columnas reflejado en un estanque (silueta genérica).
const sunset = canvas((x, y) => {
  if (y < 300) {
    const sun = Math.hypot(x - 560, y - 120) < 34;
    if (sun) return [255, 214, 120];
    const temple = (y > 170 && y < 300 && x > 200 && x < 420) &&
      (y < 195 || y > 285 || ((x - 200) % 36) < 18); // frontón + columnas + base
    const gx = x > 80 && x < 150 ? x - 80 : x > 470 && x < 540 ? x - 470 : -1; // dos puertas de piedra
    const gate = gx >= 0 && y > 200 && y < 300 && (y < 216 || gx < 14 || gx > 56);
    if (temple || gate) return [40, 22, 30];
    return lerp([70, 40, 110], [255, 140, 70], y / 300);
  }
  // estanque: reflejo oscurecido y ondulado
  const ry = 600 - y + Math.round(Math.sin(x / 9 + y) * 2);
  const temple = (ry > 170 && ry < 300 && x > 200 && x < 420) && (ry < 195 || ry > 285 || ((x - 200) % 36) < 18);
  return temple ? [30, 20, 35] : lerp([200, 110, 70], [40, 30, 70], (y - 300) / 180);
});

// Calle con edificios, un árbol y un autobús (escena genérica de barrio).
const street = canvas((x, y) => {
  if (y > 400) return (x % 80 < 40 && y > 435 && y < 445) ? [230, 230, 230] : [60, 60, 66];
  if (y > 370) return [150, 145, 140];
  const b = Math.floor(x / 128), top = [120, 160, 100, 140, 110][b];
  if (y > top) {
    const win = (x % 128) > 14 && (x % 32) < 18 && (y - top) % 40 > 12 && (y - top) % 40 < 30;
    return win ? [190, 220, 240] : [[200, 120, 90], [215, 190, 150], [170, 110, 90], [225, 205, 170], [180, 140, 110]][b];
  }
  return lerp([120, 180, 235], [200, 225, 245], y / 160);
});

function withExif(img, p) {
  const gps = piexif.GPSHelper;
  const exif = piexif.dump({
    '0th': {
      [piexif.ImageIFD.Make]: 'Nimbus', [piexif.ImageIFD.Model]: 'Nimbus S7',
      [piexif.ImageIFD.Software]: 'NimbusCam 4.2', [piexif.ImageIFD.ImageDescription]: p.description,
      [piexif.ImageIFD.DateTime]: p.date,
    },
    Exif: { [piexif.ExifIFD.DateTimeOriginal]: p.date },
    GPS: {
      [piexif.GPSIFD.GPSLatitudeRef]: p.lat >= 0 ? 'N' : 'S', [piexif.GPSIFD.GPSLatitude]: gps.degToDmsRational(Math.abs(p.lat)),
      [piexif.GPSIFD.GPSLongitudeRef]: p.lon >= 0 ? 'E' : 'W', [piexif.GPSIFD.GPSLongitude]: gps.degToDmsRational(Math.abs(p.lon)),
    },
  });
  return Buffer.from(piexif.insert(exif, img.toString('binary')), 'binary');
}

writeFileSync(`${root}src/generated/foto-portatil.jpg`, withExif(sunset, e4));
writeFileSync(`${root}src/generated/foto-movil.jpg`, withExif(street, m6));
console.log('fotos: OK');
