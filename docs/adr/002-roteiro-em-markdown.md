# ADR-002: roteiro em Markdown no repositório

**Data:** 11/11/2026 · **Situação:** aceita

## Contexto
Os roteiros precisam ser fáceis de escrever, revisar por PR e guardar como histórico do conteúdo do canal.

## Decisão
- Um arquivo por vídeo em `roteiros/<serie>/<slug>.md`, com cabeçalho YAML e um bloco por `## Nome · início–fim`.
- O plugin `roteiros` (`vite.config.ts`) lê os arquivos no build e no dev com `lib/ler-catalogo.ts` e entrega ao navegador o módulo `virtual:roteiros`, com os dados já lidos. O site não tem API nem banco.
- O mesmo plugin para tudo se um roteiro for inválido: sem fonte, sem fala, série que não existe, slug repetido, blocos fora de ordem ou capítulos que não batem. Os testes conferem as mesmas regras. Assim o site publicado nunca abre em branco por causa de um roteiro.
- O Markdown vira HTML no build, com `marked` e renderers próprios (`lib/markdown.ts`): HTML cru vira texto escapado; código vai escapado num `<pre>` focável; links e imagens só aceitam `https:`, `http:`, `mailto:` e `#` (o resto vira texto). Os testes de `Markdown.test.tsx` usam entradas maliciosas.

## Consequências
- Escrever um vídeo novo é só criar um arquivo e abrir um PR.
- O texto dos roteiros entra no JavaScript publicado. Nada privado vai num roteiro.
- `yaml` e `marked` rodam só no build. Desde 12/11/2026 (#9), o JavaScript publicado caiu de 141,39 kB para 95,13 kB com gzip (`npm run build`, antes e depois).
