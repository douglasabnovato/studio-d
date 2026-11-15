---
titulo: "Painel de Formação: ativação numa comunidade"
serie: pm-na-pratica
episodio: 2
repositorio: learnTECH-community/formacao-dev
duracao_alvo: 12 min
publico: Quem mantém um projeto de comunidade ou de estudo em grupo e quer saber se gente nova está chegando de verdade.
pre_requisitos:
  - Saber o que é uma issue e um pull request no GitHub
  - Ter visto o episódio 1 da série, sobre hipótese com meta, ajuda mas não é obrigatório
objetivo: Ao final, a pessoa define o que é "ativar" no próprio projeto, conta isso com o gh e sabe ler por que o número ainda é zero.
situacao: rascunho
resumo: "O Painel de Formação tem 87 itens feitos e nenhuma pessoa de fora. Ativação é contar a primeira contribuição, não o total."
fontes:
  - titulo: "formacao-dev: README (como funciona)"
    url: https://github.com/learnTECH-community/formacao-dev/blob/main/README.md
  - titulo: "formacao-dev: docs/MVP.md (hipótese e critérios)"
    url: https://github.com/learnTECH-community/formacao-dev/blob/main/docs/MVP.md
  - titulo: "formacao-dev: CATALOGO.md (progresso e trilhas T1, T2, T8 e T11)"
    url: https://github.com/learnTECH-community/formacao-dev/blob/main/CATALOGO.md
  - titulo: "formacao-dev: CONTRIBUTING.md"
    url: https://github.com/learnTECH-community/formacao-dev/blob/main/CONTRIBUTING.md
  - titulo: "formacao-dev: docs/publicar.md (Pages travado até a configuração)"
    url: https://github.com/learnTECH-community/formacao-dev/blob/main/docs/publicar.md
  - titulo: "formacao-dev: docs/dados-pessoais.md (quem fez cada item)"
    url: https://github.com/learnTECH-community/formacao-dev/blob/main/docs/dados-pessoais.md
  - titulo: "CHAOSS: métrica New Contributors"
    url: https://chaoss.community/kb/metric-new-contributors/
  - titulo: "CHAOSS: métrica Time to First Response"
    url: https://chaoss.community/kb/metric-time-to-first-response/
  - titulo: "GitHub Docs: rótulos para contribuições, incluindo good first issue"
    url: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/encouraging-helpful-contributions-to-your-project-with-labels
  - titulo: "Amplitude: glossário, taxa de ativação"
    url: https://amplitude.com/glossary/terms/activation-rate
  - titulo: "GitHub CLI: gh pr list"
    url: https://cli.github.com/manual/gh_pr_list
---

## Gancho · 0:00–0:40

### Fala
- O Painel de Formação, da comunidade learnTECH, tem 87 de 161 itens do catálogo feitos.
- Parece uma comunidade ativa. Só que os 81 PRs mesclados no repositório até 15/11, na sprint ou na `main`, têm o mesmo autor. Pessoas de fora: zero.
- Neste vídeo: o que é ativação numa comunidade, como contar com o `gh`, e o que o projeto tem hoje que afasta a primeira pessoa.

### Tela
A linha "Progresso: 87 de 161 itens" no `CATALOGO.md`. Corte para o terminal com a contagem de autores dos PRs mesclados.

## O que o projeto promete · 0:40–2:30

### Fala
- O formacao-dev é uma formação fullstack em comunidade, guiada pelas trilhas do roadmap.sh, com um catálogo próprio de itens práticos.
- O fluxo está no README: a pessoa escolhe um item, comenta na issue que vai fazer, pratica no painel e abre o PR com o código do item no título.
- O item só conta como feito quando o PR chega à `main`.
- A hipótese está no `MVP.md`: itens pequenos, num projeto comum e com o progresso visível, farão a comunidade concluir trilhas.
- E o "saberemos quando" está lá: 3 pessoas concluírem a trilha T2 em 4 semanas, contadas a partir de 10/11/2026. Ou seja, até 08/12.

### Tela
A seção "Como funciona" do README. Depois, a seção "Hipótese" do `docs/MVP.md`.

## Total não é ativação · 2:30–4:30

### Fala
- O número de itens feitos mede o projeto, não a comunidade. Um mantenedor sozinho, ou um agente de IA, sobe esse número.
- Em produto, a Amplitude define taxa de ativação como quantos usuários novos completam uma ação-chave.
- Numa comunidade aberta, o CHAOSS, um projeto da Linux Foundation que define métricas de saúde de comunidades open source, tem uma métrica para isso: New Contributors, o número de pessoas que fazem a primeira contribuição.
- O CHAOSS conta como contribuição um commit, uma issue, um PR ou uma revisão de código, entre outras.
- Para o painel, eu proponho uma ação-chave mais estreita: o primeiro PR de item mesclado na `main`. É o momento em que o item da pessoa conta no catálogo.
- E a hipótese pede 3 pessoas concluindo uma trilha inteira. Antes disso, cada uma tem de passar por esse primeiro PR. Sem ativação, a meta de conclusão é impossível.

### Tela
O glossário da Amplitude, na taxa de ativação. Depois, a página da métrica New Contributors do CHAOSS.

## Contar com o gh · 4:30–6:15

### Fala
- Dá para contar sem ferramenta paga, só com o GitHub CLI.
- O primeiro comando lista os PRs mesclados e agrupa por autor. Hoje ele devolve um autor só, com 81 PRs. O `--limit 500` basta para este repositório; num maior, aumente.
- O segundo conta a outra ponta do funil: quantas issues para quem está começando estão abertas, e quantos comentários elas têm.
- O resultado de 15/11: duas issues com o rótulo `boa-primeira-issue`, os itens T1.2 e T1.3, e um comentário no total, do próprio mantenedor.
- Por fim, o repositório: criado em 10/11, sem fork, e com as Discussions ligadas, mas nenhuma criada.

### Tela
O terminal rodando os comandos, com o resultado de cada um. Na gravação, esconder os nomes de usuário da saída.

### Comandos
```bash
R=learnTECH-community/formacao-dev

# PRs mesclados por autor: quantos autores e quantos PRs cada um
gh pr list -R $R --state merged --limit 500 --json author \
  -q '[.[].author.login] | group_by(.) | {autores: length, prs: map(length)}'

# a porta de entrada: issues para começar e quantos comentários têm
gh issue list -R $R --label boa-primeira-issue --state open \
  --json number,title,comments -q '.[] | "\(.number) \(.title) \(.comments|length)"'
```

## Por que ninguém chegou · 6:15–8:15

### Fala
- Quatro coisas no próprio repositório explicam o zero, e nenhuma é falta de código.
- Primeiro, o painel não está publicado. O workflow do Pages existe, mas fica travado até o responsável ligar o Pages nas configurações e a variável `PAGES_ATIVO`. Quem chega não vê o progresso: tem de clonar e rodar.
- Segundo, as trilhas de quem está começando são as mais vazias. A T1, de Git e GitHub, tem 1 de 14 itens feitos. A T8, de code review, tem 0 de 13. A T11, de comunidade, 0 de 10. Já a T5, de backend, está completa, 15 de 15, e a T10, de segurança, tem 13 de 14.
- Terceiro, o rótulo. O projeto usa `boa-primeira-issue`, em português. O GitHub diz que o rótulo `good first issue` aumenta a chance de a issue ser mostrada em vários lugares do site. Nenhuma issue tem esse rótulo.
- Quarto, a recepção. O item que acolhe uma pessoa nova, T11.4, e o código de conduta, T11.10, ainda não foram feitos.
- E tem um detalhe na meta: a T2 cresceu para 13 itens. "Concluir a T2" hoje pede 13 PRs de cada pessoa, em 4 semanas.

### Tela
O passo do `PAGES_ATIVO` no `docs/publicar.md`. Depois, as trilhas T1, T8 e T11 no `CATALOGO.md`, lado a lado com a T5. Por fim, a página do GitHub sobre o `good first issue`.

## Melhoria: ativação escrita no MVP · 8:15–10:30

### Fala
- A melhoria é no `MVP.md`, e ela não troca a hipótese. Ela escreve o passo que vem antes.
- Primeiro, a definição: ativada é a pessoa que não é mantenedora e tem o primeiro PR de item mesclado na `main`.
- Segundo, uma segunda métrica, também do CHAOSS: o tempo até a primeira resposta. O CHAOSS mede o tempo entre a criação de algo que pede atenção, como uma issue ou um PR, e a primeira resposta, e pede para não contar resposta de bot. A meta que proponho: resposta de um mantenedor em até 48 horas. Quem comenta "vou fazer" e não ouve nada vai embora.
- Terceiro, a leitura, escrita antes de ter dado. Toda semana, os dois comandos do bloco anterior, com o resultado no diário do projeto.
- E as ações que já estão no catálogo ganham ordem: publicar o painel, que depende do responsável; preparar as issues para começar, o T11.9; e pôr também o rótulo `good first issue` nelas.
- Isto ainda não está no repositório. É uma proposta para o formacao-dev, que segue o fluxo dele, por PR.

### Tela
O editor com a seção "Hipótese" do `docs/MVP.md`, antes e depois.

### Comandos
```markdown
**Ativação (passo antes da hipótese):** pessoa que não é mantenedora
com o primeiro PR de item mesclado na `main`.
Meta: 3 pessoas ativadas até 08/12/2026.

**Primeira resposta:** issue ou PR de pessoa nova respondido por um
mantenedor em até 48 horas, sem contar bot (CHAOSS, Time to First Response).

**Leitura:** toda semana, `gh pr list -R learnTECH-community/formacao-dev --state merged`
por autor e `gh issue list --label boa-primeira-issue`, com o resultado no diário.
```

## Desafio · 10:30–11:30

### Fala
- Pegue um projeto seu que aceita contribuição, ou um de estudo em grupo.
- Rode o primeiro comando e conte quantos autores diferentes têm PR mesclado.
- Depois, escreva numa frase qual é a primeira ação que faz alguém "entrar" no seu projeto. Se você não consegue contar essa ação hoje, comece por aí.

## Encerramento · 11:30–12:00

### Fala
- Um catálogo cheio feito por uma pessoa só é um portfólio, não uma comunidade. A ativação é o primeiro número que diz a diferença.
- Este é o último episódio planejado da série. O próximo tema sai do que vocês pedirem nos comentários.

## Para o YouTube

### Descrição
O Painel de Formação tem 87 itens do catálogo feitos e nenhuma pessoa de fora. Mostro o que é ativação numa comunidade, com as métricas do CHAOSS, como contar a primeira contribuição com o GitHub CLI e o que o próprio repositório tem hoje que afasta quem chega.

Repositório: https://github.com/learnTECH-community/formacao-dev

### Capítulos
0:00 Gancho
0:40 O que o projeto promete
2:30 Total não é ativação
4:30 Contar com o gh
6:15 Por que ninguém chegou
8:15 Melhoria: ativação escrita no MVP
10:30 Desafio
11:30 Encerramento

### Tags
product management, ativação, comunidade, open source, chaoss, github, métricas, mvp

### Capa
Um contador grande marcando 87 e, ao lado, um contador pequeno marcando 0. Texto: "87 itens. 0 pessoas novas."
