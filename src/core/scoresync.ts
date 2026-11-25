import { decodeTeam, encodeTeam, type TeamData } from './teamcode';

/**
 * Punto de enchufe del marcador. Hoy: LocalScoreSync (localStorage del dispositivo del profe,
 * alimentado pegando/escaneando códigos). Para tiempo real, implementa esta interfaz con
 * Supabase/Firebase y cámbiala en `scoreSync` abajo: ni el juego ni /profe cambian.
 */
export interface ScoreSync {
  publish(team: TeamData): Promise<void>;
  list(): Promise<TeamData[]>;
  remove(name: string, mode: TeamData['m']): Promise<void>;
  clear(): Promise<void>;
}

const KEY = 'ctf-lucia:marcador';
const id = (t: Pick<TeamData, 'n' | 'm'>) => `${t.m}:${t.n.trim().toLowerCase()}`;

export class LocalScoreSync implements ScoreSync {
  private read(): Record<string, string> {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }
  private write(m: Record<string, string>) {
    try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* sin storage */ }
  }
  async publish(team: TeamData) {
    const m = this.read();
    const prev = m[id(team)] ? decodeTeam(m[id(team)]) : null;
    // Un mismo equipo puede mandar varios códigos: nos quedamos con el más avanzado.
    if (!prev || team.s.length > prev.s.length || (team.s.length === prev.s.length && team.p >= prev.p)) {
      m[id(team)] = encodeTeam(team);
      this.write(m);
    }
  }
  async list() {
    return Object.values(this.read()).flatMap((c) => { try { return [decodeTeam(c)]; } catch { return []; } });
  }
  async remove(name: string, mode: TeamData['m']) {
    const m = this.read(); delete m[id({ n: name, m: mode })]; this.write(m);
  }
  async clear() { this.write({}); }
}

export const scoreSync: ScoreSync = new LocalScoreSync();
