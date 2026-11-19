/**
 * Lê os JSON do Lighthouse móvel e resume o critério 7 (#59): LCP de cada execução,
 * mediana, TBT e elemento do LCP. Roda no job `lcp` do CI, depois do `publicar`.
 */
export const LIMITE_LCP_MS = 2500;

export interface Execucao {
  arquivo: string;
  /** Motivo de a execução não valer (erro do Lighthouse ou métrica ausente). */
  invalida?: string;
  lcpMs?: number;
  tbtMs?: number;
  elemento?: string;
}

interface No {
  selector?: string;
  nodeLabel?: string;
}
interface ItemDoLcp {
  node?: No;
  items?: ItemDoLcp[];
}

/** O seletor do elemento do LCP. O Lighthouse 10+ põe a tabela do nó dentro de uma lista. */
function elementoDoLcp(detalhes: { items?: ItemDoLcp[] } | undefined): string | undefined {
  for (const item of detalhes?.items ?? []) {
    const no = item.node ?? item.items?.find((i) => i.node)?.node;
    if (no) return no.selector ?? no.nodeLabel;
  }
  return undefined;
}

export interface Relatorio {
  runtimeError?: { code?: string; message?: string };
  audits?: Record<string, { numericValue?: number; details?: { items?: ItemDoLcp[] } } | undefined>;
}

export function lerExecucao(arquivo: string, json: Relatorio): Execucao {
  if (json.runtimeError) return { arquivo, invalida: `erro do Lighthouse: ${json.runtimeError.code ?? json.runtimeError.message}` };
  const lcp = json.audits?.['largest-contentful-paint']?.numericValue;
  const tbt = json.audits?.['total-blocking-time']?.numericValue;
  if (typeof lcp !== 'number' || typeof tbt !== 'number') return { arquivo, invalida: 'sem LCP ou TBT no relatório' };
  return { arquivo, lcpMs: lcp, tbtMs: tbt, elemento: elementoDoLcp(json.audits?.['largest-contentful-paint-element']?.details) };
}

export function mediana(valores: number[]): number {
  const v = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(v.length / 2);
  return v.length % 2 ? v[meio] : (v[meio - 1] + v[meio]) / 2;
}

const segundos = (ms: number) => `${(ms / 1000).toFixed(2).replace('.', ',')} s`;
const milis = (ms: number) => `${Math.round(ms)} ms`;

export interface Resumo {
  passou: boolean;
  medianaMs?: number;
  markdown: string;
}

/** Monta o resumo do run. Falha com menos de 3 execuções válidas ou com a mediana acima do limite. */
export function resumirLcp(execucoes: Execucao[], contexto: { url: string; pacote?: string; data: string }, limiteMs = LIMITE_LCP_MS): Resumo {
  const validas = execucoes.filter((e) => !e.invalida);
  const linhas = execucoes.map((e, i) =>
    e.invalida
      ? `| ${i + 1} | inválida: ${e.invalida} | | |`
      : `| ${i + 1} | ${segundos(e.lcpMs!)} | ${milis(e.tbtMs!)} | \`${e.elemento ?? '(não informado)'}\` |`,
  );
  const cabecalho = [
    '## LCP móvel do site publicado (#59)',
    '',
    `- Endereço: ${contexto.url}`,
    `- Build medido: ${contexto.pacote ? `\`${contexto.pacote}\`` : '(não informado)'}`,
    `- Data: ${contexto.data}`,
    '',
    '| Execução | LCP | TBT | Elemento do LCP |',
    '|---|---|---|---|',
    ...linhas,
    '',
  ];
  if (validas.length < 3) {
    return {
      passou: false,
      markdown: [...cabecalho, `**Falhou:** só ${validas.length} execuções válidas; o critério 7 pede 3. Rodar o job de novo.`].join('\n'),
    };
  }
  const m = mediana(validas.map((e) => e.lcpMs!));
  const passou = m <= limiteMs;
  const veredito = passou
    ? `**Mediana do LCP: ${segundos(m)}**, dentro do limite de ${segundos(limiteMs)}.`
    : `**Mediana do LCP: ${segundos(m)}**, acima do limite de ${segundos(limiteMs)}. O site já foi publicado; abrir uma issue com este run.`;
  return { passou, medianaMs: m, markdown: [...cabecalho, veredito].join('\n') };
}
