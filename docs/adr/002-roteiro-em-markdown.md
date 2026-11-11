# ADR-002: roteiro em Markdown no repositório

**Data:** 11/11/2026 · **Situação:** aceita

## Contexto
Os roteiros precisam ser fáceis de escrever, revisar por PR e guardar como histórico do conteúdo do canal.

## Decisão
- Um arquivo por vídeo em `roteiros/<serie>/<slug>.md`, com cabeçalho YAML e um bloco por `## Nome · início–fim`.
- O Vite lê os arquivos no build (`import.meta.glob` com `?raw`); o site não tem API nem banco.
- Um roteiro inválido quebra o build e os testes: sem fonte, sem fala, com tempo fora de ordem ou série que não existe.
- O Markdown é mostrado com `marked`. HTML cru dentro do roteiro vira texto escapado; código vira `<pre>` com o texto escapado.

## Consequências
- Escrever um vídeo novo é só criar um arquivo e abrir um PR.
- O texto dos roteiros entra no JavaScript publicado. Nada privado vai num roteiro.
- `yaml` e `marked` pesam no pacote (cerca de 139 KB com gzip no total). Se o LCP pedir, a leitura passa para o build (issue de próximos passos).
