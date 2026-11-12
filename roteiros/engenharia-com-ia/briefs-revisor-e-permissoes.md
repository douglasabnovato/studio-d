---
titulo: "Briefs, revisor independente e permissões que dizem não"
serie: engenharia-com-ia
episodio: 1
repositorio: douglasabnovato/engenharia
duracao_alvo: 14 min
publico: Quem já usa um agente de IA para escrever código e quer passar de "uma conversa por vez" para vários repositórios com processo.
pre_requisitos:
  - Git básico (branch, PR e merge)
  - Já ter pedido código a um assistente de IA
objetivo: Ao final, a pessoa sabe escrever um brief que funciona como único contexto do agente, por que o revisor recebe o diff e não a conclusão, e o que fazer quando uma permissão diz não.
situacao: rascunho
resumo: "Agentes de IA trabalharam 39 repositórios do meu portfólio. O que segurou a qualidade não foi o código que eles escreveram, e sim três peças em volta: o brief, o revisor que não viu o código e as permissões que dizem não."
fontes:
  - titulo: "Engenharia: como trabalhamos com IA (papéis, briefs, revisor e permissões)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/ia/como-trabalhamos.md
  - titulo: "Engenharia: processo por repositório"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/ia/processo-repositorio.md
  - titulo: "Engenharia: aprendizados (Git e permissões do agente)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/ia/aprendizados.md
  - titulo: "Engenharia: modelo de brief do ciclo curto"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/ia/briefs/ciclo-curto.md
  - titulo: "Engenharia: decisão de 09/11/2026 (ciclo, merges e desvio registrado)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/decisoes/2026-11-09-ciclo.md
  - titulo: "Engenharia: decisão de 10/11/2026 (39 repositórios, 340 de 419 critérios)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/decisoes/2026-11-10-ciclo-faixa-90.md
  - titulo: "Engenharia issue #9: revisão independente de fatos para documentos e roteiros"
    url: https://github.com/douglasabnovato/engenharia/issues/9
  - titulo: "Studio D PR #39: roteiro 3, com a revisão de fatos"
    url: https://github.com/douglasabnovato/studio-d/pull/39
  - titulo: "Studio D PR #44: roteiro 7, com a revisão de fatos"
    url: https://github.com/douglasabnovato/studio-d/pull/44
  - titulo: "Studio D: docs/como-escrever-um-roteiro.md (passo 8)"
    url: https://github.com/douglasabnovato/studio-d/blob/developer/sprint-2026-11-19/docs/como-escrever-um-roteiro.md
  - titulo: "Claude Code Docs: subagentes"
    url: https://code.claude.com/docs/en/sub-agents
  - titulo: "Claude Code Docs: permissões"
    url: https://code.claude.com/docs/en/permissions
---

## Gancho · 0:00–0:45

### Fala
- Entre outubro e novembro de 2026, agentes de IA trabalharam nos 39 repositórios do meu portfólio, em lotes, ao mesmo tempo.
- Em 10/11, eram 340 de 419 critérios da régua atendidos. Nada disso entrou na branch principal sem eu revisar.
- O que segurou a qualidade não foi o código que os agentes escreveram. Foram três peças em volta: o brief, o revisor que não viu o código e as permissões que dizem não.
- Neste vídeo, uma de cada vez, com o que deu errado.

### Tela
O `README.md` do repositório engenharia. Depois, a tabela de contexto da decisão de 10/11, com "39 repositórios, 340 de 419 critérios".

## Quatro papéis · 0:45–2:30

### Fala
- O processo tem quatro papéis, e cada um tem uma coluna "não faz".
- O responsável sou eu: decido o problema e as metas, crio contas e segredos, configuro a hospedagem e mesclo na principal.
- O coordenador é a sessão principal do Claude Code. Ele escreve os briefs, distribui os repositórios em lotes e lê os relatórios. Ele não escreve código nos repositórios: delega.
- O agente é um subagente com um brief. Ele leva 1 a 3 repositórios até o fim, um depois do outro. Não mexe em configuração, segredo nem principal.
- E o revisor independente é um subagente que não viu o código. Ele só aponta problemas de correção.
- A coluna "não faz" é o que impede um papel de engolir o outro.

### Tela
A tabela "Papéis" do `ia/como-trabalhamos.md`, destacando a coluna "Não faz".

## O brief é o único contexto · 2:30–5:00

### Fala
- O agente começa do zero. Ele não leu a conversa, não sabe o que eu decidi ontem. O brief é tudo o que ele tem.
- Por isso o brief diz cinco coisas: o que ler antes, onde clonar, as regras que valem acima do processo, os passos em cada repositório e o formato exato da resposta.
- O "onde clonar" parece detalhe. Não é: o agente sempre trabalha num clone novo numa pasta temporária, nunca na minha cópia de uso diário.
- Briefs seguintes herdam o anterior e listam só o que muda. O do ciclo curto, por exemplo, começa com "leia antes, inteiros" e depois traz oito mudanças numeradas.
- E o brief aprende. Em 05/11, uma queda de sessão deixou cinco agentes com trabalho só no clone, sem push. Desde então, "push a cada commit" está em todo brief.

### Tela
O `ia/briefs/ciclo-curto.md`, rolando do "Leia antes" até a "Resposta final". Depois, a linha da queda de sessão em `aprendizados.md`, na seção "Git e locks".

## O relatório: o que não está no bloco não existe · 5:00–6:15

### Fala
- Cada agente responde em dois blocos por repositório: um de início e um de fim.
- O de fim traz os critérios antes e depois, os PRs, as issues novas, o resumo dos testes, o que espera a minha revisão e os desvios.
- O coordenador lê só esses blocos. A regra é dura de propósito: o que não está no bloco não existe.
- Isso obriga o agente a declarar o que não deu certo, em vez de deixar escondido num parágrafo.

### Tela
O bloco "▶ INÍCIO / ■ FIM" do `ia/como-trabalhamos.md`.

## O revisor que não viu o código · 6:15–9:15

### Fala
- Depois de lint, testes e build verdes, o agente chama outro subagente. Esse revisor recebe só o diff e a seção do plano. Nada da conversa.
- O pedido é estreito: bug, regressão, teste que não testa. Estilo não entra.
- O motivo está numa frase do processo: um revisor que conhece a intenção tende a confirmá-la. Por isso ele recebe o diff, não a conclusão.
- Um exemplo do próprio Studio D. No roteiro do AirCnC, eu tinha escrito que o código antigo estava num certo commit. O revisor, conferindo contra o repositório, achou duas coisas: o commit certo era outro, e o diff do que eu tinha citado mostrava a credencial antiga do banco. O vídeo teria posto uma senha na tela.
- No roteiro do critério 12, eu ia ensinar a conferir um site comparando o título da página. O revisor apontou que o site de outra pessoa tinha o mesmo título do meu Proffy. A conferência que eu ia ensinar não pegaria o caso que eu ia contar.
- De 5 a 6 achados por roteiro, todos corrigidos antes do merge. Cada PR lista os achados.

### Tela
A seção "Revisor independente" do `ia/como-trabalhamos.md`. Depois, a seção "Revisão independente de fatos" dos PRs 39 e 44 do Studio D. **Não abrir o diff do commit citado no PR 39**: é ele que mostra a credencial.

## Permissões que dizem não · 9:15–11:45

### Fala
- O agente roda com um classificador de permissões. Antes de cada ação, ele decide se ela passa.
- Algumas ações foram negadas e assim ficaram. O merge da feature na sprint foi negado em parte dos repositórios, como "merge sem revisão", e passou em outros.
- Apagar branch remota: negado. Mesclar PR do Dependabot: negado. Ligar o GitHub Pages pela API foi negado ao coordenador como "publicar site novo", mesmo com a minha autorização geral. Criar o ruleset pela mesma API passou.
- A regra para tudo isso é uma só: se uma ação for bloqueada, não contornar. Registrar no relatório, abrir issue se for o caso e seguir para o próximo repositório.
- E tem o que é proibido pelo processo, mesmo quando a ferramenta deixa. Force push, inclusive com `--force-with-lease`. Em 09/11, um agente usou por engano. Foi um avanço simples e nada se perdeu, mas virou desvio registrado na decisão do dia e a regra foi reforçada.
- Uma lição da decisão de 09/11: regra explícita sobre produção vence instrução geral de autonomia.

### Tela
A tabela "Limites e permissões" do `ia/como-trabalhamos.md`. Depois, a seção "Permissões do agente" de `aprendizados.md` e o "Desvio registrado" na decisão de 09/11. Por fim, a página de permissões da documentação do Claude Code.

## O que fica comigo · 11:45–12:45

### Fala
- Merge na principal, proteção da branch, contas, senhas, tokens e hospedagem ficam comigo.
- Revogar credencial vazada e reescrever histórico também.
- E o conteúdo que só eu sei: metas, depoimentos, números publicados.
- Tudo isso vira issue com o rótulo `depende-do-responsavel`, com o passo a passo de onde clicar. O agente prepara, eu decido.

### Tela
A seção "O que fica com o responsável" do `ia/como-trabalhamos.md`.

## Melhoria: revisor de fatos também para documentos · 12:45–13:30

### Fala
- Hoje, no processo, o revisor independente olha código. Os achados dos roteiros mostram que texto precisa da mesma coisa: data, commit, comando e o que aparece na tela.
- A issue 9 do repositório engenharia leva a revisão de fatos para documentos, relatórios e roteiros, como já está no guia de roteiro do Studio D.

### Tela
A issue 9 do repositório engenharia. Depois, o passo 8 do `docs/como-escrever-um-roteiro.md` do Studio D.

## Desafio · 13:30–13:50

### Fala
- Na próxima tarefa que você der a um agente, escreva o brief como se ele não soubesse nada, e peça a revisão a outro agente, só com o diff.
- Conta nos comentários o que o revisor achou.

## Encerramento · 13:50–14:00

### Fala
- No próximo episódio: as seis fases de um projeto novo, com portões.

## Para o YouTube

### Descrição
Agentes de IA trabalharam os 39 repositórios do meu portfólio, em lotes. Mostro as três peças que seguraram a qualidade: o brief como único contexto do agente, o revisor independente que recebe o diff e não a conclusão, e as permissões que dizem não, com o que fazer quando uma ação é bloqueada.

Base do processo: https://github.com/douglasabnovato/engenharia

### Capítulos
0:00 Gancho
0:45 Quatro papéis
2:30 O brief é o único contexto
5:00 O relatório: o que não está no bloco não existe
6:15 O revisor que não viu o código
9:15 Permissões que dizem não
11:45 O que fica comigo
12:45 Melhoria: revisor de fatos também para documentos
13:30 Desafio
13:50 Encerramento

### Tags
inteligência artificial, agentes, claude code, revisão de código, processo, github, engenharia de software

### Capa
Três peças em volta de um robô que escreve código: um papel ("brief"), uma lupa ("revisor") e uma placa de "pare" ("permissão"). Texto: "Não foi o código da IA."
