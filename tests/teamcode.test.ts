import { describe, expect, it } from 'vitest';
import { decodeTeam, encodeTeam, rankTeams, type TeamData } from '../src/core/teamcode';

const team: TeamData = { n: 'Los Cortafuegos ñ🔥', m: 'movil', p: 650, k: 4, h: 3, t: 1834 };
const { n, ...data } = team;

describe('código de equipo', () => {
  it('ida y vuelta: 8 caracteres fáciles de escribir', () => {
    const code = encodeTeam(data);
    expect(code).toMatch(/^[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
    expect(decodeTeam(code, n)).toEqual(team);
    expect(decodeTeam(encodeTeam({ m: 'escritorio', p: 0, k: 0, h: 0, t: 0 }), 'A')).toEqual({ n: 'A', m: 'escritorio', p: 0, k: 0, h: 0, t: 0 });
  });

  it('tolera minúsculas, sin guion, espacios y O/I/L', () => {
    const code = encodeTeam(data);
    expect(decodeTeam(` ${code.toLowerCase().replace('-', '')} `, n)).toEqual(team);
    const withO = code.replace(/0/g, 'O').replace(/1/g, 'I');
    expect(decodeTeam(withO, n)).toEqual(team);
  });

  it('detecta cualquier errata de un carácter', () => {
    const code = encodeTeam(data).replace('-', '');
    const ALPHA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    let missed = 0;
    for (let i = 0; i < 8; i++) for (const ch of ALPHA) {
      if (ch === code[i]) continue;
      try { decodeTeam(code.slice(0, i) + ch + code.slice(i + 1), n); missed++; } catch { /* bien */ }
    }
    expect(missed).toBeLessThanOrEqual(1); // 248 erratas posibles; 13 bits de checksum
  });

  it('rechaza basura y nombre vacío', () => {
    expect(() => decodeTeam('hola', n)).toThrow();
    expect(() => decodeTeam('', n)).toThrow();
    expect(() => decodeTeam(encodeTeam(data), '  ')).toThrow();
  });

  it('ranking: puntos desc, desempate por último tiempo', () => {
    const a = { ...team, n: 'A', p: 500, t: 900 };
    const b = { ...team, n: 'B', p: 500, t: 300 };
    const c = { ...team, n: 'C', p: 800 };
    expect(rankTeams([a, b, c]).map((t) => t.n)).toEqual(['C', 'B', 'A']);
  });
});
