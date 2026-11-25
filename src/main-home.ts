import './styles.css';
import { h } from './ui/dom';

const app = document.getElementById('app')!;
app.append(
  h('div', { class: 'home-hero' },
    h('pre', { 'aria-hidden': 'true' }, '  _     _   _  ___ ___   _   \n | |   | | | |/ __|_ _| /_\\  \n | |__ | |_| | (__ | | / _ \\ \n |____| \\___/ \\___|___/_/ \\_\\'),
    h('h1', {}, 'CTF: los dispositivos de Lucía'),
    h('p', { class: 'muted' }, 'Lucía tiene 17 años y es un personaje inventado. Investiga sus dispositivos, encuentra los fallos de seguridad y aprende a no cometerlos tú.')),
  h('div', { class: 'grid' },
    h('a', { class: 'card mode-card', href: 'escritorio/' },
      h('div', { class: 'icon', 'aria-hidden': 'true' }, '💻'),
      h('h2', {}, 'El portátil de Lucía'),
      h('p', { class: 'muted' }, 'Contraseñas, phishing, metadatos, cifrado y tráfico de red. 7 retos.')),
    h('a', { class: 'card mode-card', href: 'movil/' },
      h('div', { class: 'icon', 'aria-hidden': 'true' }, '📱'),
      h('h2', {}, 'El móvil de Lucía'),
      h('p', { class: 'muted' }, 'Permisos, apps falsas, SMS, wifi trampa, ubicación y rastreadores. 7 retos.'))),
  h('h2', {}, 'Cómo se juega'),
  h('ul', {},
    h('li', {}, 'Equipos de 3-4. Poned un nombre y pulsad «Empezar»: tenéis 35 minutos.'),
    h('li', {}, 'Cada reto da 100, 200 o 300 puntos. Las pistas restan puntos.'),
    h('li', {}, 'En la pestaña «Kit» tenéis todas las herramientas. No hace falta instalar nada ni salir de esta web.'),
    h('li', {}, 'Al final, enseñad vuestro código de equipo (o QR) al profe.')),
  h('p', { class: 'muted' }, 'Todo es ficticio: personas, marcas y webs son inventadas. No se envía ningún dato a ningún sitio; el progreso se guarda solo en este navegador.'),
  h('p', {}, h('a', { href: 'profe/' }, 'Marcador del profe →')),
);
