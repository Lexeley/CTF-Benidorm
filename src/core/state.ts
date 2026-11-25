import { POINTS, type Challenge, type Mode } from './types';

export const GAME_SECONDS = 35 * 60;
export const HINT_COST = 0.25; // cada pista resta el 25% del valor del reto

export interface GameState {
  v: 1;
  team: string;
  startedAt: number | null;            // epoch ms
  hints: Record<string, number>;       // pistas abiertas por reto (0-2)
  solved: Record<string, number>;      // segundos desde el inicio al resolver
  wrong: Record<string, number>;       // intentos fallidos (para el enfriamiento)
}

const key = (mode: Mode) => `ctf-lucia:${mode}`;
const empty = (): GameState => ({ v: 1, team: '', startedAt: null, hints: {}, solved: {}, wrong: {} });

export function loadState(mode: Mode): GameState {
  try {
    const raw = localStorage.getItem(key(mode));
    if (raw) { const s = JSON.parse(raw); if (s?.v === 1) return { ...empty(), ...s }; }
  } catch { /* modo privado o storage bloqueado: seguimos en memoria */ }
  return empty();
}

export function saveState(mode: Mode, s: GameState): void {
  try { localStorage.setItem(key(mode), JSON.stringify(s)); } catch { /* en memoria */ }
}

export function clearState(mode: Mode): void {
  try { localStorage.removeItem(key(mode)); } catch { /* nada */ }
}

export const hintPenalty = (c: Challenge, used: number) => Math.round(POINTS[c.difficulty] * HINT_COST) * used;
export const earned = (c: Challenge, used: number) => POINTS[c.difficulty] - hintPenalty(c, used);

export function totalPoints(s: GameState, list: Challenge[]): number {
  return list.reduce((sum, c) => (c.id in s.solved ? sum + earned(c, s.hints[c.id] ?? 0) : sum), 0);
}

export function elapsedSeconds(s: GameState, now = Date.now()): number {
  return s.startedAt ? Math.max(0, Math.floor((now - s.startedAt) / 1000)) : 0;
}
