import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { marcasDoHtml, pacoteDoHtml, problemasDoBuild, problemasDoSite } from './conferir-site';

// O job semanal (#43) compara o site publicado com o index.html do repositório.
const nosso = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8');

/** HTML como o Pages serve: o build troca o script, mas mantém título e descrição. */
const publicado = nosso.replace(
  '<script type="module" src="/src/main.tsx"></script>',
  '<script type="module" crossorigin src="/studio-d/assets/index-abc123.js"></script>',
);

describe('marcasDoHtml', () => {
  it('o HTML publicado de exemplo é diferente do index.html (o fixture não ficou igual)', () => {
    expect(publicado).not.toBe(nosso);
  });

  it('ignora data-name="description"', () => {
    const html = '<meta data-name="description" content="falsa"><meta name="description" content="certa">';
    expect(marcasDoHtml(html).descricao).toBe('certa');
  });

  it('lê o título e a descrição do index.html do repositório', () => {
    const { titulo, descricao } = marcasDoHtml(nosso);
    expect(titulo).toBe('Studio D');
    expect(descricao).toContain('douglasabnovato');
  });

  it('acha a descrição com atributos em outra ordem e aspas simples', () => {
    const html = "<head><meta content='Outra &amp; coisa' name='description'><title> X </title></head>";
    expect(marcasDoHtml(html)).toEqual({ titulo: 'X', descricao: 'Outra & coisa' });
  });

  it('devolve null quando falta a marca', () => {
    expect(marcasDoHtml('<html></html>')).toEqual({ titulo: null, descricao: null });
  });
});

describe('problemasDoSite', () => {
  it('aceita o build publicado do próprio repositório', () => {
    expect(problemasDoSite(200, publicado, nosso)).toEqual([]);
  });

  it('recusa status diferente de 200', () => {
    expect(problemasDoSite(404, publicado, nosso)).toEqual(['o site respondeu HTTP 404, e não 200']);
  });

  it('recusa um site de terceiro com o mesmo título e outra descrição', () => {
    const terceiro = publicado.replace(/content="Studio D: roteiros[^"]*"/, 'content="Projeto do curso"');
    const problemas = problemasDoSite(200, terceiro, nosso);
    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toMatch(/^descrição publicada "Projeto do curso"/);
  });

  it('recusa outro título', () => {
    const outro = publicado.replace('<title>Studio D</title>', '<title>Proffy</title>');
    expect(problemasDoSite(200, outro, nosso)).toEqual(['título publicado "Proffy", esperado "Studio D"']);
  });

  it('recusa página sem marcas, como uma tela de erro do Pages', () => {
    expect(problemasDoSite(200, '<html><body>Site not found</body></html>', nosso)).toHaveLength(2);
  });

  it('avisa quando o index.html do repositório perdeu as marcas', () => {
    expect(problemasDoSite(200, publicado, '<html></html>')[0]).toMatch(/não tem <title>/);
  });
});

describe('pacoteDoHtml (#55)', () => {
  it('lê o pacote principal do HTML publicado', () => {
    expect(pacoteDoHtml(publicado)).toBe('index-abc123.js');
  });

  it('aceita aspas simples, atributos em outra ordem e caminho relativo', () => {
    expect(pacoteDoHtml("<script src='./assets/index-X_9-z.js' type='module'></script>")).toBe('index-X_9-z.js');
  });

  it('ignora outros scripts e devolve null sem pacote', () => {
    expect(pacoteDoHtml('<script src="/studio-d/assets/vendor-1.js"></script>')).toBeNull();
    expect(pacoteDoHtml(nosso)).toBeNull();
  });
});

describe('problemasDoBuild (#55)', () => {
  const doBuild = (hash: string) => publicado.replace('index-abc123.js', `index-${hash}.js`);

  it('aceita quando o site pede o mesmo pacote do build da main', () => {
    expect(problemasDoBuild(publicado, doBuild('abc123'))).toEqual([]);
  });

  it('acusa build antigo, com os dois nomes', () => {
    expect(problemasDoBuild(publicado, doBuild('novo456'))).toEqual([
      'o site pede index-abc123.js, mas o build da main gera index-novo456.js: o site está com um build antigo',
    ]);
  });

  it('acusa quando o site não pede pacote nenhum', () => {
    expect(problemasDoBuild('<html></html>', doBuild('novo456'))[0]).toMatch(/^o site pede \(nenhum assets\/index-\*\.js\)/);
  });

  it('acusa quando o build da main não tem pacote', () => {
    expect(problemasDoBuild(publicado, nosso)).toEqual(['o dist/index.html do build da main não pede nenhum assets/index-*.js']);
  });
});
