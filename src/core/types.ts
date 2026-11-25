export type Mode = 'escritorio' | 'movil';
export type Difficulty = 'facil' | 'medio' | 'dificil';
export const POINTS: Record<Difficulty, number> = { facil: 100, medio: 200, dificil: 300 };
export const DIFF_LABEL: Record<Difficulty, string> = { facil: 'Fácil', medio: 'Medio', dificil: 'Difícil' };

export interface Attachment { label: string; url: string; filename: string }

export interface RenderCtx {
  /** Rellena el campo de respuesta (para widgets de marcar/ordenar). */
  fill(answer: string): void;
}

/** Un reto = un fichero de datos tipado en src/challenges/<modo>/. */
export interface Challenge {
  id: string;                 // clave en src/generated/answers.json
  title: string;
  story: string[];            // párrafos
  difficulty: Difficulty;
  bonus?: boolean;
  hints: [string, string];
  answerHelp: string;         // formato esperado de la respuesta
  attachments?: Attachment[];
  render?: (el: HTMLElement, ctx: RenderCtx) => void;
  lesson: string;             // se muestra al resolverlo
  tip: string;                // "ajuste que haría hoy mismo" para el resumen final
}
