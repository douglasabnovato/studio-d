/// <reference types="vitest/config" />
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { montarCatalogo, problemasDoCatalogo } from './src/lib/catalogo';

function arquivosMd(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) return arquivosMd(caminho);
    return nome.endsWith('.md') ? [caminho] : [];
  });
}

/** Para o build (e o dev) se um roteiro for inválido: o site nunca publica tela em branco. */
function validarRoteiros(): Plugin {
  return {
    name: 'validar-roteiros',
    buildStart() {
      const raiz = join(process.cwd(), 'roteiros');
      const arquivos = Object.fromEntries(
        arquivosMd(raiz).map((c) => [relative(process.cwd(), c).replace(/\\/g, '/'), readFileSync(c, 'utf-8')]),
      );
      const catalogo = montarCatalogo(readFileSync(join(raiz, 'series.yml'), 'utf-8'), arquivos);
      const erros = problemasDoCatalogo(catalogo);
      if (erros.length) this.error(`Roteiros inválidos:\n- ${erros.join('\n- ')}`);
    },
  };
}

// O Pages serve o site em /studio-d/.
export default defineConfig({
  base: '/studio-d/',
  plugins: [react(), validarRoteiros()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
