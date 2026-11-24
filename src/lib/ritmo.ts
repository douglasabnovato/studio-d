/**
 * Tempo de fala estimado (#85). Conta as palavras da seção "### Fala" e divide pelo
 * ritmo natural de leitura em voz alta em português (de 130 a 160 palavras por
 * minuto; usamos 145). O resto do tempo do bloco é tela: demonstração, comando e pausa.
 */
import { emSegundos } from './tipos';

export const PALAVRAS_POR_MINUTO = 145;

/** Palavras faladas: tira o Markdown que não se lê em voz alta (marcas, links e HTML). */
export function contarPalavras(fala: string): number {
  const limpo = fala
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#|]/g, ' ');
  return (limpo.match(/[\p{L}\p{N}][\p{L}\p{N}'’.,-]*/gu) ?? []).length;
}

/** Segundos de fala, arredondados para o segundo mais próximo. */
export function segundosDeFala(fala: string): number {
  return Math.round((contarPalavras(fala) / PALAVRAS_POR_MINUTO) * 60);
}

/** "40 s" abaixo de um minuto; "6 min" a partir dele (arredondado). */
export function formatarFala(segundos: number): string {
  if (segundos < 60) return `${segundos} s`;
  return `${Math.round(segundos / 60)} min`;
}

/** Segundos de fala além da janela do bloco (fim − início); 0 quando cabe. Igual ao tempo ainda cabe (#90). */
export function excessoDeFala(falaSegundos: number, inicio: string, fim: string): number {
  return Math.max(0, falaSegundos - (emSegundos(fim) - emSegundos(inicio)));
}

/** A fala estimada passa da janela do bloco? (#90) */
export function falaPassaDoBloco(falaSegundos: number, inicio: string, fim: string): boolean {
  return excessoDeFala(falaSegundos, inicio, fim) > 0;
}
