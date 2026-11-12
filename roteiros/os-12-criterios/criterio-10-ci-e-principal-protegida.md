---
titulo: "Critério 10: CI verde não basta se a principal aceita push"
serie: os-12-criterios
episodio: 2
repositorio: douglasabnovato/engenharia
duracao_alvo: 12 min
publico: Quem já tem CI no GitHub Actions e acha que isso garante que nada quebrado chega à branch principal.
pre_requisitos:
  - Git básico (branch, push e PR)
  - Já ter visto um workflow do GitHub Actions rodar
objetivo: Ao final, a pessoa sabe por que CI sem proteção não impede código quebrado na principal, como montar um ruleset com PR e checks obrigatórios, e como conferir as regras pela API.
situacao: rascunho
resumo: O CI rodava em todo PR, mas um push direto na principal publicava sem passar por ele. Mostro o ruleset que fecha essa porta e a armadilha da API que dizia "não protegida".
fontes:
  - titulo: "Engenharia: régua dos 12 critérios (critério 10)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/arquitetura/padroes.md
  - titulo: "Engenharia: fluxo Git e o ruleset principal-protegida"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/processo/fluxo-git.md
  - titulo: "AirCnC: docs/MVP.md na master (critério 10 Parcial, 09/11)"
    url: https://github.com/douglasabnovato/aircnc/blob/master/docs/MVP.md
  - titulo: "AirCnC: docs/MVP.md na sprint (critério 10 Atende)"
    url: https://github.com/douglasabnovato/aircnc/blob/developer/sprint-2026-11-12/docs/MVP.md
  - titulo: "AirCnC PR #105: critério 10 com a master protegida"
    url: https://github.com/douglasabnovato/aircnc/pull/105
  - titulo: "AirCnC: .github/workflows/ci.yml (jobs backend, frontend, mobile e e2e)"
    url: https://github.com/douglasabnovato/aircnc/blob/master/.github/workflows/ci.yml
  - titulo: "Studio D issue #3: proteger a main e ligar os alertas do Dependabot"
    url: https://github.com/douglasabnovato/studio-d/issues/3
  - titulo: "Render: especificação do Blueprint (autoDeployTrigger)"
    url: https://render.com/docs/blueprint-spec
  - titulo: "GitHub Docs: sobre rulesets"
    url: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
  - titulo: "GitHub Docs: regras disponíveis em rulesets"
    url: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
  - titulo: "GitHub Docs: REST, regras de uma branch"
    url: https://docs.github.com/en/rest/repos/rules
---

## Gancho · 0:00–0:40

### Fala
- Todos os meus repositórios têm CI. Testes, lint e build rodam em cada PR.
- Mesmo assim, no AirCnC, até novembro, qualquer push direto na branch principal entrava sem passar por nada disso. E o Render, que publica a cada commit na principal sem esperar o CI, colocava no ar.
- CI que roda não é CI que bloqueia.
- Neste vídeo: o critério 10 da minha régua, o ruleset que fecha essa porta e uma armadilha da API que dizia "não protegida" para uma branch protegida.

### Tela
Um workflow verde no GitHub Actions. Corte para um `git push origin main` sem PR, aceito sem nenhuma checagem.

## O critério 10 · 0:40–2:00

### Fala
- Na régua, o critério 10 é "entrega confiável": CI verde antes de entrar na principal.
- A evidência pedida tem duas partes: o CI rodando nos PRs e a principal protegida por um ruleset.
- Sem a proteção, o critério fica "Parcial". Não importa quantos testes existam.
- E vale olhar o deploy também. No `render.yaml` do AirCnC, `autoDeployTrigger: commit` publica a cada commit. O Render tem a opção `checksPass`, que espera o CI passar antes de publicar.
- O motivo é simples: o CI só avisa. Quem decide se o código entra é a regra da branch.

### Tela
A linha do critério 10 no `padroes.md` do repositório engenharia.

## O antes · 2:00–3:30

### Fala
- No AirCnC, em 09/11, o `MVP.md` dizia: o CI roda em PR e push, mas a `master` não tem proteção. Critério 10: Parcial.
- O CI tinha quatro jobs: `backend`, `frontend`, `mobile` e `e2e`. Todos rodavam. Nenhum era obrigatório.
- Um PR com o CI vermelho podia ser mesclado. E um push direto nem abria PR.
- Criar a proteção não foi tarefa do agente que escrevia o código. Configuração do repositório é decisão do dono. O agente escreveu o passo a passo numa issue.

### Tela
O histórico do `docs/MVP.md` do AirCnC, na tabela de 09/11 com o critério 10 "Parcial". Depois, os quatro jobs no `ci.yml`.

## O ruleset · 3:30–6:30

### Fala
- O ruleset se chama `principal-protegida` e vale para a branch padrão do repositório.
- Ele tem quatro regras.
- Uma: ninguém apaga a principal.
- Duas: ninguém faz force push nela. O histórico não é reescrito.
- Três: tudo entra por PR. Com zero aprovações exigidas, porque num repositório de uma pessoa só ela mesma mescla.
- Quatro: o merge só libera com os checks verdes. Os nomes são os dos jobs do workflow: `backend`, `frontend`, `mobile` e `e2e`.
- O nome do check precisa bater com o nome do job. Se não bater, o check nunca chega e o PR fica esperando para sempre.
- Ele foi criado em 09/11, à noite. Minutos depois, o PR 105 marcou o critério 10 como Atende, na branch da sprint. A `master` ainda mostra "Parcial" até a sprint entrar nela.

### Tela
O JSON do ruleset no `fluxo-git.md` do repositório engenharia, destacando as quatro regras. Depois, a tela de Settings → Rules → Rulesets do GitHub, **sem mostrar o id do ruleset, a lista de exceções (bypass) nem outras configurações da conta**. Na gravação, nunca rodar `gh api .../rulesets` sem `--jq`: a saída traz ids e links.

### Comandos
```json
// resumo; o JSON completo (target, enforcement e demais parâmetros) está no fluxo-git.md
{
  "name": "principal-protegida",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request", "parameters": { "required_approving_review_count": 0 } },
    { "type": "required_status_checks", "parameters": {
        "required_status_checks": [
          { "context": "backend" }, { "context": "frontend" },
          { "context": "mobile" }, { "context": "e2e" } ] } }
  ]
}
```

## A armadilha da API · 6:30–8:30

### Fala
- Para conferir a proteção, o caminho mais conhecido é o endpoint de branch protection.
- Só que ele é da proteção antiga. Para uma branch protegida só por ruleset, ele responde 404, "Branch not protected".
- Foi exatamente esse 404 que o `MVP.md` do AirCnC registrou em 09/11. Hoje, com o ruleset ativo, o mesmo endpoint ainda responde 404.
- O endpoint certo para rulesets é o de regras da branch. Ele mostra as regras que valem de fato: exclusão, force push, PR e checks.
- Lição: confira com a ferramenta que enxerga a regra que você usa.

### Tela
Terminal com os dois comandos lado a lado: o 404 da proteção antiga e a lista de regras do endpoint novo.

### Comandos
```bash
# proteção antiga: 404 mesmo com o ruleset ativo
gh api repos/douglasabnovato/aircnc/branches/master/protection
# regras que valem na branch, inclusive de rulesets
gh api repos/douglasabnovato/aircnc/rules/branches/master --jq '[.[].type]'
```

## O meu próprio buraco · 8:30–10:00

### Fala
- Para ser honesto: o Studio D, este site de roteiros, ainda não tem o ruleset.
- O CI dele roda em todo PR, e eu mesclo na `main` só com o CI verde. Mas isso é disciplina, não regra.
- No `MVP.md` dele, o critério 10 está como Parcial: falta o ruleset da `main`. A issue 3 tem o passo a passo.
- A diferença para o AirCnC: aqui a publicação no GitHub Pages espera os jobs `verificar` e `e2e`. Um push direto entra na `main`, mas só vai para o ar se o CI passar.
- Prefiro mostrar o buraco a esconder. A régua serve exatamente para isso.

### Tela
A issue 3 do Studio D. Depois, o comando de regras da branch `main` do Studio D, que hoje volta vazio.

### Comandos
```bash
gh api repos/douglasabnovato/studio-d/rules/branches/main --jq 'length'   # 0: nenhuma regra
```

## Desafio · 10:00–11:15

### Fala
- Rode o comando de regras na branch principal dos seus repositórios.
- Se voltar vazio, crie um ruleset com as quatro regras deste vídeo.
- Use os nomes exatos dos jobs do seu workflow nos checks obrigatórios.
- E teste: abra um PR com um teste quebrado e confira que o botão de merge fica bloqueado.

## Encerramento · 11:15–12:00

### Fala
- O CI mostra o problema. O ruleset impede que ele entre.
- No próximo episódio da série: o critério 12, documentação honesta, e o README que prometia um link que não abria.

## Para o YouTube

### Descrição
CI rodando em todo PR não impede que um push direto chegue à branch principal. Mostro o critério 10 da minha régua, o ruleset que exige PR e checks verdes, e a armadilha da API de branch protection, que responde 404 para uma branch protegida por ruleset.

Base do processo: https://github.com/douglasabnovato/engenharia

### Capítulos
0:00 Gancho
0:40 O critério 10
2:00 O antes
3:30 O ruleset
6:30 A armadilha da API
8:30 O meu próprio buraco
10:00 Desafio
11:15 Encerramento

### Tags
github, ci, rulesets, branch protection, github actions, devops, qualidade

### Capa
Um portão aberto com uma esteira de CI verde passando ao lado, e um push entrando pelo portão. Texto: "O CI viu. Mas deixou entrar?"
