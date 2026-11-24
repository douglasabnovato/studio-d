import { describe, expect, it } from 'vitest';
import {
  contarPalavras,
  excessoDeFala,
  falaPassaDoBloco,
  formatarFala,
  PALAVRAS_POR_MINUTO,
  segundosDeFala,
  segundosDeTela,
  velocidadeDoBloco,
  VELOCIDADE_RESERVA,
} from './ritmo';

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

  it('avisa só quando a fala passa da janela do bloco (#90)', () => {
    expect(falaPassaDoBloco(45, '0:00', '0:45')).toBe(false);
    expect(falaPassaDoBloco(46, '0:00', '0:45')).toBe(true);
    expect(falaPassaDoBloco(30, '0:45', '2:30')).toBe(false);
    expect(falaPassaDoBloco(0, '1:00', '1:00')).toBe(false);
  });

  it('diz quantos segundos a fala passa do bloco (#90)', () => {
    expect(excessoDeFala(57, '0:00', '0:45')).toBe(12);
    expect(excessoDeFala(40, '0:00', '0:45')).toBe(0);
  });
});

describe('velocidade por bloco (#83)', () => {
  it('divide a altura do bloco pelo tempo de fala', () => {
    expect(velocidadeDoBloco(600, 30)).toBe(20);
    expect(velocidadeDoBloco(600, 30, 1.5)).toBe(30);
  });

  it('usa a velocidade de reserva sem fala ou sem altura', () => {
    expect(velocidadeDoBloco(600, 0)).toBe(VELOCIDADE_RESERVA);
    expect(velocidadeDoBloco(0, 30, 0.5)).toBe(VELOCIDADE_RESERVA * 0.5);
  });

  it('o tempo de tela é a janela menos a fala, nunca negativo', () => {
    expect(segundosDeTela(34, '0:00', '0:45')).toBe(11);
    expect(segundosDeTela(60, '0:00', '0:45')).toBe(0);
  });
});
