import { memo, useMemo } from 'react';
import { Marked } from 'marked';

export const escapar = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Só links para a web, e-mail ou âncora; `javascript:` e afins viram texto. */
export function urlSegura(url: string): string | null {
  const u = url.trim();
  if (/^(https?:|mailto:)/i.test(u) || u.startsWith('#')) return u;
  return null;
}

/**
 * HTML cru dentro do roteiro vira texto escapado, o código vai escapado num `<pre>` focável,
 * e links e imagens só aceitam endereços seguros (ADR-002).
 */
const md = new Marked({ gfm: true, breaks: false, async: false }).use({
  renderer: {
    html: ({ text }) => escapar(text),
    // Comando longo rola na horizontal: a área precisa receber foco pelo teclado (axe, scrollable-region-focusable).
    code: ({ text, lang }) => {
      const linguagem = lang?.match(/^[\w-]+/)?.[0];
      const classe = linguagem ? ` class="language-${linguagem}"` : '';
      return `<pre tabindex="0"><code${classe}>${escapar(text)}</code></pre>\n`;
    },
    link({ href, title, tokens }) {
      const texto = this.parser.parseInline(tokens);
      const seguro = urlSegura(href);
      if (!seguro) return texto;
      const t = title ? ` title="${escapar(title)}"` : '';
      return `<a href="${escapar(seguro)}"${t}>${texto}</a>`;
    },
    image({ href, text }) {
      const seguro = urlSegura(href);
      if (!seguro || seguro.startsWith('mailto:')) return escapar(text);
      return `<img src="${escapar(seguro)}" alt="${escapar(text)}">`;
    },
  },
});

export function paraHtml(texto: string): string {
  return md.parse(texto) as string;
}

/** Mostra o Markdown dos roteiros. Memorizado: o teleprompter renderiza a cada quadro. */
export const Markdown = memo(function Markdown({ texto, className }: { texto: string; className?: string }) {
  const html = useMemo(() => paraHtml(texto), [texto]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
});
