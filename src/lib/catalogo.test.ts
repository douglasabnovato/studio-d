import dados, { carregadores } from 'virtual:roteiros';
import { beforeAll, describe, expect, it } from 'vitest';
import { destaque, problemasDoCatalogo } from './catalogo';
import { montarCatalogo } from './ler-catalogo';
import { carregarRoteiro, catalogo } from './conteudo';
import type { Roteiro } from './tipos';

// Os roteiros completos, como o navegador os recebe depois de abrir cada um (#56).
let completos: Roteiro[] = [];
beforeAll(async () => {
  completos = await Promise.all(catalogo.roteiros.map((r) => catalogo.carregar(r.slug)));
});

describe('catálogo real (roteiros/)', () => {
  it('tem pelo menos um roteiro e cinco séries', () => {
    expect(catalogo.roteiros.length).toBeGreaterThan(0);
    expect(catalogo.series.length).toBeGreaterThanOrEqual(5);
  });

  it('cada roteiro aponta para um repositório no formato dono/nome', () => {
    for (const r of catalogo.roteiros) expect(r.repositorio).toMatch(/^[\w.-]+\/[\w.-]+$/);
  });

  it('blocos contínuos e capítulos batendo (a mesma regra do build)', () => {
    expect(problemasDoCatalogo({ roteiros: completos })).toEqual([]);
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

  it('aponta bloco fora de ordem e capítulos errados', () => {
    const ruim =
      roteiro('s1').replace('## Gancho · 0:00–0:30', '## Gancho · 0:10–0:30') + '\n## Para o YouTube\n### Capítulos\n0:00 Gancho\n';
    const erros = problemasDoCatalogo(montarCatalogo(series, { 'roteiros/s1/a.md': ruim })).join('\n');
    expect(erros).toMatch(/0:00/);
    expect(erros).toMatch(/capítulos/);
  });

  it('recusa slug repetido', () => {
    expect(() =>
      montarCatalogo(series, { 'roteiros/s1/a.md': roteiro('s1'), 'roteiros/outra/a.md': roteiro('s1') }),
    ).toThrow(/repetido/);
  });
});

describe('dados do build (#9)', () => {
  it('cada bloco chega com a fala já em HTML, sem precisar do marked no navegador', () => {
    for (const r of completos) {
      for (const b of r.blocos) {
        expect(b.html?.fala).toMatch(/^<p>|^<ul>|^<ol>|^<pre/);
        expect(b.html?.fala).not.toMatch(/<script/i);
      }
    }
  });
});

describe('pacote inicial e pedaços (#56)', () => {
  it('o pacote inicial leva só o resumo: sem fontes, blocos e YouTube', () => {
    for (const r of dados.roteiros) {
      expect(r).not.toHaveProperty('fontes');
      expect(r).not.toHaveProperty('blocos');
      expect(r).not.toHaveProperty('youtube');
      expect(r.quantasFontes).toBeGreaterThan(0);
    }
  });

  it('há um pedaço por roteiro, e ele completa o resumo', async () => {
    expect(Object.keys(carregadores).sort()).toEqual(dados.roteiros.map((r) => r.slug).sort());
    const primeiro = dados.roteiros[0];
    const completo = await carregarRoteiro(primeiro.slug);
    expect(completo).toMatchObject(primeiro);
    expect(completo.fontes).toHaveLength(primeiro.quantasFontes);
    expect(completo.blocos.length).toBeGreaterThan(0);
  });

  it('o mesmo roteiro é pedido uma vez só', () => {
    const slug = dados.roteiros[0].slug;
    expect(carregarRoteiro(slug)).toBe(carregarRoteiro(slug));
  });

  it('recusa slug que não existe', async () => {
    await expect(carregarRoteiro('nao-existe')).rejects.toThrow(/inexistente/);
  });
});
