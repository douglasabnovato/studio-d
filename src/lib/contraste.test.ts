import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// O axe não mede contraste no jsdom; os pares de tokens são conferidos aqui (aprendizados, 09/11/2026).
const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf-8');

function tokens(seletor: string): Record<string, string> {
  const ini = css.indexOf(`${seletor} {`);
  const bloco = css.slice(ini, css.indexOf('}', ini));
  return Object.fromEntries([...bloco.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
}

function luminancia(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a: string, b: string) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const escuro = tokens(':root');
const claro = { ...escuro, ...tokens(":root[data-theme='light']") };

const PARES: [string, string][] = [
  ['texto', 'fundo'],
  ['texto', 'superficie'],
  ['texto', 'superficie-2'],
  ['texto-suave', 'fundo'],
  ['texto-suave', 'superficie'],
  ['texto-no-azul', 'azul-studio'],
  ['azul-claro', 'fundo'],
  ['azul-claro', 'superficie'],
];

describe.each([
  ['escuro', escuro],
  ['claro', claro],
])('contraste no tema %s', (_nome, t) => {
  it.each(PARES)('%s sobre %s tem pelo menos 4,5:1', (frente, fundo) => {
    expect(t[frente], `token --${frente}`).toBeDefined();
    expect(contraste(t[frente], t[fundo])).toBeGreaterThanOrEqual(4.5);
  });

  it('o foco tem pelo menos 3:1 contra o fundo', () => {
    expect(contraste(t.foco, t.fundo)).toBeGreaterThanOrEqual(3);
  });
});

describe('modo gravação (cores fixas)', () => {
  it.each([
    ['#ffffff', '#000000'],
    ['#5aa0ff', '#000000'],
    ['#b4bccb', '#0b0d12'],
    ['#ffffff', '#1e6bff'],
  ])('%s sobre %s', (a, b) => expect(contraste(a, b)).toBeGreaterThanOrEqual(4.5));
});
