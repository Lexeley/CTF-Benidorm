import type { Challenge } from '../../core/types';
import { checkAnswer, type AnswerEntry } from '../../core/verify';
import answersJson from '../../generated/answers.json';
import { h } from '../../ui/dom';

const SMUDGED = new Set(['1', '3', '0', '8']);
const MAX_TRIES = 5;     // como Android: tras 5 fallos, espera
const LOCK_SECS = 30;

/** Pantalla de bloqueo con teclado: las teclas manchadas llevan marca de grasa. Comprueba el PIN contra el hash del reto. */
function lockScreen(onUnlock: (pin: string) => void): HTMLElement {
  let pin = '';
  let fails = 0;
  let lockedUntil = 0;
  const dots = h('div', { class: 'lock-dots', 'aria-live': 'polite', 'aria-label': 'PIN introducido: 0 de 4 cifras' });
  const msg = h('p', { class: 'lock-msg', role: 'status' }, 'Introduce el PIN');
  const keys: HTMLButtonElement[] = [];

  const drawDots = () => {
    dots.replaceChildren(...[0, 1, 2, 3].map((i) => h('span', { class: i < pin.length ? 'on' : '' })));
    dots.setAttribute('aria-label', `PIN introducido: ${pin.length} de 4 cifras`);
  };
  const setDisabled = (d: boolean) => keys.forEach((k) => { k.disabled = d; });

  const countdown = () => {
    const left = Math.ceil((lockedUntil - Date.now()) / 1000);
    if (left > 0) { msg.textContent = `Demasiados intentos. Vuelve a intentarlo en ${left} s`; setTimeout(countdown, 1000); return; }
    fails = 0; setDisabled(false); msg.textContent = 'Introduce el PIN';
  };

  const press = async (d: string) => {
    if (Date.now() < lockedUntil || pin.length >= 4) return;
    pin += d; drawDots();
    if (pin.length < 4) return;
    setDisabled(true);
    const ok = await checkAnswer(pin, (answersJson as Record<string, AnswerEntry>).m7);
    if (ok) { msg.textContent = 'Desbloqueado'; screen.classList.add('unlocked'); onUnlock(pin); return; }
    fails++;
    screen.classList.add('shake'); setTimeout(() => screen.classList.remove('shake'), 400);
    pin = ''; drawDots();
    if (fails >= MAX_TRIES) { lockedUntil = Date.now() + LOCK_SECS * 1000; countdown(); return; }
    msg.textContent = `PIN incorrecto · ${MAX_TRIES - fails} intento${MAX_TRIES - fails === 1 ? '' : 's'} antes de esperar ${LOCK_SECS} s`;
    setDisabled(false);
  };

  const key = (d: string) => {
    const smudge = SMUDGED.has(d);
    const b = h('button', {
      type: 'button', class: `lock-key${smudge ? ' smudge' : ''}`,
      'aria-label': `${d}${smudge ? ', con marca de grasa' : ''}`, onclick: () => press(d),
    }, d) as HTMLButtonElement;
    keys.push(b);
    return b;
  };

  const screen = h('div', { class: 'lock', role: 'group', 'aria-label': 'Pantalla de bloqueo del móvil de Laura' },
    h('div', { class: 'statusbar', 'aria-hidden': 'true' }, h('span', {}, 'Movistar'), h('span', {}, '4G  ▂▄▆█  64%')),
    h('div', { class: 'lock-clock' }, '23:47'),
    h('div', { class: 'lock-date' }, 'miércoles, 12 de agosto'),
    h('div', { class: 'notif' },
      h('div', { class: 'app' }, h('span', {}, 'Calendario'), h('span', {}, '23:00')),
      h('b', {}, 'Mañana'), h('br'), 'Cumple de Vega 🎂 · todo el día'),
    msg, dots,
    h('div', { class: 'lock-pad' },
      ...['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(key), h('span'), key('0'),
      h('button', { type: 'button', class: 'lock-key del', 'aria-label': 'Borrar', onclick: () => { pin = pin.slice(0, -1); drawDots(); } }, '⌫')),
  );
  drawDots();
  return screen;
}

export const m7: Challenge = {
  id: 'm7',
  title: 'Manchas en la pantalla',
  difficulty: 'medio',
  category: 'Físico',
  story: [
    'Laura se ha dejado el móvil en la mesa de la cafetería mientras pedía. Es de noche y la pantalla tiene brillos: a contraluz se ven marcas de grasa de sus dedos en cuatro teclas.',
    'Esto se llama «smudge attack» (ataque de manchas): las teclas que más tocas quedan marcadas y delatan las cifras del PIN. Solo falta adivinar el orden.',
    'Desbloquea el móvil. Cuidado: como en un Android de verdad, tras 5 fallos tendrás que esperar 30 segundos.',
  ],
  render(el, ctx) {
    el.append(lockScreen((pin) => ctx.fill(pin)));
  },
  hints: [
    'Con 4 cifras distintas hay 4 × 3 × 2 × 1 = 24 órdenes posibles. Pero la gente rara vez elige un PIN al azar: muchos son fechas (día y mes).',
    'Mira la fecha de la pantalla de bloqueo y el aviso del calendario: ¿qué día es el cumple de Vega? Escríbelo como DDMM.',
  ],
  answerHelp: 'El PIN de 4 cifras.',
  lesson: 'Las manchas reducen 10.000 PIN posibles a solo 24, y una fecha conocida lo deja en uno. Limpia la pantalla, usa un PIN de 6 cifras que no sea una fecha y deja que el móvil se bloquee y espere tras varios fallos: es lo que hace inviable probar a lo loco.',
  tip: 'Cambia el PIN del móvil por uno de 6 cifras que no sea una fecha ni un patrón, y limpia la pantalla de vez en cuando.',
};
