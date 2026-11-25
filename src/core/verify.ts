import { normalize, type NormMode } from './normalize.ts';

/** Lo único que llega al bundle por reto: sal + hashes de las respuestas aceptadas. */
export interface AnswerEntry { mode: NormMode; salt: string; hashes: string[] }

export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const answerHash = (salt: string, normalized: string) => sha256Hex(`${salt}:${normalized}`);

export async function checkAnswer(input: string, entry: AnswerEntry): Promise<boolean> {
  const n = normalize(input, entry.mode);
  if (!n) return false;
  return entry.hashes.includes(await answerHash(entry.salt, n));
}
