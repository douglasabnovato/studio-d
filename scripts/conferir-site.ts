// Confere que o site publicado responde e é o Studio D (#43).
// Uso: node scripts/conferir-site.ts [url]. Sai com código 1 se houver problema.
// O Node 22.18+ roda TypeScript direto, sem compilar (só remove os tipos).
import { readFileSync } from 'node:fs';
import { problemasDoSite } from '../src/lib/conferir-site.ts';

const URL_DO_SITE = process.argv[2] ?? 'https://douglasabnovato.github.io/studio-d/';
const TENTATIVAS = 3;
const ESPERA_MS = 10_000;

async function baixar(url: string): Promise<{ status: number; html: string }> {
  let ultimoErro: unknown;
  for (let i = 1; i <= TENTATIVAS; i++) {
    try {
      const resposta = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20_000) });
      // 5xx pode ser instabilidade do Pages: tenta de novo antes de acusar.
      if (resposta.status < 500 || i === TENTATIVAS) return { status: resposta.status, html: await resposta.text() };
      ultimoErro = new Error(`HTTP ${resposta.status}`);
    } catch (erro) {
      ultimoErro = erro;
    }
    if (i < TENTATIVAS) await new Promise((r) => setTimeout(r, ESPERA_MS));
  }
  throw ultimoErro;
}

const doRepositorio = readFileSync(new URL('../index.html', import.meta.url), 'utf-8');

try {
  const { status, html } = await baixar(URL_DO_SITE);
  const problemas = problemasDoSite(status, html, doRepositorio);
  if (problemas.length) {
    console.error(`O site ${URL_DO_SITE} não é o Studio D:\n- ${problemas.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`OK: ${URL_DO_SITE} respondeu HTTP 200 com o título e a descrição do index.html.`);
} catch (erro) {
  console.error(`Não foi possível abrir ${URL_DO_SITE}: ${erro instanceof Error ? erro.message : String(erro)}`);
  process.exit(1);
}
