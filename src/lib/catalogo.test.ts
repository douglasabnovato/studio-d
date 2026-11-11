import { describe, expect, it } from 'vitest';
import { catalogo, destaque, montarCatalogo } from './catalogo';
import { emSegundos } from './roteiro';

describe('catálogo real (roteiros/)', () => {
  it('tem pelo menos um roteiro e cinco séries', () => {
    expect(catalogo.roteiros.length).toBeGreaterThan(0);
    expect(catalogo.series.length).toBeGreaterThanOrEqual(5);
  });

  it('cada roteiro aponta para um repositório no formato dono/nome', () => {
    for (const r of catalogo.roteiros) expect(r.repositorio).toMatch(/^[\w.-]+\/[\w.-]+$/);
  });

  it('cada bloco começa onde o anterior terminou', () => {
    for (const r of catalogo.roteiros) {
      expect(r.blocos[0].inicio).toBe('0:00');
      for (let i = 1; i < r.blocos.length; i++) {
        expect(r.blocos[i].inicio, `${r.slug}: bloco ${r.blocos[i].nome}`).toBe(r.blocos[i - 1].fim);
        expect(emSegundos(r.blocos[i].fim)).toBeGreaterThan(emSegundos(r.blocos[i].inicio));
      }
    }
  });

  it('os capítulos do YouTube batem com o início dos blocos', () => {
    for (const r of catalogo.roteiros) {
      if (!r.youtube.capitulos) continue;
      const marcas = r.youtube.capitulos.split('\n').map((l) => l.split(' ')[0]);
      expect(marcas).toEqual(r.blocos.map((b) => b.inicio));
    }
  });

  it('o modelo (_modelo.md) não aparece no catálogo', () => {
    expect(catalogo.roteiros.some((r) => r.slug.startsWith('_'))).toBe(false);
  });

  it('o destaque é um roteiro escrito', () => {
    expect(destaque(catalogo)).toBeDefined();
  });
});

describe('montarCatalogo', () => {
  const series = `- id: s1\n  nome: Série 1\n  descricao: d\n  matiz: 200\n  planejados:\n    - titulo: Futuro\n      repositorio: d/x\n      resumo: r\n`;
  const roteiro = (serie: string) => `---
titulo: T
serie: ${serie}
episodio: 1
repositorio: d/x
duracao_alvo: 5 min
publico: p
objetivo: o
situacao: pronto
resumo: r
fontes:
  - titulo: f
    url: https://f.dev
---
## Gancho · 0:00–0:30
### Fala
- Oi.
`;

  it('junta escritos e planejados na fileira da série', () => {
    const c = montarCatalogo(series, { 'roteiros/s1/a.md': roteiro('s1') });
    const eps = c.porSerie.get('s1')!;
    expect(eps.map((e) => e.situacao)).toEqual(['pronto', 'planejado']);
    expect(destaque(c)?.slug).toBe('a');
  });

  it('recusa roteiro de série que não existe', () => {
    expect(() => montarCatalogo(series, { 'roteiros/s9/a.md': roteiro('s9') })).toThrow(/series.yml/);
  });

  it('recusa slug repetido', () => {
    expect(() =>
      montarCatalogo(series, { 'roteiros/s1/a.md': roteiro('s1'), 'roteiros/outra/a.md': roteiro('s1') }),
    ).toThrow(/repetido/);
  });
});
