// Tipos e utilitários que vão para o navegador. Nada aqui importa yaml ou marked (#9).

/** Situação de um vídeo, do rascunho à publicação. */
export type Situacao = 'planejado' | 'rascunho' | 'pronto' | 'gravado' | 'publicado';

export const SITUACOES: Record<Situacao, string> = {
  planejado: 'Planejado',
  rascunho: 'Rascunho',
  pronto: 'Pronto para gravar',
  gravado: 'Gravado',
  publicado: 'Publicado',
};

export interface Fonte {
  titulo: string;
  url: string;
}

export interface Bloco {
  /** Nome do bloco, como "Gancho". */
  nome: string;
  /** Marca de tempo de início e fim, como "0:00" e "0:30". */
  inicio: string;
  fim: string;
  fala: string;
  /** Segundos de fala estimados (#85). */
  falaSegundos: number;
  tela: string;
  comandos: string;
  /** Fala, tela e comandos já em HTML seguro. Preenchido no build (#9). */
  html?: { fala: string; tela: string; comandos: string };
}

export interface ParaOYoutube {
  descricao: string;
  capitulos: string;
  tags: string;
  capa: string;
}

/**
 * O que a vitrine precisa de um roteiro: vai no pacote inicial (#56).
 * Fontes, blocos e o texto do YouTube ficam num pedaço por roteiro, carregado ao abrir.
 */
export interface RoteiroResumo {
  slug: string;
  titulo: string;
  serie: string;
  episodio: number;
  repositorio: string;
  duracaoAlvo: string;
  publico: string;
  preRequisitos: string[];
  objetivo: string;
  situacao: Situacao;
  resumo: string;
  /** Número de fontes, para a janela de detalhes mostrar sem carregar o roteiro. */
  quantasFontes: number;
  /** Datas da gravação e da publicação (AAAA-MM-DD), quando houver: medem a meta do MVP (#80). */
  gravadoEm?: string;
  publicadoEm?: string;
  /** Soma da fala estimada dos blocos, em segundos (#85). */
  falaSegundos: number;
}

/** O que só a página do roteiro e o modo gravação usam (#56). */
export interface ConteudoDoRoteiro {
  fontes: Fonte[];
  blocos: Bloco[];
  youtube: ParaOYoutube;
}

export interface Roteiro extends RoteiroResumo, ConteudoDoRoteiro {}

/** Converte "m:ss" em segundos. */
export function emSegundos(marca: string): number {
  const [m, s] = marca.split(':').map(Number);
  return m * 60 + s;
}
