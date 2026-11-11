import { parse as lerYaml } from 'yaml';

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

export class RoteiroInvalido extends Error {
  constructor(arquivo: string, motivo: string) {
    super(`${arquivo}: ${motivo}`);
    this.name = 'RoteiroInvalido';
  }
}

const CABECALHO = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const TITULO_BLOCO = /^(.+?)\s*·\s*(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})\s*$/;

function texto(valor: unknown, campo: string, arquivo: string): string {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new RoteiroInvalido(arquivo, `o campo "${campo}" é obrigatório`);
  }
  return valor.trim();
}

/** Separa o texto por títulos de um nível ("## " ou "### "). */
function secoes(corpo: string, marca: '## ' | '### '): { titulo: string; conteudo: string }[] {
  const linhas = corpo.split(/\r?\n/);
  const saida: { titulo: string; conteudo: string[] }[] = [];
  for (const linha of linhas) {
    if (linha.startsWith(marca)) {
      saida.push({ titulo: linha.slice(marca.length).trim(), conteudo: [] });
    } else if (saida.length > 0) {
      saida[saida.length - 1].conteudo.push(linha);
    }
  }
  return saida.map((s) => ({ titulo: s.titulo, conteudo: s.conteudo.join('\n').trim() }));
}

function subsecao(conteudo: string, nome: string): string {
  const achada = secoes(conteudo, '### ').find((s) => s.titulo.toLowerCase() === nome.toLowerCase());
  return achada?.conteudo ?? '';
}

/**
 * Lê um roteiro em Markdown: cabeçalho YAML entre "---", um bloco por "## Nome · 0:00–0:30"
 * (com "### Fala", "### Tela" e "### Comandos") e, no fim, "## Para o YouTube".
 */
export function lerRoteiro(arquivo: string, conteudo: string): Roteiro {
  const partes = CABECALHO.exec(conteudo);
  if (!partes) throw new RoteiroInvalido(arquivo, 'falta o cabeçalho entre "---"');
  const dados = (lerYaml(partes[1]) ?? {}) as Record<string, unknown>;
  const corpo = partes[2];

  const situacao = texto(dados.situacao, 'situacao', arquivo) as Situacao;
  if (!(situacao in SITUACOES)) throw new RoteiroInvalido(arquivo, `situação desconhecida: ${situacao}`);

  const fontes = Array.isArray(dados.fontes) ? (dados.fontes as Fonte[]) : [];
  if (fontes.length === 0) throw new RoteiroInvalido(arquivo, 'todo roteiro precisa de pelo menos uma fonte');
  for (const f of fontes) {
    if (!f || typeof f.titulo !== 'string' || typeof f.url !== 'string' || !/^https:\/\//.test(f.url)) {
      throw new RoteiroInvalido(arquivo, 'cada fonte precisa de "titulo" e de uma "url" https');
    }
  }

  const todas = secoes(corpo, '## ');
  const blocos: Bloco[] = [];
  let youtube: ParaOYoutube = { descricao: '', capitulos: '', tags: '', capa: '' };
  for (const s of todas) {
    if (s.titulo.toLowerCase() === 'para o youtube') {
      youtube = {
        descricao: subsecao(s.conteudo, 'Descrição'),
        capitulos: subsecao(s.conteudo, 'Capítulos'),
        tags: subsecao(s.conteudo, 'Tags'),
        capa: subsecao(s.conteudo, 'Capa'),
      };
      continue;
    }
    const t = TITULO_BLOCO.exec(s.titulo);
    if (!t) throw new RoteiroInvalido(arquivo, `o bloco "${s.titulo}" precisa do tempo, como "Gancho · 0:00–0:30"`);
    const fala = subsecao(s.conteudo, 'Fala');
    if (!fala) throw new RoteiroInvalido(arquivo, `o bloco "${t[1]}" não tem "### Fala"`);
    blocos.push({
      nome: t[1].trim(),
      inicio: t[2],
      fim: t[3],
      fala,
      tela: subsecao(s.conteudo, 'Tela'),
      comandos: subsecao(s.conteudo, 'Comandos'),
    });
  }
  if (blocos.length === 0) throw new RoteiroInvalido(arquivo, 'o roteiro não tem blocos');

  const slug = arquivo.split('/').pop()!.replace(/\.md$/, '');
  return {
    slug,
    titulo: texto(dados.titulo, 'titulo', arquivo),
    serie: texto(dados.serie, 'serie', arquivo),
    episodio: Number(dados.episodio ?? 0),
    repositorio: texto(dados.repositorio, 'repositorio', arquivo),
    duracaoAlvo: texto(dados.duracao_alvo, 'duracao_alvo', arquivo),
    publico: texto(dados.publico, 'publico', arquivo),
    preRequisitos: Array.isArray(dados.pre_requisitos) ? dados.pre_requisitos.map(String) : [],
    objetivo: texto(dados.objetivo, 'objetivo', arquivo),
    situacao,
    resumo: texto(dados.resumo, 'resumo', arquivo),
    fontes,
    blocos,
    youtube,
  };
}

/** Converte "m:ss" em segundos. */
export function emSegundos(marca: string): number {
  const [m, s] = marca.split(':').map(Number);
  return m * 60 + s;
}
