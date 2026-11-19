// Roda no build e nos testes, nunca no navegador (#9).
import { parse as lerYaml } from 'yaml';
import { indexarCatalogo, type Catalogo, type Serie } from './catalogo';
import { paraHtml } from './markdown';
import { lerRoteiro } from './roteiro';
import type { ConteudoDoRoteiro, Roteiro, RoteiroResumo } from './tipos';

/** Lê series.yml e os roteiros, e confere séries e slugs. */
export function montarCatalogo(seriesTexto: string, arquivos: Record<string, string>): Catalogo<Roteiro> {
  const series = (lerYaml(seriesTexto) as Serie[]).map((s) => ({ ...s, planejados: s.planejados ?? [] }));
  const ids = new Set(series.map((s) => s.id));
  const roteiros = Object.entries(arquivos)
    .filter(([caminho]) => !caminho.split('/').pop()!.startsWith('_'))
    .map(([caminho, texto]) => lerRoteiro(caminho, texto))
    .sort((a, b) => a.episodio - b.episodio);

  for (const r of roteiros) {
    if (!ids.has(r.serie)) throw new Error(`${r.slug}: a série "${r.serie}" não está em series.yml`);
  }
  const slugs = new Set<string>();
  for (const r of roteiros) {
    if (slugs.has(r.slug)) throw new Error(`slug repetido: ${r.slug}`);
    slugs.add(r.slug);
  }
  const carregar = async (slug: string) => {
    const r = roteiros.find((x) => x.slug === slug);
    if (!r) throw new Error(`roteiro inexistente: ${slug}`);
    return r;
  };
  return indexarCatalogo(series, roteiros, carregar);
}

/** O resumo que vai no pacote inicial: sem fontes, blocos e YouTube (#56). */
export function resumoDoRoteiro(r: Roteiro): RoteiroResumo {
  const { fontes: _fontes, blocos: _blocos, youtube: _youtube, ...resumo } = r;
  return resumo;
}

/** O pedaço de um roteiro, carregado ao abrir: fontes, YouTube e blocos com o Markdown já em HTML seguro. */
export function conteudoDoRoteiro(r: Roteiro): ConteudoDoRoteiro {
  return {
    fontes: r.fontes,
    youtube: r.youtube,
    blocos: r.blocos.map((b) => ({
      ...b,
      html: { fala: paraHtml(b.fala), tela: paraHtml(b.tela), comandos: paraHtml(b.comandos) },
    })),
  };
}

/** O que o build entrega ao pacote inicial: séries e o resumo de cada roteiro (#9, #56). */
export function dadosDoSite(c: Catalogo<Roteiro>): { series: Serie[]; roteiros: RoteiroResumo[] } {
  return { series: c.series, roteiros: c.roteiros.map(resumoDoRoteiro) };
}
