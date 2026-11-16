/**
 * Confere se o site publicado é o Studio D (#43).
 * Um HTTP 200 sozinho não prova nada: o site de terceiro do Proffy tinha o mesmo título
 * do repositório. Por isso o job compara o título e também a descrição, que cita o dono.
 */
export interface Marcas {
  titulo: string | null;
  descricao: string | null;
}

function decodificar(texto: string): string {
  return texto
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

/** Lê o `<title>` e o `<meta name="description">` de um HTML. */
export function marcasDoHtml(html: string): Marcas {
  const titulo = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1];
  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((m) => m[0])
    .find((tag) => /(?:^|\s)name\s*=\s*["']description["']/i.test(tag));
  const descricao = meta ? /\bcontent\s*=\s*(["'])([\s\S]*?)\1/i.exec(meta)?.[2] : undefined;
  return {
    titulo: titulo === undefined ? null : decodificar(titulo),
    descricao: descricao === undefined ? null : decodificar(descricao),
  };
}

/** Devolve a lista de problemas; vazia quando o site publicado é o nosso. */
export function problemasDoSite(status: number, htmlPublicado: string, htmlDoRepositorio: string): string[] {
  if (status !== 200) return [`o site respondeu HTTP ${status}, e não 200`];
  const esperado = marcasDoHtml(htmlDoRepositorio);
  const publicado = marcasDoHtml(htmlPublicado);
  const problemas: string[] = [];
  if (!esperado.titulo || !esperado.descricao) {
    problemas.push('o index.html do repositório não tem <title> ou <meta name="description">');
    return problemas;
  }
  if (publicado.titulo !== esperado.titulo) {
    problemas.push(`título publicado "${publicado.titulo ?? '(nenhum)'}", esperado "${esperado.titulo}"`);
  }
  if (publicado.descricao !== esperado.descricao) {
    problemas.push(`descrição publicada "${publicado.descricao ?? '(nenhuma)'}", esperada "${esperado.descricao}"`);
  }
  return problemas;
}
