import { describe, expect, it } from 'vitest';
import { decodeTeam, encodeTeam, rankTeams, type TeamData } from '../src/core/teamcode';

const team: TeamData = { n: 'Los Cortafuegos ñ🔥', m: 'escritorio', p: 650, s: [['e1', 0, 120], ['e3', 1, 600]], h: 2 };

describe('código de equipo', () => {
  it('ida y vuelta (incluye unicode)', () => {
    const code = encodeTeam(team);
    expect(code.startsWith('LU1.')).toBe(true);
    expect(code).toMatch(/^[A-Za-z0-9._-]+$/); // base64url, copiable y apto para QR
    expect(decodeTeam(code)).toEqual(team);
  });

  it('tolera espacios y saltos de línea al pegar', () => {
    const code = encodeTeam(team);
    expect(decodeTeam(`  ${code.slice(0, 10)}\n${code.slice(10)} `)).toEqual(team);
  });

  it('rechaza códigos cortados, alterados o ajenos', () => {
    const code = encodeTeam(team);
    expect(() => decodeTeam(code.slice(0, -3))).toThrow();
    expect(() => decodeTeam(code.replace('LU1.e', 'LU1.f'))).toThrow();
    expect(() => decodeTeam('hola')).toThrow();
    expect(() => decodeTeam('')).toThrow();
  });

  it('rechaza estructura inválida aunque el checksum cuadre', () => {
    const bad = encodeTeam({ ...team, m: 'otro' as never });
    expect(() => decodeTeam(bad)).toThrow();
  });

  it('ranking: puntos desc, desempate por último tiempo', () => {
    const a = { ...team, n: 'A', p: 500, s: [['e1', 0, 900]] as TeamData['s'] };
    const b = { ...team, n: 'B', p: 500, s: [['e1', 0, 300]] as TeamData['s'] };
    const c = { ...team, n: 'C', p: 800 };
    expect(rankTeams([a, b, c]).map((t) => t.n)).toEqual(['C', 'B', 'A']);
  });
});
