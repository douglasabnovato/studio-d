# MVP: critérios e estado

> Fonte única do estado. Criado em 11/11/2026. Plano em [`PLANO-DE-ACAO.md`](PLANO-DE-ACAO.md).

**Nível:** Vitrine (N2). Valem os 12 critérios: o site fica público e no ar.

**Resumo:** 9 de 12 aplicáveis atendidos

**Finalizado:** sim — os 3 que faltam (5, 9 e 10) dependem do responsável e têm issue com `depende-do-responsavel`: proteger a `main` e ligar os alertas do Dependabot (#3) e a conta de medição (#4).

## Critérios

| # | Critério | Situação em 11/11/2026 |
|---|---|---|
| 1 | Problema e público claros | Atende: "um lugar para abrir e gravar os roteiros dos vídeos feitos a partir dos meus repositórios" (README) |
| 2 | Hipótese a validar | Atende: "acreditamos que roteiros em blocos, com teleprompter e checklist, farão o autor gravar um vídeo por semana; saberemos quando houver 4 vídeos publicados em 30 dias depois do primeiro" (`PLANO-DE-ACAO.md`) |
| 3 | Fluxo principal completo | Atende: job `e2e`, CI do PR #1, execução 43089905329, 11/11/2026: 10 passaram e 2 pulados de propósito (o fluxo de teclado roda só nos projetos de desktop, escuro e claro). O fluxo vai do card à janela, ao roteiro, ao checklist e ao teleprompter, no navegador |
| 4 | Escopo enxuto | Atende: seção "Fora do MVP" abaixo |
| 5 | Medição de uso | Não atende: depende da conta do GoatCounter, do responsável (#4) |
| 6 | Falhas tratadas | Atende: `npx vitest run`, 11/11/2026, 60 testes, 0 falhas. Roteiro inexistente mostra "Roteiro não encontrado"; busca sem resultado avisa; copiar sem permissão avisa. Roteiro inválido para o build: `npm run build` com um roteiro de teste fora de ordem, 11/11/2026, parou com "Roteiros inválidos" |
| 7 | Desempenho aceitável | Atende: Lighthouse 12 móvel no site publicado (https://douglasabnovato.github.io/studio-d/), 11/11/2026, 3 execuções: LCP de 1,98, 1,94 e 1,73 s (mediana 1,94 s); TBT de 82 a 235 ms; elemento do LCP `p.destaque-resumo`, com a abertura ativa. Acessibilidade do Lighthouse: 100 |
| 8 | Acessibilidade básica | Atende: `npx playwright test`, 11/11/2026: axe (WCAG 2.1 A e AA) sem violações em início, detalhes, roteiro, checklist e teleprompter (a abertura tem desenho `aria-hidden`, botão de pular no primeiro Tab, Esc e movimento reduzido, ADR-004), nos temas claro e escuro, em 1366 px e no celular, com o roteiro real; teclado: setas nas fileiras, Esc fecha e devolve o foco, Tab preso na janela, foco visível. Contraste dos tokens testado à parte (`contraste.test.ts`) |
| 9 | Segurança e conformidade | Parcial: `npm audit --omit=dev`, 11/11/2026: 0 vulnerabilidades; sem segredo no código; sem dado pessoal e sem pedido a terceiros, fonte servida do próprio site (ADR-003); HTML, links e código do roteiro escapados, com testes de entrada maliciosa (ADR-002). Faltam os alertas do Dependabot, que se ligam nas configurações (#3) |
| 10 | Entrega confiável | Parcial: CI em PR para `main` e `developer/**`, e publicação só depois dos jobs `verificar` e `e2e`. Falta o ruleset da `main`, do responsável (#3) |
| 11 | Testes dos fluxos críticos | Atende: CI do PR #1, execução 43089905329, 11/11/2026: job `verificar`, `npm test` com 5 arquivos e 60 testes passando; job `e2e`, 10 passaram, sem pulo nos testes do fluxo principal no desktop |
| 12 | Documentação honesta | Atende: README com os comandos conferidos contra o `package.json` e link do site, que respondeu HTTP 200 em 11/11/2026 (`curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.github.io/studio-d/`); links internos conferidos por `src/lib/links.test.ts` |

## Fora do MVP

- Editar roteiros pelo site, login, comentários.
- Gravar ou editar vídeo: o Studio D só mostra o roteiro.
