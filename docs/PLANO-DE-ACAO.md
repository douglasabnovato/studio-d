# Plano de ação

## Ciclo de 11/11/2026

### Produto
- **Problema e público:** o autor vai gravar vídeos ensinando a partir dos próprios repositórios e precisa de um roteiro claro na hora de gravar. O público final é quem assiste: pessoas que fizeram cursos e querem levar projetos a produto.
- **Hipótese:** acreditamos que roteiros em blocos, com teleprompter e checklist, farão o autor gravar um vídeo por semana; saberemos quando houver 4 vídeos publicados em 30 dias depois do primeiro.
- **Pesquisa (fontes):** padrões de interface de serviços de streaming (destaque, fileiras, janela de detalhes), usados só como referência de uso (ADR-001); guias de acessibilidade do WAI-ARIA para janela modal (<https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>) e de carrossel (<https://www.w3.org/WAI/ARIA/apg/patterns/carousel/>); LCP no web.dev (<https://web.dev/articles/lcp>), fonte do primeiro roteiro.
- **Backlog (impacto × esforço):** 1. vitrine, roteiro e gravação (alto × médio, feito); 2. primeiro roteiro, movies (alto × médio, feito); 3. abertura com o D (médio × médio, issue); 4. roteiros das outras séries (alto × médio, issues); 5. ler os roteiros no build para aliviar o pacote (médio × baixo, issue).
- **Fora do escopo:** editar roteiro pelo site, login, comentários.

### Engenharia
- **Arquitetura:** site estático React + Vite, conteúdo em Markdown lido no build, publicação no Pages pelo Actions (`docs/ARQUITETURA.md`).
- **Riscos:** pacote pesado por `yaml` e `marked`; roteiro com dado sensível (mitigado pelo checklist e pela revisão por PR); a principal sem ruleset (responsável).
- **Qualidade:** Vitest (leitura, catálogo, contraste dos tokens, páginas), Playwright com axe nos temas claro e escuro, em desktop e celular, e teste de teclado.
- **Definição de pronto:** CI verde no PR, `MVP.md` com evidência, ADRs escritas, 5 issues de próximos passos.

### Plano de ação
- Este ciclo: esqueleto, vitrine, página do roteiro, modo gravação, roteiro do movies, CI, documentação.
- Vira issue: ligar o Pages e proteger a `main` (responsável), medição de uso (responsável), abertura com o D, roteiros das outras séries, leitura no build.

## Ciclo de 11/11/2026, tarde: Studio D no ar (épico #15)

### Produto
- **Objetivo do autor:** abertura animada com o D, site hospedado no GitHub Pages e documentação que sirva de porta de entrada, com o trabalho guiado por issues.
- **Como medimos:** site respondendo (HTTP 200), LCP móvel no site publicado até 2,5 s, abertura sem piorar o LCP, links da documentação sem quebra.
- **Fontes:** WAI-ARIA para foco e movimento (<https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html>), documentação do Pages com Actions (<https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>) e relógio do Playwright (<https://playwright.dev/docs/clock>).

### Engenharia
- **Abertura:** SVG e CSS, fim por temporizador, uma vez por sessão, só na entrada pela tela de início (ADR-004).
- **Hospedagem:** Pages com a fonte "GitHub Actions", Variable `PAGES_ATIVO` e ambiente `github-pages` restrito à `main`. Ligado em 11/11/2026 a pedido do autor.
- **Riscos:** a abertura atrasar o LCP (medido: não atrasou); a fila do Actions atrasar o merge.

### Plano de ação (issues)
| Tarefa | Issue | Quem |
|---|---|---|
| Ligar o Pages e a Variable | #2 | Feito pelo agente, a pedido do autor; o site sobe com o merge na `main` |
| Abertura com o D | #5 | Agente, PR #13 |
| README como porta de entrada e `docs/` com índice | #14 | Agente, PR #13 |
| Proteger a `main` e alertas do Dependabot | #3 | Autor |
| Medir o LCP no site publicado | #15 | Agente, depois do merge na `main` |

## Ciclo de 16/11/2026

### Produto
- **Problema e público:** os mesmos do ciclo de 11/11. O autor grava a partir do site publicado; quem assiste abre a página de cada roteiro. Se o link quebrar ou servir outro site, os dois perdem a fonte.
- **Hipótese:** a mesma, com meta: acreditamos que roteiros em blocos, com teleprompter e checklist, farão o autor gravar um vídeo por semana; saberemos quando houver 4 vídeos publicados em 30 dias depois do primeiro.
- **Estado de partida:** a sprint de 19/11 entrou na `main` em 16/11 (PR #27, merge `611b5e7`). O site publicado roda esse build (`index-NY5LSstr.js`, igual ao `dist/` local). São 13 roteiros em rascunho, todos esperando a revisão do autor.
- **Pesquisa (fontes):**
  - Eventos do Actions, `schedule`: roda só na branch padrão, o intervalo mínimo é de 5 minutos e pode atrasar em hora de pico (<https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule>).
  - Desligar e ligar workflows: num repositório público, o agendamento é desligado depois de 60 dias sem atividade, e se religa na aba Actions (<https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows>).
  - `fetch` e `AbortSignal.timeout` no Node, sem dependência nova (<https://nodejs.org/api/globals.html#fetch>); LCP bom até 2,5 s no web.dev (<https://web.dev/articles/lcp>), para a medição de novo no ar.
- **Backlog (impacto × esforço):**
  1. conferir toda semana que o site é o Studio D, com teste (#43; médio × baixo; este ciclo);
  2. medir de novo o LCP no build publicado (alto × baixo; este ciclo);
  3. fechar as issues que já estão na `main` e apontar o que é do autor (médio × baixo; este ciclo);
  4. analisar os PRs do Dependabot #52 e #53 (médio × baixo; este ciclo, o merge é do autor);
  5. revisão dos rascunhos pelo autor, conferência do hash publicado, pacote de JS que voltou a crescer (issues).
- **Fora do escopo:** reescrever roteiros (falam em nome do autor), medição de uso sem a conta (#4), mudar o tema padrão sem o autor (o #57 propõe seguir o tema do sistema e espera a aprovação dele).

### Engenharia
- **Arquitetura:** sem mudança no site. Entra um workflow à parte, `site-no-ar.yml`, que roda `node scripts/conferir-site.ts`. A regra fica numa função pura (`src/lib/conferir-site.ts`), testada no Vitest; o script só baixa a página e chama a função.
- **Por que título e descrição:** o site de terceiro do Proffy tinha o mesmo título do repositório (comentário de 12/11 no #43). A descrição do `index.html` cita o dono e não se repete em outro site.
- **Riscos:** o agendamento parar depois de 60 dias sem atividade (anotado no `DEPLOY.md`); instabilidade do Pages dar alarme falso (3 tentativas com espera de 10 s para erro 5xx ou de rede); o JS voltou a 144,92 kB com gzip porque os 13 roteiros entram no pacote (issue nova).
- **Qualidade:** teste da função com o `index.html` real, com site de terceiro de mesmo título, com 404 e com página sem marcas; mutação conferida (sem a checagem da descrição, 2 testes falham). O job também roda nos PRs que mexem nele.
- **Definição de pronto:** CI verde (`verificar`, `e2e` e `conferir-site`), `MVP.md` com evidência e data, revisão independente sem erro aberto, 5 ou mais issues de próximos passos.

### Plano de ação
| Tarefa | Issue | Quem |
|---|---|---|
| Job semanal do site no ar, com teste | #43 | Agente, este ciclo |
| LCP móvel de novo no site publicado | critério 7 | Agente, este ciclo |
| Fechar as issues já na `main` (#6 a #9, #23, #24, #29 a #36) | várias | Agente, este ciclo |
| `docs/DEPLOY.md` com o passo a passo | critério 12 | Agente, este ciclo |
| Analisar os PRs #52 (maior) e #53 (patch) | — | Agente comenta; o autor mescla |
| Proteger a `main` e ligar os alertas | #3 | Autor |
| Conta de medição | #4 | Autor |
| Revisar os rascunhos de roteiro | issue nova | Autor |
