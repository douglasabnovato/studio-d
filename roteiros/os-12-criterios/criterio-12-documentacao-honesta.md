---
titulo: "Critério 12: o link respondia 200, mas o site era de outra pessoa"
serie: os-12-criterios
episodio: 3
repositorio: douglasabnovato/engenharia
duracao_alvo: 12 min
publico: Quem tem projetos no GitHub com link "veja no ar" no README e nunca mais abriu esse link.
pre_requisitos:
  - Saber ler um README e um package.json
  - Ter um terminal com curl
objetivo: Ao final, a pessoa sabe conferir se o README diz a verdade, com o comando que roda, o link que responde e o site que é mesmo o do repositório, e como automatizar parte disso.
situacao: rascunho
resumo: Um link do README respondia 200 e servia o projeto de outra pessoa. Mostro o critério 12 da régua e três conferências que levam um minuto.
fontes:
  - titulo: "Engenharia: régua dos 12 critérios (critério 12)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/arquitetura/padroes.md
  - titulo: "Engenharia: aprendizados (análise e honestidade dos documentos)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/ia/aprendizados.md
  - titulo: "Proffy: docs/AVALIACAO.md (correção de 06/11/2026)"
    url: https://github.com/douglasabnovato/proffy/blob/developer/sprint-2026-11-12/docs/AVALIACAO.md
  - titulo: "Proffy PR #25: o link de outro projeto sai do README"
    url: https://github.com/douglasabnovato/proffy/pull/25
  - titulo: "AirCnC PR #69: retira do README os endereços fora do ar"
    url: https://github.com/douglasabnovato/aircnc/pull/69
  - titulo: "AirCnC: README (publicação no Render)"
    url: https://github.com/douglasabnovato/aircnc/blob/master/Readme.md
  - titulo: "Studio D: src/lib/links.test.ts"
    url: https://github.com/douglasabnovato/studio-d/blob/main/src/lib/links.test.ts
  - titulo: "Studio D: docs/MVP.md (critério 12)"
    url: https://github.com/douglasabnovato/studio-d/blob/main/docs/MVP.md
  - titulo: "Studio D issue #43: conferir toda semana que o site responde"
    url: https://github.com/douglasabnovato/studio-d/issues/43
  - titulo: "curl: manual (opção -w)"
    url: https://curl.se/docs/manpage.html
  - titulo: "npm: npm run (lista os scripts)"
    url: https://docs.npmjs.com/cli/v10/commands/npm-run-script
  - titulo: "GitHub Docs: evento schedule do Actions"
    url: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule
---

## Gancho · 0:00–0:40

### Fala
- O README do Proffy tinha um link para o projeto no ar. Ele respondia 200, tudo certo.
- Só que o site que abria era o Proffy de outra pessoa: outro tema, outra biblioteca, caminhos que não existem no meu repositório.
- Um 200 só diz que algum servidor respondeu. Não diz que é o seu projeto.
- Neste vídeo: o critério 12 da minha régua, documentação honesta, e três conferências que levam um minuto.

### Tela
O README do Proffy com o link antigo. Corte para o site aberto, com um tema diferente do repositório.

## O critério 12 · 0:40–1:45

### Fala
- O critério 12 pergunta: qualquer pessoa consegue rodar o projeto só com o README?
- A evidência pedida tem duas partes. Os comandos do README conferidos contra o `package.json`. E o link publicado só se ele responder hoje.
- "Hoje" é a palavra importante. Link de projeto de estudo cai sem aviso: plano gratuito que expira, serviço renomeado, conta trocada.

### Tela
A linha do critério 12 no `padroes.md` do repositório engenharia.

## Mentira 1: o link que não abre · 1:45–3:30

### Fala
- No AirCnC, em 01/11, os dois endereços do README estavam fora do ar. Testei duas vezes, com dois minutos de intervalo.
- A correção foi tirar os links e apontar para a seção "Como executar". O deploy continuou possível: o `render.yaml` ficou no repositório.
- Depois, em 09/11, o projeto voltou ao ar no Render, com um endereço novo para a API. Só então o link voltou ao README.
- Conferi hoje, 12/11: os dois respondem.

### Tela
O PR 69 do AirCnC. Depois, o terminal com o `curl` nos dois endereços de hoje.

### Comandos
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://aircnc-web.onrender.com
curl -s https://aircnc-api-45yf.onrender.com/health
```

## Mentira 2: o link que abre outra coisa · 3:30–5:30

### Fala
- Este é o caso do gancho. Em 06/11, `proffy.onrender.com` respondia 200.
- Mas o HTML não batia com o repositório: outro tema, a biblioteca `scrollreveal`, que o meu Proffy não usa, e caminhos de arquivo que não existem aqui.
- O nome `.onrender.com` é de quem pegou primeiro. Outra conta tinha um serviço com esse nome.
- O link saiu do README, a correção ficou registrada no `AVALIACAO.md` e a decisão de publicar com outro nome virou issue.
- A conferência que pega isso: comparar o `<title>` do site com o do repositório. Leva um comando.

### Tela
A "Correção de 06/11/2026" no `docs/AVALIACAO.md` do Proffy. Depois, o terminal comparando os dois `<title>` do Studio D, que batem.

### Comandos
```bash
# o título publicado é o mesmo do repositório?
curl -s https://douglasabnovato.github.io/studio-d/ | grep -o "<title>[^<]*</title>"
grep -o "<title>[^<]*</title>" index.html
```

## Mentira 3: o comando que não existe · 5:30–7:00

### Fala
- A terceira conferência é a mais simples: todo comando do README existe no `package.json`?
- O `npm run`, sem nada depois, lista os scripts do projeto. É só comparar com o README.
- Se o README manda rodar `npm run dev` e não existe `dev`, quem chega desiste no primeiro minuto.
- E vale ler o README procurando promessas: "o CI publica o site", "os testes cobrem tudo". Abra o workflow e confira.

### Tela
O terminal com `npm run` no Studio D, lado a lado com a seção "Como rodar" do README.

### Comandos
```bash
npm run   # lista os scripts que existem de verdade
```

## Automatizar o que dá · 7:00–9:15

### Fala
- No Studio D, um teste confere que todo link relativo do README e da pasta `docs` aponta para um arquivo que existe. Link quebrado dentro do repositório para o CI.
- E o link do site só entrou no README depois de responder 200, com o comando e a data no `MVP.md`.
- O que falta é o link de fora: hoje eu confiro à mão. A issue 43 propõe um job agendado, uma vez por semana, que faz o `curl` e compara o `<title>`.
- Se o site cair ou trocar de dono, o job fica vermelho na aba Actions. Sem depender de eu lembrar.

### Tela
`src/lib/links.test.ts` do Studio D. Depois, a issue 43 e a página do evento `schedule` na documentação do GitHub Actions.

### Comandos
```yaml
# esboço para a issue 43: .github/workflows/link-publicado.yml
on:
  schedule:
    - cron: "0 9 * * 1"   # toda segunda, 9h UTC
jobs:
  link:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          url=https://douglasabnovato.github.io/studio-d/
          test "$(curl -s -o /dev/null -w '%{http_code}' $url)" = 200
          test "$(curl -s $url | grep -o '<title>[^<]*</title>')" = "$(grep -o '<title>[^<]*</title>' index.html)"
```

## Desafio · 9:15–11:15

### Fala
- Escolha três repositórios seus com link no README.
- Para cada um: `curl` no link, compare o `<title>` e rode `npm run` para conferir os comandos.
- Link que não responde hoje sai do README, com a data anotada. Ele volta quando voltar a responder.
- Conta nos comentários quantos dos seus três passaram.

## Encerramento · 11:15–12:00

### Fala
- Documentação honesta não é documentação longa. É a que você conferiu hoje.
- No próximo vídeo começa a série "Engenharia com IA": briefs, revisor independente e permissões que dizem não.

## Para o YouTube

### Descrição
Um link do README respondia 200 e servia o projeto de outra pessoa. Mostro o critério 12 da minha régua, documentação honesta, e três conferências de um minuto: o link responde hoje, o site é mesmo o do repositório e os comandos existem no package.json.

Base do processo: https://github.com/douglasabnovato/engenharia

### Capítulos
0:00 Gancho
0:40 O critério 12
1:45 Mentira 1: o link que não abre
3:30 Mentira 2: o link que abre outra coisa
5:30 Mentira 3: o comando que não existe
7:00 Automatizar o que dá
9:15 Desafio
11:15 Encerramento

### Tags
documentação, readme, github, curl, github actions, qualidade, portfólio

### Capa
Um README com um selo verde "200 OK" e, ao lado, um site com outra cara. Texto: "Respondeu 200. Mas é o seu site?"
