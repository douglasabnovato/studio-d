import { describe, expect, it } from 'vitest';
import { fraseDaMeta, hojeIso, metaDaHipotese } from './meta';

describe('meta do MVP pelos roteiros (#80)', () => {
  it('sem vídeo publicado, o relógio ainda não começou', () => {
    const m = metaDaHipotese([], '2026-11-24');
    expect(m).toEqual({ estado: 'sem-inicio' });
    expect(fraseDaMeta(m)).toBe('Meta do MVP: 4 vídeos em 30 dias. O relógio começa no 1º vídeo publicado.');
  });

  it('com 1 publicado, conta a partir dele', () => {
    const m = metaDaHipotese(['2026-11-24'], '2026-11-24');
    expect(m).toMatchObject({ estado: 'em-andamento', publicados: 1, inicio: '2026-11-24', fim: '2026-12-23', diasRestantes: 29 });
    expect(fraseDaMeta(m)).toBe('Meta do MVP: 1 de 4 vídeos publicados em 30 dias · faltam 29 dias (até 23/12).');
  });

  it('com 4 publicados dentro da janela, a meta é atingida', () => {
    const m = metaDaHipotese(['2026-11-24', '2026-12-01', '2026-12-08', '2026-12-15'], '2026-12-16');
    expect(m).toMatchObject({ estado: 'em-andamento', publicados: 4, diasRestantes: 7 });
  });

  it('um vídeo depois do 30º dia não conta', () => {
    const m = metaDaHipotese(['2026-11-24', '2026-12-23', '2026-12-24'], '2027-01-05');
    expect(m).toMatchObject({ estado: 'encerrada', publicados: 2, fim: '2026-12-23' });
    expect(fraseDaMeta(m)).toBe('Meta do MVP: 2 de 4 vídeos publicados em 30 dias (de 24/11 a 23/12, encerrada).');
  });

  it('no último dia, diz "último dia"; com 1 dia, usa o singular', () => {
    expect(fraseDaMeta(metaDaHipotese(['2026-11-24'], '2026-12-23'))).toContain('último dia');
    expect(fraseDaMeta(metaDaHipotese(['2026-11-24'], '2026-12-22'))).toContain('faltam 1 dia');
  });

  it('a data de hoje sai no fuso local', () => {
    expect(hojeIso(new Date(2026, 10, 24, 23, 59))).toBe('2026-11-24');
  });
});
