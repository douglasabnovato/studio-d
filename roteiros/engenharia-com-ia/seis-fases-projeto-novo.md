---
titulo: "Seis fases de um projeto novo, com portões"
serie: engenharia-com-ia
episodio: 2
repositorio: douglasabnovato/engenharia
duracao_alvo: 13 min
publico: Quem começa projetos pelo código e só no fim pensa em hospedagem, métrica e dados pessoais.
pre_requisitos:
  - Já ter publicado ou tentado publicar um projeto
  - Saber o que é um PR e um CI
objetivo: Ao final, a pessoa conhece as seis fases com portões do meu processo, de onde cada uma veio, e sabe dizer em que portão o projeto dela está parado.
situacao: rascunho
resumo: "Depois de levar 39 repositórios a MVP, escrevi o caminho para um projeto novo: seis fases: cinco terminam com uma pergunta de sim ou não, e a última é contínua. Mostro de onde elas vieram e em que portão o próprio Studio D parou."
fontes:
  - titulo: "Engenharia: processo por repositório (seção Projeto novo: seis fases)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/ia/processo-repositorio.md
  - titulo: "Engenharia: aprendizados (segurança e issues)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/ia/aprendizados.md
  - titulo: "Engenharia: decisão de 10/11/2026 (critério 5 e a conta de medição)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/decisoes/2026-11-10-ciclo-faixa-90.md
  - titulo: "Studio D: docs/MVP.md (criado em 11/11/2026)"
    url: https://github.com/douglasabnovato/studio-d/blob/main/docs/MVP.md
  - titulo: "Studio D: docs/PLANO-DE-ACAO.md (hipótese e hospedagem)"
    url: https://github.com/douglasabnovato/studio-d/blob/main/docs/PLANO-DE-ACAO.md
  - titulo: "Studio D: .github/workflows/ci.yml (publicar depois de verificar e e2e)"
    url: https://github.com/douglasabnovato/studio-d/blob/main/.github/workflows/ci.yml
  - titulo: "Studio D: ADR-005, a Fase 1 sem as cinco pessoas"
    url: https://github.com/douglasabnovato/studio-d/blob/developer/sprint-2026-11-19/docs/adr/005-fase-1-sem-entrevistas.md
  - titulo: "Studio D issue #4: conta de medição"
    url: https://github.com/douglasabnovato/studio-d/issues/4
  - titulo: "Cooper (1990): Stage-gate systems, Business Horizons"
    url: https://doi.org/10.1016/0007-6813(90)90040-I
  - titulo: "Walking Skeleton (esqueleto ambulante), wiki do C2"
    url: https://wiki.c2.com/?WalkingSkeleton
  - titulo: "Jeff Gothelf: livros (Lean UX)"
    url: https://jeffgothelf.com/books/
  - titulo: "Teresa Torres: Continuous Discovery Habits"
    url: https://www.producttalk.org/continuous-discovery-habits/
  - titulo: "Continuous Delivery (Humble; Farley)"
    url: https://continuousdelivery.com/
  - titulo: "DORA: as métricas de entrega (quatro originais e a quinta)"
    url: https://dora.dev/guides/dora-metrics-four-keys/
---

## Gancho · 0:00–0:40

### Fala
- Quase todo projeto meu começou pelo código. A métrica, a hospedagem e os dados pessoais ficavam para o fim.
- Quando levei 39 repositórios a MVP, foi exatamente no fim que tudo travou.
- Então escrevi o caminho ao contrário para o próximo projeto: seis fases. As cinco primeiras terminam com uma pergunta de sim ou não. A última é contínua.
- Neste vídeo: as seis fases, de onde cada uma veio, e o portão em que o meu projeto mais novo parou.

### Tela
A tabela "Projeto novo: seis fases" no `ia/processo-repositorio.md` do repositório engenharia.

## Quatro lições, quatro regras · 0:40–2:45

### Fala
- As fases nasceram de quatro erros que se repetiram no portfólio.
- Um: os critérios de MVP foram escritos depois do código. Aí o critério vira descrição do que já existe, não meta.
- Dois: hospedagem e contas ficaram para o fim e viraram o gargalo. Em 10/11, a medição de uso faltava em 15 repositórios, todos os de nível vitrine e produto, porque nenhuma conta de medição tinha sido criada.
- Três: dados pessoais em bancos versionados e em issues públicas, em 4 repositórios e 12 issues.
- Quatro: 117 de 179 issues iniciais, sem objetivo nem critério, acabaram fechadas como não planejadas.
- Cada erro virou uma regra: `MVP.md` no primeiro dia, contas e esqueleto no ar logo cedo, LGPD antes do primeiro commit e toda issue com critérios.

### Tela
O parágrafo "Lições que geraram essas fases" no `processo-repositorio.md`. Depois, as linhas dos 4 repositórios e 12 issues e das 117 de 179 em `aprendizados.md`. **Não abrir na tela a decisão de 10/11**: ela é fonte do número 15, mas cita e-mails e o nome de uma pessoa em outras linhas.

## Portões, não etapas · 2:45–4:00

### Fala
- A ideia de portão vem do Stage-Gate, de Robert Cooper, de 1990: entre uma etapa e outra, uma decisão de seguir ou parar.
- No meu processo, o portão é uma pergunta que se responde com sim ou não, sem "quase".
- Se a resposta é não, o projeto não avança de fase. Ele volta e resolve, ou muda de rumo por escrito.
- A duração de cada fase é uma referência, não um prazo. O que manda é o portão.

### Tela
A coluna "Portão" da tabela, destacando as perguntas. Depois, a página do artigo de Cooper.

## Fases 0 e 1: enquadrar e descobrir · 4:00–6:00

### Fala
- Fase 0, enquadrar, de 2 a 5 dias. O portão: qualquer pessoa entende o problema em uma frase, e existe um número que diz se a aposta deu certo?
- Sem o número, não dá para saber depois se valeu. É aqui que nasce a hipótese com meta.
- Fase 1, descobrir, de 1 a 2 semanas. O portão: 3 de 5 pessoas confirmaram o problema e concluíram o fluxo num protótipo?
- Essa fase vem do Lean UX, de Jeff Gothelf e Josh Seiden, e da descoberta contínua, de Teresa Torres: conversar com quem tem o problema antes de construir a solução.

### Tela
As linhas das fases 0 e 1 da tabela. Depois, as páginas do Lean UX e do livro de Teresa Torres.

## Fase 2: o esqueleto no ar · 6:00–7:45

### Fala
- Fase 2, fundar, numa sprint. É a mais importante para mim, porque ataca o gargalo.
- O portão: um commit na principal chega ao site sem passo manual, e a medição já registra visitas?
- É o esqueleto ambulante, de Alistair Cockburn: a menor versão que faz uma função pequena de ponta a ponta e liga as partes principais, do código ao ar.
- Conta, hospedagem, CI e medição entram aqui. Se algo depende de uma conta que só eu crio, aparece na primeira semana, não na última.

### Tela
A linha da fase 2 na tabela. Depois, a página do Walking Skeleton.

## Fases 3, 4 e 5 · 7:45–9:30

### Fala
- Fase 3, construir, em sprints de uma semana. O portão: o fluxo principal funciona no site publicado, e uma pessoa o conclui sem ajuda?
- Fase 4, validar e decidir. A métrica atingiu a meta? Se não, a mudança de rumo está escrita? Não atingir a meta é resultado. Não escrever o que muda é que é falha.
- Fase 5, operar e evoluir. Ela é contínua e não tem pergunta: tem uma rotina. Dependabot semanal, revisão mensal do backlog e as métricas DORA.
- As métricas DORA medem a entrega. As quatro originais: com que frequência se publica, quanto tempo um commit leva até o ar, quantas mudanças falham e quanto tempo leva para recuperar de um deploy que falhou.
- Hoje o DORA usa cinco. A quinta é a taxa de retrabalho: quantos deploys foram feitos às pressas por causa de um incidente.

### Tela
As linhas das fases 3, 4 e 5 da tabela. Depois, a página das métricas no site do DORA.

## O Studio D nos portões · 9:30–11:45

### Fala
- O Studio D, este site de roteiros, é o primeiro projeto que nasceu depois das fases. Vamos passar por elas, com honestidade.
- Fase 0: passou. O problema está numa frase no README, e a hipótese tem meta: 4 vídeos publicados em 30 dias depois do primeiro.
- Fase 1: não fiz. O público sou eu, que gravo os vídeos. Não houve 5 pessoas para ouvir. A resposta do portão é não, e eu registrei numa decisão escrita, a ADR 5, que segui como risco aceito.
- Fase 2: meio portão. O `MVP.md` foi criado em 11/11, no mesmo dia do primeiro commit e no mesmo PR do primeiro código. Ligar o Pages foi um passo único, feito uma vez. Depois disso, um commit na `main` vai ao ar sozinho, mas só depois de os jobs `verificar` e `e2e` passarem. Só que a medição de visitas ainda não existe: depende da conta, que é a issue 4.
- Pela regra, o portão da fase 2 ainda é "não". E isso me diz exatamente o que fazer antes de cobrar a fase 4: sem medição, não vou saber se a meta foi atingida.
- Fase 5: o Dependabot já roda toda semana.

### Tela
O README e o `docs/MVP.md` do Studio D, na linha "Criado em 11/11/2026". Depois, a ADR 5. Depois, o job `publicar` no `ci.yml`, com o `needs` de `verificar` e `e2e`. Por fim, a issue 4.

## Desafio · 11:45–12:30

### Fala
- Pegue o projeto em que você está agora e responda os portões, de 0 a 5, só com sim ou não.
- O primeiro "não" é a sua fase de verdade, não importa quanto código já exista.
- Conta nos comentários em qual portão o seu projeto parou.

## Encerramento · 12:30–13:00

### Fala
- Fase é o que você já provou, não o que você já construiu.
- No próximo vídeo começa a série "Uma tela, seis telas", com o Movies na TV.

## Para o YouTube

### Descrição
Seis fases para um projeto novo, cada uma com um portão de sim ou não: enquadrar, descobrir, esqueleto no ar, construir, validar e operar. Mostro os quatro erros do meu portfólio que geraram essas fases, as referências de cada uma (Stage-Gate, Lean UX, descoberta contínua, esqueleto ambulante e DORA) e o portão em que o meu projeto mais novo parou.

Base do processo: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/ia/processo-repositorio.md (troque pelo link da `main` depois do merge da sprint)

### Capítulos
0:00 Gancho
0:40 Quatro lições, quatro regras
2:45 Portões, não etapas
4:00 Fases 0 e 1: enquadrar e descobrir
6:00 Fase 2: o esqueleto no ar
7:45 Fases 3, 4 e 5
9:30 O Studio D nos portões
11:45 Desafio
12:30 Encerramento

### Tags
gestão de produto, mvp, stage-gate, lean ux, dora, processo, engenharia de software

### Capa
Seis portões em fila: o primeiro aberto, o segundo com uma placa "risco aceito" e o terceiro fechado, com um projeto parado na frente dele. Texto: "Em qual portão o seu projeto parou?"
