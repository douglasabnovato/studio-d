import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Todo link relativo do README e de docs/ aponta para um arquivo que existe (#14).
const raiz = process.cwd();

function markdowns(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const c = join(pasta, nome);
    return statSync(c).isDirectory() ? markdowns(c) : nome.endsWith('.md') ? [c] : [];
  });
}

const arquivos = [join(raiz, 'README.md'), ...markdowns(join(raiz, 'docs'))];

describe.each(arquivos.map((a) => [a.slice(raiz.length + 1).replace(/\\/g, '/'), a]))('links de %s', (_nome, arquivo) => {
  const texto = readFileSync(arquivo, 'utf-8').replace(/```[\s\S]*?```/g, '');
  const links = [...texto.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((m) => m[1])
    .filter((l) => !/^(https?:|mailto:|#)/.test(l));

  it('apontam para arquivos que existem', () => {
    const quebrados = links.filter((l) => !existsSync(resolve(dirname(arquivo), l.split('#')[0])));
    expect(quebrados).toEqual([]);
  });
});
