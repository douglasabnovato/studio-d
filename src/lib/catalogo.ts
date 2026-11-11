import { parse as lerYaml } from 'yaml';
import { lerRoteiro, type Roteiro, type Situacao } from './roteiro';
import seriesYml from '../../roteiros/series.yml?raw';

export interface Planejado {
  titulo: string;
  repositorio: string;
  resumo: string;
}

export interface Serie {
  id: string;
  nome: string;
  descricao: string;
  /** Matiz (0 a 360) usado na capa dos episódios. */
  matiz: number;
  planejados: Planejado[];
}

/** Um item de fileira: um roteiro escrito ou um episódio só planejado. */
export interface Episodio {
  chave: string;
  titulo: string;
  serie: Serie;
  repositorio: string;
  resumo: string;
  situacao: Situacao;
  roteiro?: Roteiro;
}

export interface Catalogo {
  series: Serie[];
  roteiros: Roteiro[];
  porSerie: Map<string, Episodio[]>;
}

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

  const porSerie = new Map<string, Episodio[]>();
  for (const s of series) {
    const escritos: Episodio[] = roteiros
      .filter((r) => r.serie === s.id)
      .map((r) => ({
        chave: r.slug,
        titulo: r.titulo,
        serie: s,
        repositorio: r.repositorio,
        resumo: r.resumo,
        situacao: r.situacao,
        roteiro: r,
      }));
    const planejados: Episodio[] = s.planejados.map((p, i) => ({
      chave: `${s.id}-planejado-${i}`,
      titulo: p.titulo,
      serie: s,
      repositorio: p.repositorio,
      resumo: p.resumo,
      situacao: 'planejado',
    }));
    porSerie.set(s.id, [...escritos, ...planejados]);
  }
  return { series, roteiros, porSerie };
}

/** O roteiro em destaque: o primeiro pronto para gravar; senão, o primeiro rascunho. */
export function destaque(c: Catalogo): Roteiro | undefined {
  return c.roteiros.find((r) => r.situacao === 'pronto') ?? c.roteiros.find((r) => r.situacao === 'rascunho') ?? c.roteiros[0];
}

const arquivos = import.meta.glob('../../roteiros/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const catalogo = montarCatalogo(seriesYml, arquivos);
