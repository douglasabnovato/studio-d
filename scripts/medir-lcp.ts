// Resume os JSON do Lighthouse móvel do site publicado (#59).
// Uso: node scripts/medir-lcp.ts <url> <pacote> <lh-1.json> [lh-2.json ...]
// Escreve o resumo no $GITHUB_STEP_SUMMARY (ou na saída) e sai com código 1 se a mediana passar de 2,5 s.
import { appendFileSync, readFileSync } from 'node:fs';
import { lerExecucao, resumirLcp, type Relatorio } from '../src/lib/medir-lcp.ts';

const [url, pacote, ...arquivos] = process.argv.slice(2);
if (!url || !arquivos.length) {
  console.error('Uso: node scripts/medir-lcp.ts <url> <pacote> <lh-1.json> [lh-2.json ...]');
  process.exit(1);
}

const execucoes = arquivos.map((arquivo) => {
  try {
    return lerExecucao(arquivo, JSON.parse(readFileSync(arquivo, 'utf-8')) as Relatorio);
  } catch (erro) {
    return { arquivo, invalida: `não deu para ler: ${erro instanceof Error ? erro.message : String(erro)}` };
  }
});

// Data e hora de Brasília, sem depender do fuso da máquina do CI.
const data = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date());
const { passou, markdown } = resumirLcp(execucoes, { url, pacote: pacote || undefined, data: `${data} (Brasília)` });

console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n');
process.exit(passou ? 0 : 1);
