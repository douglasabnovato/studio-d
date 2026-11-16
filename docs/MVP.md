# MVP: critérios e estado

> Fonte única do estado. Criado em 11/11/2026, revisto em 16/11/2026. Plano em [`PLANO-DE-ACAO.md`](PLANO-DE-ACAO.md). Publicação em [`DEPLOY.md`](DEPLOY.md).

**Nível:** Vitrine (N2). Valem os 12 critérios: o site fica público e no ar.

**Resumo:** 9 de 12 aplicáveis atendidos

**Finalizado:** sim — os 3 que faltam (5, 9 e 10) dependem do responsável e têm issue com `depende-do-responsavel`: a conta de medição (#4), e a `main` protegida com os alertas do Dependabot ligados (#3).

**Hipótese:** acreditamos que roteiros em blocos, com teleprompter e checklist, farão o autor gravar um vídeo por semana; saberemos quando houver 4 vídeos publicados em 30 dias depois do primeiro.

## Critérios

| # | Critério | Situação em 16/11/2026 |
|---|---|---|
| 1 | Problema e público claros | Atende: "Os roteiros dos meus vídeos, prontos para gravar." (README) |
| 2 | Hipótese a validar | Atende: a hipótese acima, com meta (4 vídeos em 30 dias), também no [`PLANO-DE-ACAO.md`](PLANO-DE-ACAO.md) |
| 3 | Fluxo principal completo | Atende: job `e2e` do run 43799589604, na `main` (`611b5e7`), 16/11/2026: 14 passaram e 10 pulados de propósito (a abertura roda só no projeto `escuro`; teclado e foco não rodam no `celular`). O teste `do início ao teleprompter, pelo teclado` vai do card à janela, ao roteiro, ao checklist e ao teleprompter, no Chromium. Local, `npx playwright test`, 16/11/2026: o mesmo resultado |
| 4 | Escopo enxuto | Atende: seção "Fora do MVP" abaixo |
| 5 | Medição de uso | Não atende: depende da conta do GoatCounter, do responsável (#4) |
| 6 | Falhas tratadas | Atende: `npx vitest run`, 16/11/2026, 97 testes, 0 falhas. Roteiro inexistente mostra "Roteiro não encontrado" e busca sem resultado avisa (`paginas.test.tsx`); copiar com a permissão negada avisa para usar Ctrl+C (`paginas.test.tsx`, teste novo neste ciclo); roteiro fora de ordem é recusado pela mesma regra do build (`catalogo.test.ts`, "aponta bloco fora de ordem e capítulos errados") |
| 7 | Desempenho aceitável | Atende: Lighthouse 12.8.2 móvel no site publicado, 16/11/2026, build `index-NY5LSstr.js`, o mesmo do `npm run build` da `main` (`611b5e7`). Três execuções válidas: LCP de 1,87, 1,73 e 1,73 s (mediana 1,73 s); TBT de 48, 62 e 111 ms; elemento do LCP `p.destaque-resumo`. Uma quarta execução foi descartada: a primeira da série, com FCP observado de 10,3 s (CPU ocupada). Acessibilidade do Lighthouse: 100 |
| 8 | Acessibilidade básica | Atende: job `e2e` do run 43799589604, 16/11/2026: axe (WCAG 2.1 A e AA) sem violações em início, detalhes, roteiro e gravação, com o roteiro real, em 1366 px e no Pixel 7. O tema escuro é o padrão do CSS e o claro vem por `data-theme='light'` (`src/styles.css`); o projeto `claro` grava essa escolha antes de abrir. Teclado: setas nas fileiras, Esc fecha e devolve o foco, Tab preso na janela, foco visível nos cards. Contraste dos tokens dos dois temas em `contraste.test.ts` |
| 9 | Segurança e conformidade | Parcial: `npm audit --omit=dev`, 16/11/2026: 0 vulnerabilidades; sem segredo no código; sem dado pessoal e sem pedido a terceiros (ADR-003); HTML do roteiro escapado no build, com teste (ADR-002). Os alertas do Dependabot estão desligados: `gh api "repos/douglasabnovato/studio-d/dependabot/alerts?state=open&per_page=100"`, 16/11/2026, respondeu 403. Ligar é do responsável (#3). A régua para esse caso está em decisão (engenharia#33) |
| 10 | Entrega confiável | Parcial: CI em PR para `main` e `developer/**`, e publicação só depois de `verificar` e `e2e`. Sem ruleset: `gh api repos/douglasabnovato/studio-d/rulesets` e `.../rules/branches/main`, 16/11/2026, listas vazias. Proteger a `main` é do responsável (#3) |
| 11 | Testes dos fluxos críticos | Atende: run 43799589604, na `main`, 16/11/2026: job `verificar`, `npm test` com 7 arquivos e 85 testes passando; job `e2e`, 14 passaram, sem pulo no fluxo principal no desktop. Este ciclo soma 12 testes (97 no total, com o teste de links do `DEPLOY.md`) |
| 12 | Documentação honesta | Atende: README com os comandos conferidos contra o `package.json`; o site respondeu ao `npm run site:conferir` em 16/11/2026 com "OK" (HTTP 200, título e descrição iguais aos do `index.html`), a mesma conferência que o job semanal `site-no-ar` faz (#43); links internos conferidos por `src/lib/links.test.ts` |

## Fora do MVP

- Editar roteiros pelo site, login, comentários.
- Gravar ou editar vídeo: o Studio D só mostra o roteiro.
- Medir vídeos no YouTube.
