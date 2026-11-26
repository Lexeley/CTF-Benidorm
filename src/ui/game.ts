import qrcode from 'qrcode-generator';
import answersJson from '../generated/answers.json';
import { checkAnswer, type AnswerEntry } from '../core/verify';
import { DIFF_LABEL, POINTS, type Challenge, type Mode } from '../core/types';
import {
  GAME_SECONDS, clearState, earned, elapsedSeconds, hintPenalty, loadState, saveState, totalPoints, type GameState,
} from '../core/state';
import { encodeTeam, type TeamData } from '../core/teamcode';
import { scoreSync } from '../core/scoresync';
import { confirmDialog, copyText, fmtTime, h } from './dom';
import { logo } from './logo';
import { prefetchKit, renderKit } from '../kit';

const answers = answersJson as Record<string, AnswerEntry>;


export function startGame(mode: Mode, title: string, list: Challenge[]): void {
  const app = document.getElementById('app')!;
  let s: GameState = loadState(mode);
  const save = () => saveState(mode, s);
  const samples = list.flatMap((c) => c.attachments ?? []).filter((a) => /\.jpe?g$/i.test(a.filename)).map((a) => ({ label: a.filename, url: a.url }));

  const timerEl = h('span', { class: 'timer', 'aria-label': 'Tiempo restante' }, '35:00');
  const pointsEl = h('span', {}, '0 pts');
  const teamEl = h('span', { class: 'muted' });
  const live = h('div', { class: 'sr-only', 'aria-live': 'assertive' });
  const view = h('div');
  const tabs = h('nav', { class: 'tabs', role: 'tablist', 'aria-label': 'Secciones' });
  let timeUpAnnounced = false;

  app.replaceChildren(
    h('header', { class: 'topbar' },
      h('a', { class: 'title', href: '../', 'aria-label': `${title}. Volver al inicio` }, title),
      h('div', { class: 'stats' }, teamEl, pointsEl, timerEl)),
    tabs, view, live);

  function teamData(): TeamData {
    return {
      n: s.team, m: mode, p: totalPoints(s, list),
      k: list.filter((c) => c.id in s.solved).length,
      h: Object.values(s.hints).reduce((a, b) => a + b, 0),
      t: Math.max(0, ...Object.values(s.solved)),
    };
  }

  function tick() {
    const left = s.startedAt ? GAME_SECONDS - elapsedSeconds(s) : GAME_SECONDS;
    timerEl.textContent = left > 0 ? fmtTime(left) : '00:00 TIEMPO';
    timerEl.className = `timer${left <= 0 ? ' over' : left <= 300 ? ' low' : ''}`;
    if (left <= 0 && s.startedAt && !timeUpAnnounced) {
      timeUpAnnounced = true;
      live.textContent = 'Se acabó el tiempo. Avisad al profe.';
    }
  }
  function refreshTop() {
    pointsEl.textContent = `${totalPoints(s, list)} pts`;
    teamEl.textContent = s.team ? s.team : '';
    tick();
  }
  setInterval(tick, 1000);

  // ---------- Rutas (hash, para que funcione el botón atrás sin servidor) ----------
  function route() {
    refreshTop();
    if (!s.team || !s.startedAt) { tabs.replaceChildren(); return view.replaceChildren(setupView()); }
    const hash = decodeURIComponent(location.hash.slice(1));
    const [section, arg] = hash.split('/');
    renderTabs(section === 'reto' || !section ? 'retos' : section);
    let node: HTMLElement;
    if (section === 'reto') {
      const c = list.find((x) => x.id === arg);
      node = c ? challengeView(c) : listView();
    } else if (section === 'kit') node = renderKit(samples);
    else if (section === 'equipo') node = teamView();
    else if (section === 'resumen') node = summaryView();
    else node = listView();
    view.replaceChildren(node);
    const h1 = view.querySelector('h1');
    if (h1 && hash) { h1.setAttribute('tabindex', '-1'); h1.focus(); }
  }
  addEventListener('hashchange', route);

  function renderTabs(active: string) {
    const items: [string, string][] = [['retos', 'retos'], ['kit', 'kit'], ['equipo', 'equipo']];
    tabs.replaceChildren(...items.map(([id, label]) =>
      h('a', { class: 'btn', role: 'tab', href: `#${id}`, 'aria-selected': String(active === id) }, label)));
  }

  // ---------- Alta de equipo ----------
  function setupView() {
    const input = h('input', { id: 'team', maxlength: 24, required: true, autocomplete: 'off', value: s.team, placeholder: 'p. ej. Los Cortafuegos' });
    const form = h('form', { class: 'card stack', onsubmit: (e: Event) => {
      e.preventDefault();
      const name = input.value.trim().replace(/\s+/g, ' ');
      if (!name) return input.focus();
      s.team = name;
      s.startedAt = Date.now();
      save();
      location.hash = 'retos';
      route();
    } },
      logo(true),
      h('h1', {}, title),
      h('pre', { class: 'card', style: 'color:var(--fg)' }, [
        'EXPEDIENTE ............ LAURA M. G.',
        'Edad .................. 17 (1º Bachillerato, IES Río Claro, Madrid)',
        `Dispositivo ........... ${mode === 'escritorio' ? 'portátil Windows 11 «PORTATIL-LAURA»' : 'móvil Android (Samsung Galaxy A54)'}`,
        'Le gusta .............. el Atleti, su perra Kira, Instagram',
        'Encargo ............... Laura os ha dejado su ' + (mode === 'escritorio' ? 'portátil' : 'móvil') + ' para una auditoría.',
        '                        Encontrad todo lo que podría usar un atacante.',
        '',
        'Laura y su entorno son ficticios. Las marcas reales aparecen como ejemplo;',
        'los mensajes, webs y capturas son simulaciones.',
      ].join('\n')),
      h('p', { class: 'muted' }, `Tenéis ${GAME_SECONDS / 60} minutos y ${list.length} retos. El tiempo empieza al pulsar «Empezar».`),
      h('label', { for: 'team' }, 'Nombre del equipo'),
      input,
      h('button', { class: 'primary', type: 'submit' }, 'Empezar'));
    queueMicrotask(() => input.focus());
    return form;
  }

  // ---------- Lista de retos ----------
  function listView() {
    const solvedN = list.filter((c) => c.id in s.solved).length;
    return h('section', {},
      h('h1', {}, 'Retos'),
      h('p', { class: 'muted' }, `${solvedN}/${list.length} resueltos · ${totalPoints(s, list)} puntos`),
      h('div', { class: 'grid' }, ...list.map((c, i) => {
        const solved = c.id in s.solved;
        return h('a', { class: 'btn card chal', href: `#reto/${c.id}` },
          h('span', { class: 'name' }, `${i + 1}. ${c.title}`),
          h('span', { class: 'badges' },
            h('span', { class: 'badge' }, c.category),
            h('span', { class: `badge ${c.difficulty}` }, `${DIFF_LABEL[c.difficulty]} · ${POINTS[c.difficulty]}`),
            c.bonus && h('span', { class: 'badge' }, 'Bonus'),
            solved && h('span', { class: 'badge solved' }, `resuelto +${earned(c, s.hints[c.id] ?? 0)}`),
            !solved && (s.hints[c.id] ?? 0) > 0 && h('span', { class: 'badge' }, `pistas: ${s.hints[c.id]}`)));
      })),
      solvedN === list.length && h('p', {}, h('a', { class: 'btn primary', href: '#resumen' }, 'Todo resuelto. Ver resumen')));
  }

  // ---------- Vista de un reto ----------
  function challengeView(c: Challenge) {
    const solved = c.id in s.solved;
    const used = s.hints[c.id] ?? 0;
    const entry = answers[c.id];
    const input = h('input', { id: `ans-${c.id}`, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', disabled: solved });
    const feedback = h('p', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
    const submit = h('button', { class: 'primary', type: 'submit', disabled: solved }, 'Comprobar');
    const widget = h('div', { class: 'stack' });
    c.render?.(widget, { fill: (a) => { if (!solved) { input.value = a; input.focus(); } } });

    let cooldownUntil = 0;
    const form = h('form', { class: 'card stack', onsubmit: async (e: Event) => {
      e.preventDefault();
      if (solved || Date.now() < cooldownUntil || !input.value.trim()) return;
      if (!entry) { feedback.textContent = 'Este reto no tiene respuesta configurada (npm run answers).'; return; }
      submit.disabled = true;
      if (await checkAnswer(input.value, entry)) {
        s.solved[c.id] = elapsedSeconds(s);
        save();
        void scoreSync.publish(teamData());
        live.textContent = `Correcto. +${earned(c, used)} puntos`;
        route();
        return;
      }
      s.wrong[c.id] = (s.wrong[c.id] ?? 0) + 1;
      save();
      // Enfriamiento creciente para desanimar el "probar a lo loco" en retos de pocas opciones.
      const wait = Math.min(5 * s.wrong[c.id], 30);
      cooldownUntil = Date.now() + wait * 1000;
      const countdown = () => {
        const left = Math.ceil((cooldownUntil - Date.now()) / 1000);
        if (left > 0) { feedback.textContent = `Incorrecto. Espera ${left}s para volver a intentarlo.`; setTimeout(countdown, 250); }
        else { feedback.textContent = 'Incorrecto.'; submit.disabled = false; }
      };
      feedback.className = 'feedback err';
      countdown();
    } },
      h('label', { for: `ans-${c.id}` }, 'Respuesta'),
      h('p', { class: 'muted', id: `help-${c.id}` }, c.answerHelp),
      input,
      h('div', { class: 'row' }, submit),
      feedback);
    input.setAttribute('aria-describedby', `help-${c.id}`);

    const hints = h('section', { class: 'stack', 'aria-label': 'Pistas' }, h('h2', {}, 'Pistas'),
      ...c.hints.map((text, i) => {
        if (i < used) return h('p', { class: 'hint' }, h('strong', {}, `Pista ${i + 1}: `), text);
        const cost = hintPenalty(c, 1);
        return h('button', {
          disabled: solved || i > used,
          onclick: async () => {
            if (!(await confirmDialog(`¿Abrir la pista ${i + 1}? El reto pasará a valer ${cost} puntos menos.`, 'Abrir pista'))) return;
            s.hints[c.id] = i + 1;
            save();
            route();
          },
        }, `Ver pista ${i + 1} (-${cost} pts)`);
      }));

    return h('article', { class: 'stack' },
      h('p', {}, h('a', { href: '#retos' }, '< volver')),
      h('h1', {}, c.title),
      h('div', { class: 'badges' },
        h('span', { class: 'badge' }, c.category),
        h('span', { class: `badge ${c.difficulty}` }, DIFF_LABEL[c.difficulty]),
        h('span', { class: 'badge' }, solved ? `resuelto: ${earned(c, used)} pts` : `${earned(c, used)} pts`),
        c.bonus && h('span', { class: 'badge' }, 'Bonus')),
      ...c.story.map((p) => h('p', {}, p)),
      c.attachments?.length && h('div', { class: 'row' }, ...c.attachments.map((a) =>
        h('a', { class: 'btn', href: a.url, download: a.filename }, a.label))),
      widget,
      solved
        ? h('div', { class: 'lesson', role: 'status' }, h('p', {}, h('strong', {}, 'Correcto. ')), h('p', {}, c.lesson))
        : form,
      hints);
  }

  // ---------- Equipo y código ----------
  function codeBlock() {
    const code = encodeTeam(teamData());
    const qr = qrcode(0, 'M');
    qr.addData(`${code} ${s.team}`);
    qr.make();
    const status = h('span', { role: 'status', class: 'muted' });
    return h('div', { class: 'card stack' },
      h('h2', {}, 'Código de equipo'),
      h('img', { src: qr.createDataURL(5, 4), alt: 'Código QR del equipo', width: 260, height: 260, style: 'image-rendering: pixelated; background:#fff; border-radius:8px' }),
      h('p', { class: 'team-code', 'aria-label': 'Código de equipo' }, code),
      h('div', { class: 'row' },
        h('button', { onclick: async () => { status.textContent = (await copyText(code)) ? 'Copiado' : 'No se pudo copiar: selecciónalo y usa Ctrl+C'; } }, 'Copiar código'),
        status));
  }

  function teamView() {
    const d = teamData();
    return h('section', { class: 'stack' },
      h('h1', {}, `Equipo: ${s.team}`),
      h('dl', { class: 'kv' },
        h('dt', {}, 'Puntos'), h('dd', {}, String(d.p)),
        h('dt', {}, 'Resueltos'), h('dd', {}, `${d.k}/${list.length}`),
        h('dt', {}, 'Pistas usadas'), h('dd', {}, String(d.h)),
        h('dt', {}, 'Tiempo'), h('dd', {}, fmtTime(elapsedSeconds(s)))),
      h('p', {}, h('a', { class: 'btn primary', href: '#resumen' }, 'Resumen final')),
      codeBlock(),
      h('details', { class: 'card' },
        h('summary', {}, 'Opciones (para el profe)'),
        h('p', { class: 'muted' }, 'Borra el progreso de este navegador para que juegue otro equipo.'),
        h('button', { class: 'danger', onclick: async () => {
          if (!(await confirmDialog('¿Borrar todo el progreso de este equipo en este navegador? No se puede deshacer.', 'Borrar'))) return;
          clearState(mode);
          s = loadState(mode);
          location.hash = '';
          route();
        } }, 'Reiniciar partida')));
  }

  // ---------- Resumen final ----------
  function summaryView() {
    const solved = list.filter((c) => c.id in s.solved);
    const pending = list.filter((c) => !(c.id in s.solved));
    const tips = [...solved, ...pending].slice(0, 3);
    return h('section', { class: 'stack' },
      h('h1', {}, 'Resumen'),
      h('p', {}, `${s.team}: ${totalPoints(s, list)} puntos · ${solved.length}/${list.length} retos · ${fmtTime(elapsedSeconds(s))}`),
      h('div', { class: 'card stack' },
        h('h2', {}, '3 ajustes que haría hoy mismo'),
        h('ol', {}, ...tips.map((c) => h('li', {}, h('strong', {}, `${c.title}: `), c.tip,
          !(c.id in s.solved) ? h('span', { class: 'muted' }, ' (reto pendiente)') : '')))),
      solved.length > 0 && h('details', { class: 'card' },
        h('summary', {}, 'Lo que habéis aprendido'),
        ...solved.map((c) => h('p', {}, h('strong', {}, `${c.title}: `), c.lesson))),
      codeBlock());
  }

  route();
  prefetchKit();
}
