import './styles.css';
import { h } from './ui/dom';
import { logo } from './ui/logo';
import { fechaMovil, movilAbierto } from './core/state';

const app = document.getElementById('app')!;
app.append(
  h('div', { class: 'home-hero' },
    logo(),

    h('h1', {}, 'CTF: los dispositivos de Laura'),
    h('p', { class: 'muted' }, 'Laura tiene 17 años y es un personaje inventado. Investiga sus dispositivos, encuentra los fallos de seguridad y aprende a no cometerlos tú.')),
  h('div', { class: 'grid' },
    h('a', { class: 'card mode-card', href: 'escritorio/' },
            h('h2', {}, 'El portátil de Laura'),
      h('p', { class: 'muted' }, 'Contraseñas, phishing, metadatos, cifrado y tráfico de red. 7 retos.')),
    h('a', { class: 'card mode-card', href: 'movil/' },
            h('h2', {}, 'El móvil de Laura'),
      h('p', { class: 'muted' }, 'Permisos, apps falsas, SMS, wifi trampa, ubicación y rastreadores. 7 retos.'),
      !movilAbierto() && h('p', {}, h('span', { class: 'badge' }, `Se abre el ${fechaMovil()}`)))),
  h('h2', {}, 'Cómo se juega'),
  h('ul', {},
    h('li', {}, 'Equipos de 3-4. Poned un nombre y pulsad «Empezar»: tenéis 35 minutos.'),
    h('li', {}, 'Cada reto da 100, 200 o 300 puntos. Las pistas restan puntos.'),
    h('li', {}, 'En la pestaña «Kit» tenéis todas las herramientas. No hace falta instalar nada ni salir de esta web.')),
  h('p', { class: 'muted' }, 'Laura y su entorno son ficticios. Las marcas reales aparecen solo como ejemplo educativo: ningún mensaje ni web de aquí es suyo. No se envía ningún dato a ningún sitio; el progreso se guarda solo en este navegador.'),
);
