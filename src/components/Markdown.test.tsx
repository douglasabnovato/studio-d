import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Markdown, paraHtml, urlSegura } from './Markdown';

describe('Markdown dos roteiros', () => {
  it('escapa HTML cru', () => {
    const html = paraHtml('Olá <img src=x onerror=alert(1)> <script>alert(1)</script>');
    expect(html).not.toMatch(/<img|<script/);
    expect(html).toContain('&lt;script&gt;');
  });

  it('não deixa a linguagem do bloco de código injetar atributo', () => {
    const html = paraHtml('```x"onmouseover="alert(1)\ncódigo\n```');
    expect(html).not.toContain('onmouseover="');
    expect(html).toContain('<pre tabindex="0">');
  });

  it('link javascript: vira texto; https continua link', () => {
    const { container } = render(<Markdown texto={'[mau](javascript:alert(1)) e [bom](https://web.dev/articles/lcp)'} />);
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', 'https://web.dev/articles/lcp');
    expect(container.textContent).toContain('mau');
  });

  it('imagem com javascript: ou data: vira só o texto alternativo', () => {
    const html = paraHtml('![x](javascript:alert(1)) ![y](data:image/png;base64,AAA)');
    expect(html).not.toContain('<img');
  });

  it('aceita só web, e-mail e âncora', () => {
    expect(urlSegura('https://a.dev')).toBe('https://a.dev');
    expect(urlSegura('mailto:a@exemplo.dev')).toBe('mailto:a@exemplo.dev');
    expect(urlSegura('#parte')).toBe('#parte');
    expect(urlSegura(' JavaScript:alert(1)')).toBeNull();
    expect(urlSegura('vbscript:x')).toBeNull();
  });
});
