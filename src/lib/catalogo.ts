// Vai para o navegador: sem yaml e sem marked (#9). A leitura dos arquivos está em ler-catalogo.ts.
import { emSegundos, type Roteiro, type Situacao } from './tipos';

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

/** Monta as fileiras a partir das séries e dos roteiros já lidos. */
export function indexarCatalogo(series: Serie[], roteiros: Roteiro[]): Catalogo {
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

/**
 * Regras que o parser sozinho não confere: blocos contínuos a partir de 0:00 e
 * capítulos do YouTube iguais ao início dos blocos. Roda nos testes e no build.
 */
export function problemasDoCatalogo(c: Catalogo): string[] {
  const erros: string[] = [];
  for (const r of c.roteiros) {
    if (r.blocos[0].inicio !== '0:00') erros.push(`${r.slug}: o primeiro bloco precisa começar em 0:00`);
    r.blocos.forEach((b, i) => {
      if (emSegundos(b.fim) <= emSegundos(b.inicio)) erros.push(`${r.slug}: "${b.nome}" termina antes de começar`);
      if (i > 0 && b.inicio !== r.blocos[i - 1].fim) erros.push(`${r.slug}: "${b.nome}" não começa onde "${r.blocos[i - 1].nome}" terminou`);
    });
    if (r.youtube.capitulos) {
      const marcas = r.youtube.capitulos.split(/\r?\n/).map((l) => l.trim().split(' ')[0]).filter(Boolean);
      const inicios = r.blocos.map((b) => b.inicio);
      if (marcas.join() !== inicios.join()) erros.push(`${r.slug}: os capítulos (${marcas.join(', ')}) não batem com os blocos (${inicios.join(', ')})`);
    }
  }
  return erros;
}
