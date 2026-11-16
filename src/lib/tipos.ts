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

export interface Roteiro {
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
  fontes: Fonte[];
  blocos: Bloco[];
  youtube: ParaOYoutube;
}

/** Converte "m:ss" em segundos. */
export function emSegundos(marca: string): number {
  const [m, s] = marca.split(':').map(Number);
  return m * 60 + s;
}
