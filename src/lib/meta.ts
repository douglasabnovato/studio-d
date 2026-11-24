/**
 * Meta do MVP do Studio D (#80): "4 vídeos publicados em 30 dias depois do primeiro" (docs/MVP.md).
 * Conta pelas datas `publicado_em` dos roteiros, sem depender de contagem à mão nem de conta externa.
 */
export const META_VIDEOS = 4;
export const JANELA_DIAS = 30;

export type EstadoDaMeta =
  | { estado: 'sem-inicio' }
  | { estado: 'em-andamento' | 'atingida' | 'encerrada'; publicados: number; inicio: string; fim: string; diasRestantes: number };

const DIA = 24 * 60 * 60 * 1000;
const emDia = (iso: string) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
const paraIso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Data de hoje no fuso local, como AAAA-MM-DD. */
export function hojeIso(agora = new Date()): string {
  const m = String(agora.getMonth() + 1).padStart(2, '0');
  const d = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${m}-${d}`;
}

/**
 * A janela começa no dia do 1º vídeo publicado e vai até o 29º dia depois dele (30 dias corridos).
 * Conta os publicados dentro dela; depois do fim, a meta fica "encerrada" com o número final.
 */
export function metaDaHipotese(datasDePublicacao: string[], hoje: string): EstadoDaMeta {
  const datas = datasDePublicacao.filter(Boolean).map(emDia).sort((a, b) => a - b);
  if (datas.length === 0) return { estado: 'sem-inicio' };
  const inicio = datas[0];
  const fim = inicio + (JANELA_DIAS - 1) * DIA;
  const publicados = datas.filter((d) => d <= fim).length;
  const h = emDia(hoje);
  const diasRestantes = Math.max(0, Math.round((fim - h) / DIA));
  // 4 ou mais publicados dentro da janela: a meta foi atingida, mesmo antes de a janela acabar (R19 do #98).
  const estado = publicados >= META_VIDEOS ? 'atingida' : h > fim ? 'encerrada' : 'em-andamento';
  return { estado, publicados, inicio: paraIso(inicio), fim: paraIso(fim), diasRestantes };
}

/** "24/11" a partir de "2026-11-24". */
export function diaMes(iso: string): string {
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
}

/** Frase da meta para a tela inicial: o rótulo (em negrito) e o texto (R19 do #98). */
export function fraseDaMeta(m: EstadoDaMeta): { rotulo: string; texto: string } {
  if (m.estado === 'sem-inicio') {
    return { rotulo: 'Meta do MVP:', texto: `${META_VIDEOS} vídeos em ${JANELA_DIAS} dias. O relógio começa no 1º vídeo publicado.` };
  }
  const periodo = `de ${diaMes(m.inicio)} a ${diaMes(m.fim)}`;
  if (m.estado === 'atingida') {
    return { rotulo: 'Meta do MVP atingida:', texto: `${m.publicados} vídeos publicados em ${JANELA_DIAS} dias (${periodo}).` };
  }
  const conta = `${m.publicados} de ${META_VIDEOS} vídeos publicados em ${JANELA_DIAS} dias`;
  if (m.estado === 'encerrada') return { rotulo: 'Meta do MVP encerrada:', texto: `${conta} (${periodo}).` };
  const resta = m.diasRestantes === 0 ? 'último dia' : m.diasRestantes === 1 ? 'falta 1 dia' : `faltam ${m.diasRestantes} dias`;
  return { rotulo: 'Meta do MVP:', texto: `${conta} · ${resta} (até ${diaMes(m.fim)}).` };
}
