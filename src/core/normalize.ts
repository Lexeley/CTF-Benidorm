// Sin imports ni sintaxis TS no borrable: lo usan también los scripts de Node (type stripping).
export type NormMode = 'text' | 'compact';

/**
 * text:    minúsculas, sin tildes, sin espacios extra ("  Templo  de Debod " -> "templo de debod")
 * compact: además quita todo lo que no sea letra o número ("A, C, E" -> "ace", "DE:AD:4B" -> "dead4b")
 */
export function normalize(input: string, mode: NormMode = 'text'): string {
  const t = input.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
  return mode === 'compact' ? t.replace(/[^a-z0-9]/g, '') : t;
}
