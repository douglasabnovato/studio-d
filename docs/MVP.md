# MVP: critérios e estado

> Fonte única do estado. Criado em 11/11/2026, revisto em 16/11/2026 (critério 9 às 15h03, com os alertas do Dependabot ligados) e em 18/11/2026 (critérios 6, 7 e 10, ciclo da `feature/2026-11-18`). Plano em [`PLANO-DE-ACAO.md`](PLANO-DE-ACAO.md). Publicação em [`DEPLOY.md`](DEPLOY.md).

**Nível:** Vitrine (N2). Valem os 12 critérios: o site fica público e no ar.

**Resumo:** 10 de 12 aplicáveis atendidos

**Finalizado:** sim — os 2 que faltam (5 e 10) dependem do responsável e têm issue com `depende-do-responsavel`: a conta de medição (#4) e a `main` protegida (#3).

**Hipótese:** acreditamos que roteiros em blocos, com teleprompter e checklist, farão o autor gravar um vídeo por semana; saberemos quando houver 4 vídeos publicados em 30 dias depois do primeiro.

## Critérios

| # | Critério | Situação em 16/11/2026 |
|---|---|---|
| 1 | Problema e público claros | Atende: "Os roteiros dos meus vídeos, prontos para gravar." (README) |
| 2 | Hipótese a validar | Atende: a hipótese acima, com meta (4 vídeos em 30 dias), também no [`PLANO-DE-ACAO.md`](PLANO-DE-ACAO.md) |
| 3 | Fluxo principal completo | Atende: job `e2e` do run 43799589604, na `main` (`611b5e7`), 16/11/2026: 14 passaram e 10 pulados de propósito (a abertura roda só no projeto `escuro`; teclado e foco não rodam no `celular`). O teste `do início ao teleprompter, pelo teclado` vai do card à janela, ao roteiro, ao checklist e ao teleprompter, no Chromium. Local, `npx playwright test`, 16/11/2026: o mesmo resultado |
| 4 | Escopo enxuto | Atende: seção "Fora do MVP" abaixo |
| 5 | Medição de uso | Não atende: depende da conta do GoatCounter, do responsável (#4) |
| 6 | Falhas tratadas | Atende: `npx vitest run`, 18/11/2026, 9 arquivos, 121 testes, 0 falhas. Com o roteiro carregado sob demanda (#56), a página do roteiro e o modo gravação mostram "Carregando o roteiro…" e, se o pedaço não chega, um aviso com "Tentar de novo"; o botão de começar a gravação espera o roteiro (`paginas.test.tsx`, "Carregar o roteiro sob demanda"). Antes, `npx vitest run`, 16/11/2026, 99 testes, 0 falhas; no CI, job `verificar` do run 43838179093 (PR #60), 16/11/2026, 99 testes passando. Roteiro inexistente mostra "Roteiro não encontrado" e busca sem resultado avisa (`paginas.test.tsx`); copiar com a permissão negada avisa para usar Ctrl+C (`paginas.test.tsx`, teste novo neste ciclo); roteiro fora de ordem é recusado pela mesma regra do build (`catalogo.test.ts`, "aponta bloco fora de ordem e capítulos errados") |
| 7 | Desempenho aceitável | Atende: `npx -y lighthouse@12 https://douglasabnovato.github.io/studio-d/ --form-factor=mobile --only-categories=performance,accessibility --output=json --chrome-flags="--headless --no-sandbox"` (Lighthouse 12.8.2), 4 vezes, 16/11/2026, build `index-NY5LSstr.js`, o mesmo do `npm run build` da `main` (`611b5e7`). Três execuções válidas: LCP de 1,87, 1,73 e 1,73 s (mediana 1,73 s); TBT de 48, 62 e 111 ms; elemento do LCP `p.destaque-resumo`. Uma quarta execução foi descartada: a primeira da série, com FCP observado de 10,3 s (CPU ocupada). Acessibilidade do Lighthouse: 100. Em 18/11/2026 o site publicado serve `index-Bfb1WfbY.js`, o mesmo do `npm run build` da `main` (`cb09348`), e não o build medido acima: a `main` mudou só em docs, testes e dependências de desenvolvimento (526,34 kB contra 526,33 kB). A próxima medição sai do job `lcp` do CI, depois do merge deste ciclo (#59), que também muda o pacote inicial (#56) |
| 8 | Acessibilidade básica | Atende: job `e2e` do run 43799589604, 16/11/2026: axe (WCAG 2.1 A e AA) sem violações em início, detalhes, roteiro e gravação, com o roteiro real, em 1366 px e no Pixel 7. O tema escuro é o padrão do CSS e o claro vem por `data-theme='light'` (`src/styles.css`); o projeto `claro` grava essa escolha antes de abrir. Teclado: setas nas fileiras, Esc fecha e devolve o foco, Tab preso na janela, foco visível nos cards. Contraste dos tokens dos dois temas em `contraste.test.ts` |
| 9 | Segurança e conformidade | Atende: `gh api "repos/douglasabnovato/studio-d/dependabot/alerts?state=open&per_page=100" --jq length`, 16/11/2026 12:03: 0 alertas abertos (o responsável ligou os alertas em 16/11/2026). `npm audit --omit=dev`, 16/11/2026 12:03: 0 vulnerabilidades. Sem segredo no código; sem dado pessoal e sem pedido a terceiros (ADR-003); HTML do roteiro escapado no build, com teste (ADR-002) |
| 10 | Entrega confiável | Parcial: CI em PR para `main` e `developer/**`, e publicação só depois de `verificar` e `e2e`. `gh api repos/douglasabnovato/studio-d/rules/branches/main`, 18/11/2026: o ruleset `principal-protegida` (ativo desde 16/11/2026) tem `deletion`, `non_fast_forward` e `pull_request`, mas não tem `required_status_checks`: um PR com o CI vermelho ainda entra na `main`. Falta incluir `verificar` e `e2e` como checks obrigatórios, do responsável (#3) |
| 11 | Testes dos fluxos críticos | Atende: run 43799589604, na `main`, 16/11/2026: job `verificar`, `npm test` com 7 arquivos e 85 testes passando; job `e2e`, 14 passaram, sem pulo no fluxo principal no desktop. No PR #60, run 43838179093, 16/11/2026: `verificar` com 8 arquivos e 99 testes passando (14 novos, com o teste de links do `DEPLOY.md`) e `e2e` com 14 passando |
| 12 | Documentação honesta | Atende: README com os comandos conferidos contra o `package.json`; o site respondeu ao `npm run site:conferir` em 16/11/2026 com "OK" (HTTP 200, título e descrição iguais aos do `index.html`), a mesma conferência que o job semanal `site-no-ar` faz (#43); links internos conferidos por `src/lib/links.test.ts` |

## Histórico

- 18/11/2026: contagem sem mudança (10 de 12). Critério 10 com o ruleset novo, ainda sem checks obrigatórios. Critério 6 com o carregamento e a falha do roteiro sob demanda. Critério 7 com a nota do build publicado.

- 16/11/2026, 15h03: 9 → 10 de 12. O critério 9 era "Parcial" porque a API de alertas do Dependabot respondia 403 (alertas desligados, engenharia#33). O responsável ligou os alertas; a API mostra 0 abertos e o audit de produção, 0 vulnerabilidades.

## Fora do MVP

- Editar roteiros pelo site, login, comentários.
- Gravar ou editar vídeo: o Studio D só mostra o roteiro.
- Medir vídeos no YouTube.
