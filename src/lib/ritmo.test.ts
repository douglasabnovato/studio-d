import { describe, expect, it } from 'vitest';
import { contarPalavras, formatarFala, PALAVRAS_POR_MINUTO, segundosDeFala } from './ritmo';

describe('tempo de fala estimado (#85)', () => {
  it('conta palavras sem o Markdown que não se lê em voz alta', () => {
    expect(contarPalavras('- Este catálogo **nasceu** num curso de `React`.')).toBe(7);
    expect(contarPalavras('Veja [o guia](https://exemplo.com/guia) agora.')).toBe(4);
    expect(contarPalavras('A meta é 2,5 s.')).toBe(5);
  });

  it('fala vazia dá zero', () => {
    expect(contarPalavras('')).toBe(0);
    expect(segundosDeFala('')).toBe(0);
  });

  it('usa 145 palavras por minuto', () => {
    expect(PALAVRAS_POR_MINUTO).toBe(145);
    const fala = Array.from({ length: 145 }, () => 'palavra').join(' ');
    expect(segundosDeFala(fala)).toBe(60);
  });

  it('formata em segundos abaixo de um minuto e em minutos a partir dele', () => {
    expect(formatarFala(40)).toBe('40 s');
    expect(formatarFala(60)).toBe('1 min');
    expect(formatarFala(347)).toBe('6 min');
  });
});
