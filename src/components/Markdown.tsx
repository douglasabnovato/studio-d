import { Marked } from 'marked';

const escapar = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** HTML cru dentro do Markdown vira texto: nada de tag vinda do roteiro chega ao DOM. */
const md = new Marked({ gfm: true, breaks: false, async: false }).use({
  renderer: {
    html: ({ text }) => escapar(text),
    // Comando longo rola na horizontal: a área precisa receber foco pelo teclado (axe, scrollable-region-focusable).
    code: ({ text, lang }) => {
      const classe = lang ? ` class="language-${escapar(lang.split(/\s/)[0])}"` : '';
      return `<pre tabindex="0"><code${classe}>${escapar(text)}</code></pre>
`;
    },
  },
});

/** Mostra o Markdown dos roteiros, que vem só dos arquivos do repositório, revisados por PR (ADR-002). */
export function Markdown({ texto, className }: { texto: string; className?: string }) {
  const html = md.parse(texto) as string;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
