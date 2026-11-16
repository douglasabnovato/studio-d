// Roda no build e nos testes, nunca no navegador (#9).
import { parse as lerYaml } from 'yaml';
import { indexarCatalogo, type Catalogo, type Serie } from './catalogo';
import { paraHtml } from './markdown';
import { lerRoteiro, type Roteiro } from './roteiro';

/** Lê series.yml e os roteiros, e confere séries e slugs. */
export function montarCatalogo(seriesTexto: string, arquivos: Record<string, string>): Catalogo {
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
  return indexarCatalogo(series, roteiros);
}

/** O que o build entrega ao navegador: séries e roteiros, com o Markdown já em HTML seguro. */
export function dadosDoSite(c: Catalogo): { series: Serie[]; roteiros: Roteiro[] } {
  const roteiros = c.roteiros.map((r) => ({
    ...r,
    blocos: r.blocos.map((b) => ({
      ...b,
      html: { fala: paraHtml(b.fala), tela: paraHtml(b.tela), comandos: paraHtml(b.comandos) },
    })),
  }));
  return { series: c.series, roteiros };
}
