import { describe, expect, it } from 'vitest';
import { lerExecucao, mediana, resumirLcp, type Relatorio } from './medir-lcp';

/** Um JSON mínimo com o formato do Lighthouse 12 (o nó do LCP numa tabela dentro de uma lista). */
const relatorio = (lcp: number, tbt: number, seletor = 'main > p.destaque-resumo'): Relatorio => ({
  audits: {
    'largest-contentful-paint': { numericValue: lcp },
    'total-blocking-time': { numericValue: tbt },
    'largest-contentful-paint-element': {
      details: { items: [{ items: [{ node: { selector: seletor, nodeLabel: 'Resumo' } }] }, { items: [] }] },
    },
  },
});
const contexto = { url: 'https://douglasabnovato.github.io/studio-d/', pacote: 'index-abc.js', data: '18/11/2026 21:00 (Brasília)' };

describe('lerExecucao (#59)', () => {
  it('lê LCP, TBT e o seletor do elemento', () => {
    expect(lerExecucao('a.json', relatorio(1730, 62))).toEqual({ arquivo: 'a.json', lcpMs: 1730, tbtMs: 62, elemento: 'main > p.destaque-resumo' });
  });

  it('aceita o nó direto no item (formato antigo)', () => {
    const r: Relatorio = { audits: { ...relatorio(1, 1).audits, 'largest-contentful-paint-element': { details: { items: [{ node: { selector: 'h1' } }] } } } };
    expect(lerExecucao('a.json', r).elemento).toBe('h1');
  });

  it('marca como inválida a execução com erro do Lighthouse ou sem métrica', () => {
    expect(lerExecucao('a.json', { runtimeError: { code: 'NO_FCP' } }).invalida).toBe('erro do Lighthouse: NO_FCP');
    expect(lerExecucao('b.json', { audits: {} }).invalida).toBe('sem LCP ou TBT no relatório');
  });
});

describe('mediana', () => {
  it('com número ímpar e par de valores', () => {
    expect(mediana([1870, 1730, 1730])).toBe(1730);
    expect(mediana([4, 1, 3, 2])).toBe(2.5);
  });
});

describe('resumirLcp (#59)', () => {
  const execucoes = (...lcps: number[]) => lcps.map((l, i) => lerExecucao(`lh-${i + 1}.json`, relatorio(l, 50 + i)));

  it('passa com a mediana até 2,5 s e escreve as três execuções', () => {
    const r = resumirLcp(execucoes(1870, 1730, 1730), contexto);
    expect(r.passou).toBe(true);
    expect(r.medianaMs).toBe(1730);
    expect(r.markdown).toContain('**Mediana do LCP: 1,73 s**');
    expect(r.markdown).toContain('| 1 | 1,87 s | 50 ms | `main > p.destaque-resumo` |');
    expect(r.markdown).toContain('`index-abc.js`');
  });

  it('falha com a mediana acima de 2,5 s', () => {
    const r = resumirLcp(execucoes(2600, 2700, 1800), contexto);
    expect(r.passou).toBe(false);
    expect(r.markdown).toMatch(/2,60 s\*\*, acima do limite de 2,50 s/);
  });

  it('o limite é inclusivo: 2,5 s passa', () => {
    expect(resumirLcp(execucoes(2500, 2500, 2500), contexto).passou).toBe(true);
  });

  it('falha com menos de 3 execuções válidas, sem calcular mediana', () => {
    const r = resumirLcp([...execucoes(1700, 1800), lerExecucao('lh-3.json', { runtimeError: { code: 'NO_FCP' } })], contexto);
    expect(r.passou).toBe(false);
    expect(r.medianaMs).toBeUndefined();
    expect(r.markdown).toContain('só 2 execuções válidas');
    expect(r.markdown).toContain('| 3 | inválida: erro do Lighthouse: NO_FCP | | |');
  });
});
