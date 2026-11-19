/// <reference types="vitest/config" />
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { problemasDoCatalogo } from './src/lib/catalogo';
import { conteudoDoRoteiro, dadosDoSite, montarCatalogo } from './src/lib/ler-catalogo';

function arquivosMd(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) return arquivosMd(caminho);
    return nome.endsWith('.md') ? [caminho] : [];
  });
}

const MODULO = 'virtual:roteiros';
const PEDACO = 'virtual:roteiro/';

/** Lê e confere todos os roteiros. Para o build (e o dev) se algum for inválido. */
function lerTudo(ctx: { addWatchFile(id: string): void; error(mensagem: string): never }) {
  const raiz = join(process.cwd(), 'roteiros');
  const caminhos = arquivosMd(raiz);
  for (const c of [...caminhos, join(raiz, 'series.yml')]) ctx.addWatchFile(c);
  const arquivos = Object.fromEntries(
    caminhos.map((c) => [relative(process.cwd(), c).replace(/\\/g, '/'), readFileSync(c, 'utf-8')]),
  );
  const catalogo = montarCatalogo(readFileSync(join(raiz, 'series.yml'), 'utf-8'), arquivos);
  const erros = problemasDoCatalogo(catalogo);
  if (erros.length) ctx.error(`Roteiros inválidos:\n- ${erros.join('\n- ')}`);
  return catalogo;
}

/**
 * Lê os roteiros no build e entrega ao navegador módulos com os dados prontos (#9):
 * o yaml e o marked ficam fora do pacote. O `virtual:roteiros` leva só o resumo de cada
 * roteiro; fontes, blocos e YouTube vão num pedaço próprio, `virtual:roteiro/<slug>`,
 * pedido por `import()` só ao abrir o roteiro (#56). Para o build (e o dev) se um roteiro
 * for inválido: o site nunca publica tela em branco.
 */
function roteiros(): Plugin {
  return {
    name: 'roteiros',
    // No dev, roteiro novo ou apagado recarrega a página (o addWatchFile só cobre os que já existiam).
    configureServer(server) {
      const raiz = join(process.cwd(), 'roteiros');
      const mudou = (arquivo: string) => {
        if (!arquivo.startsWith(raiz) || !arquivo.endsWith('.md')) return;
        const modulo = server.moduleGraph.getModuleById('\0' + MODULO);
        if (modulo) server.moduleGraph.invalidateModule(modulo);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', mudou);
      server.watcher.on('unlink', mudou);
    },
    resolveId(id) {
      return id === MODULO || id.startsWith(PEDACO) ? '\0' + id : undefined;
    },
    load(id) {
      if (id === '\0' + MODULO) {
        const catalogo = lerTudo(this);
        // Um import() por roteiro: o Vite gera um pedaço de JS para cada um.
        const carregadores = catalogo.roteiros
          .map((r) => `  ${JSON.stringify(r.slug)}: () => import(${JSON.stringify(PEDACO + r.slug)}),`)
          .join('\n');
        return `export default ${JSON.stringify(dadosDoSite(catalogo))};\nexport const carregadores = {\n${carregadores}\n};\n`;
      }
      if (id.startsWith('\0' + PEDACO)) {
        const slug = id.slice(1 + PEDACO.length);
        const roteiro = lerTudo(this).roteiros.find((r) => r.slug === slug);
        if (!roteiro) return this.error(`Roteiro inexistente: ${slug}`);
        return `export default ${JSON.stringify(conteudoDoRoteiro(roteiro))};`;
      }
      return undefined;
    },
  };
}

// O Pages serve o site em /studio-d/.
export default defineConfig({
  base: '/studio-d/',
  plugins: [react(), roteiros()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
