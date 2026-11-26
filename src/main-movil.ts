import './styles.css';
import { startGame } from './ui/game';
import { movil } from './challenges/movil';
import { fechaMovil, movilAbierto } from './core/state';
import { h } from './ui/dom';
import { logo } from './ui/logo';

if (movilAbierto()) startGame('movil', 'El móvil de Laura', movil);
else document.getElementById('app')!.append(
  h('div', { class: 'home-hero' }, logo(),
    h('h1', {}, 'El móvil de Laura'),
    h('p', {}, `Estos retos se abren el ${fechaMovil()}.`),
    h('p', { class: 'muted' }, 'Mientras tanto, prueba «El portátil de Laura».'),
    h('p', {}, h('a', { class: 'btn primary', href: '../escritorio/' }, 'Ir al portátil'))));
