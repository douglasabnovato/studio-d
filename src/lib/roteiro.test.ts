import { describe, expect, it } from 'vitest';
import { emSegundos, lerRoteiro, RoteiroInvalido } from './roteiro';

const cabecalho = (extra = '') => `---
titulo: Exemplo
serie: do-curso-ao-produto
episodio: 2
repositorio: douglasabnovato/exemplo
duracao_alvo: 10 min
publico: Quem estuda React.
objetivo: Aprender a testar.
situacao: rascunho
resumo: Um exemplo.
fontes:
  - titulo: Guia
    url: https://exemplo.dev/guia
${extra}---
`;

const corpo = `
## Gancho · 0:00–0:30

### Fala
- Primeira frase.

### Tela
O site aberto.

## Encerramento · 0:30-1:00

### Fala
- Tchau.

### Comandos
\`\`\`bash
npm test
\`\`\`

## Para o YouTube

### Descrição
Texto da descrição.

### Capítulos
0:00 Gancho

### Tags
react, testes
`;

describe('lerRoteiro', () => {
  it('lê o cabeçalho, os blocos e os campos do YouTube', () => {
    const r = lerRoteiro('roteiros/serie/exemplo.md', cabecalho() + corpo);
    expect(r.slug).toBe('exemplo');
    expect(r.episodio).toBe(2);
    expect(r.blocos.map((b) => b.nome)).toEqual(['Gancho', 'Encerramento']);
    expect(r.blocos[0]).toMatchObject({ inicio: '0:00', fim: '0:30', tela: 'O site aberto.' });
    expect(r.blocos[1].fim).toBe('1:00');
    expect(r.blocos[1].comandos).toContain('npm test');
    expect(r.youtube.descricao).toBe('Texto da descrição.');
    expect(r.youtube.tags).toBe('react, testes');
  });

  it('aceita fim de linha do Windows', () => {
    const r = lerRoteiro('x.md', (cabecalho() + corpo).replace(/\n/g, '\r\n'));
    expect(r.blocos).toHaveLength(2);
  });

  it('recusa roteiro sem fonte', () => {
    const sem = cabecalho().replace(/fontes:[\s\S]*?guia\n/, '');
    expect(() => lerRoteiro('x.md', sem + corpo)).toThrow(/fonte/);
  });

  it('recusa fonte sem https', () => {
    const http = cabecalho().replace('https://exemplo.dev/guia', 'http://exemplo.dev/guia');
    expect(() => lerRoteiro('x.md', http + corpo)).toThrow(RoteiroInvalido);
  });

  it('recusa bloco sem tempo', () => {
    expect(() => lerRoteiro('x.md', cabecalho() + '\n## Gancho\n\n### Fala\n- Oi.\n')).toThrow(/tempo/);
  });

  it('recusa bloco sem fala', () => {
    expect(() => lerRoteiro('x.md', cabecalho() + '\n## Gancho · 0:00–0:30\n\n### Tela\nAlgo.\n')).toThrow(/Fala/);
  });

  it('recusa situação desconhecida', () => {
    const errada = cabecalho().replace('situacao: rascunho', 'situacao: pronta');
    expect(() => lerRoteiro('x.md', errada + corpo)).toThrow(/situação/);
  });

  it('lê gravado_em e publicado_em de um roteiro publicado (#80)', () => {
    const pub = cabecalho('gravado_em: 2026-11-20\npublicado_em: 2026-11-24\n').replace('situacao: rascunho', 'situacao: publicado');
    const r = lerRoteiro('x.md', pub + corpo);
    expect(r.gravadoEm).toBe('2026-11-20');
    expect(r.publicadoEm).toBe('2026-11-24');
  });

  it('recusa data inválida, com o campo e o valor na mensagem (#80)', () => {
    const errada = cabecalho('gravado_em: 2026-02-30\n');
    expect(() => lerRoteiro('x.md', errada + corpo)).toThrow(/"gravado_em" precisa de uma data AAAA-MM-DD \(recebeu "2026-02-30"\)/);
    expect(() => lerRoteiro('x.md', cabecalho('gravado_em: 24/11/2026\n') + corpo)).toThrow(/gravado_em/);
  });

  it('"publicado" exige publicado_em, e publicado_em exige "publicado" (#80)', () => {
    const semData = cabecalho().replace('situacao: rascunho', 'situacao: publicado');
    expect(() => lerRoteiro('x.md', semData + corpo)).toThrow(/precisa de "publicado_em"/);
    expect(() => lerRoteiro('x.md', cabecalho('publicado_em: 2026-11-24\n') + corpo)).toThrow(/só vale com "situacao: publicado"/);
  });

  it('recusa arquivo sem cabeçalho', () => {
    expect(() => lerRoteiro('x.md', corpo)).toThrow(/cabeçalho/);
  });

  it('não corta o bloco num comentário "##" dentro de código', () => {
    const cerca = '`'.repeat(3);
    const comCodigo =
      cabecalho() +
      `\n## Gancho · 0:00–0:30\n\n### Fala\n- Oi.\n\n### Comandos\n${cerca}bash\n## instala\nnpm ci\n### e testa\nnpm test\n${cerca}\n`;
    const r = lerRoteiro('x.md', comCodigo);
    expect(r.blocos).toHaveLength(1);
    expect(r.blocos[0].comandos).toContain('## instala');
    expect(r.blocos[0].comandos).toContain('npm test');
  });

  it('converte marca de tempo em segundos', () => {
    expect(emSegundos('14:30')).toBe(870);
    expect(emSegundos('0:45')).toBe(45);
  });
});
