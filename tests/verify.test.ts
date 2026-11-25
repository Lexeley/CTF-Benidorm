import { describe, expect, it } from 'vitest';
import { normalize } from '../src/core/normalize';
import { answerHash, checkAnswer, sha256Hex, type AnswerEntry } from '../src/core/verify';

describe('normalize', () => {
  it('minúsculas, sin tildes ni espacios extra', () => {
    expect(normalize('  Templo   de  DEBOD ')).toBe('templo de debod');
    expect(normalize('Chamberí')).toBe('chamberi');
  });
  it('modo compact quita separadores', () => {
    expect(normalize('A, c - E', 'compact')).toBe('ace');
    expect(normalize('DE:AD:4B:9F', 'compact')).toBe('dead4b9f');
  });
});

describe('verificación de respuestas', () => {
  it('sha256 conocido', async () => {
    expect(await sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  const make = async (mode: AnswerEntry['mode'], ...accept: string[]): Promise<AnswerEntry> => {
    const salt = 'sal-de-prueba';
    return { mode, salt, hashes: await Promise.all(accept.map((a) => answerHash(salt, normalize(a, mode)))) };
  };

  it('acepta la respuesta con distinto formato', async () => {
    const e = await make('text', 'templo de debod', 'debod');
    expect(await checkAnswer('Templo de  Debod', e)).toBe(true);
    expect(await checkAnswer('DEBOD ', e)).toBe(true);
    expect(await checkAnswer('templo', e)).toBe(false);
    expect(await checkAnswer('', e)).toBe(false);
  });

  it('compact admite letras con comas o espacios', async () => {
    const e = await make('compact', 'ACDE');
    expect(await checkAnswer('a, c, d, e', e)).toBe(true);
    expect(await checkAnswer('acd', e)).toBe(false);
  });

  it('la sal cambia el hash', async () => {
    expect(await answerHash('a', 'x')).not.toBe(await answerHash('b', 'x'));
  });
});
