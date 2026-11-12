# Como escrever um roteiro

1. Copie `roteiros/_modelo.md` para `roteiros/<id-da-serie>/<slug>.md`. O nome do arquivo vira o endereço: `/#/v/<slug>`.
2. Confira que a série existe em `roteiros/series.yml`. Se o episódio estava em `planejados`, apague a linha dele de lá.
3. Escreva um bloco por `## Nome · início–fim`, com `### Fala` (obrigatório), `### Tela` e `### Comandos`.
4. Os blocos são contínuos: cada um começa onde o anterior terminou, e o primeiro começa em `0:00`.
5. Os `### Capítulos` de `## Para o YouTube` repetem o início de cada bloco, na mesma ordem.
6. Toda afirmação vem de uma fonte em `fontes`, com `https`. Use os docs e os PRs do repositório e guias oficiais. Escreva com palavras próprias.
7. Rode `npm test`. O teste do catálogo recusa roteiro sem fonte, sem fala, com tempo quebrado ou com capítulos fora de ordem.
8. Peça a **revisão independente de fatos** antes do merge: alguém (ou um agente) que confere cada afirmação contra as fontes, sem ter escrito o roteiro. Os achados entram no PR, corrigidos.

## Do repositório ao roteiro

Cada roteiro tem duas issues: uma no `studio-d` (escrever o roteiro) e uma no repositório de origem, com o rótulo `roteiro` (deixar o repositório pronto para o vídeo). As duas se citam.

Fluxo de um roteiro, do estudo ao merge na sprint:

1. **Estudar:** clone novo do repositório de origem; README, `docs/MVP.md`, plano, testes, PRs mesclados e issues abertas. Conferir o link publicado com `curl` e comparar o `<title>` com o repositório.
2. **Escolher a história:** um antes e depois real, achado no histórico (commit ou PR), e uma issue aberta para a "Melhoria".
3. **Escrever** no modelo, com as fontes conferidas (`curl` em cada link).
4. **Validar:** `npx vitest run` e `npm run build`.
5. **Revisão de fatos** independente, e corrigir tudo o que ela achar.
6. **PR para a sprint**, com CI verde, e comentário de evidência nas duas issues.

## Regras de fato (aprendidas nos roteiros 2 e 3)

- **Saída real de comando.** Mostre o que a ferramenta imprime de verdade: o `node --test` termina com `# pass 11`, não com "11 passed".
- **Só o que o registro mostra.** Se o axe rodou em 4 telas, diga 4 telas, e não "em cada tela".
- **Esboço não é código do repositório.** Código que ainda não existe leva o rótulo "esboço para a issue N", com os imports e o que falta.
- **Estado honesto.** Se o `MVP.md` do repositório diverge da régua, o roteiro diz isso e a divergência vira comentário na issue de origem.
- **Fonte na principal.** Prefira links para a branch principal. Se o conteúdo só existe numa sprint, diga isso no PR.
- **Segredo no histórico.** Código antigo com senha ou URI aparece só no trecho necessário, e a linha do segredo vai **borrada na edição**. Nunca copie a credencial no roteiro, no PR ou na revisão.

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
