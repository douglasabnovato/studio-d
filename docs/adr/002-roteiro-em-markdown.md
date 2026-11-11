# ADR-002: roteiro em Markdown no repositório

**Data:** 11/11/2026 · **Situação:** aceita

## Contexto
Os roteiros precisam ser fáceis de escrever, revisar por PR e guardar como histórico do conteúdo do canal.

## Decisão
- Um arquivo por vídeo em `roteiros/<serie>/<slug>.md`, com cabeçalho YAML e um bloco por `## Nome · início–fim`.
- O Vite embute os arquivos como texto (`import.meta.glob` com `?raw`), e o navegador os lê com `lib/roteiro.ts`. O site não tem API nem banco.
- O plugin `validar-roteiros` (`vite.config.ts`) lê os mesmos arquivos no início do build e do dev, e para tudo se algum for inválido: sem fonte, sem fala, série que não existe, slug repetido, blocos fora de ordem ou capítulos que não batem. Os testes conferem as mesmas regras. Assim o site publicado nunca abre em branco por causa de um roteiro.
- O Markdown é mostrado com `marked`, com renderers próprios: HTML cru vira texto escapado; código vai escapado num `<pre>` focável; links e imagens só aceitam `https:`, `http:`, `mailto:` e `#` (o resto vira texto). Os testes de `Markdown.test.tsx` usam entradas maliciosas.

## Consequências
- Escrever um vídeo novo é só criar um arquivo e abrir um PR.
- O texto dos roteiros entra no JavaScript publicado. Nada privado vai num roteiro.
- `yaml` e `marked` pesam no pacote (cerca de 139 KB com gzip no total). Se o LCP pedir, a leitura passa para o build (issue de próximos passos).
