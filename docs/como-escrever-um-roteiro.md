# Como escrever um roteiro

1. Copie `roteiros/_modelo.md` para `roteiros/<id-da-serie>/<slug>.md`. O nome do arquivo vira o endereço: `/#/v/<slug>`.
2. Confira que a série existe em `roteiros/series.yml`. Se o episódio estava em `planejados`, apague a linha dele de lá.
3. Escreva um bloco por `## Nome · início–fim`, com `### Fala` (obrigatório), `### Tela` e `### Comandos`.
4. Os blocos são contínuos: cada um começa onde o anterior terminou, e o primeiro começa em `0:00`.
5. Os `### Capítulos` de `## Para o YouTube` repetem o início de cada bloco, na mesma ordem.
6. Toda afirmação vem de uma fonte em `fontes`, com `https`. Use os docs e os PRs do repositório e guias oficiais. Escreva com palavras próprias.
7. Rode `npm test`. O teste do catálogo recusa roteiro sem fonte, sem fala, com tempo quebrado ou com capítulos fora de ordem.

## Como falar

- **Fala em tópicos**, não em texto corrido: é para ensinar olhando a câmera, não para ler.
- **Um número no gancho.** "3,3 s para 2,4 s" prende mais que "melhorei o desempenho".
- **Mostre o erro.** O que não funcionou ensina tanto quanto a correção.
- **Um desafio no fim**, de preferência uma issue aberta com `good first issue`.

## Antes de gravar

O modo gravação pede um checklist. Os dois primeiros itens são de segurança: nada de `.env`, token, senha ou dados de outras pessoas na tela. Gravação não se desfaz depois de publicada.

## Situações

| Situação | Quando |
|---|---|
| `planejado` | Só em `series.yml`, sem arquivo |
| `rascunho` | Arquivo escrito, ainda sem revisão do autor |
| `pronto` | Revisado e com o site no ar mostrando a versão do roteiro |
| `gravado` | Gravado, em edição |
| `publicado` | No YouTube; acrescente o link na descrição |
