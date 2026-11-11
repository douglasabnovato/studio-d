# MVP: critérios e estado

> Fonte única do estado. Criado em 11/11/2026. Plano em [`PLANO-DE-ACAO.md`](PLANO-DE-ACAO.md).

**Nível:** Vitrine (N2). Valem os 12 critérios: o site fica público e no ar.

**Resumo:** 6 de 12 aplicáveis atendidos

**Finalizado:** não

## Critérios

| # | Critério | Situação em 11/11/2026 |
|---|---|---|
| 1 | Problema e público claros | Atende: "um lugar para abrir e gravar os roteiros dos vídeos feitos a partir dos meus repositórios" (README) |
| 2 | Hipótese a validar | Atende: "acreditamos que roteiros em blocos, com teleprompter e checklist, farão o autor gravar um vídeo por semana; saberemos quando houver 4 vídeos publicados em 30 dias depois do primeiro" (`PLANO-DE-ACAO.md`) |
| 3 | Fluxo principal completo | Parcial: `npx playwright test`, 11/11/2026, local: 10 passaram, 2 pulados de propósito (teclado só no desktop). Falta passar no CI |
| 4 | Escopo enxuto | Atende: seção "Fora do MVP" abaixo |
| 5 | Medição de uso | Não atende: depende da conta do GoatCounter, do responsável |
| 6 | Falhas tratadas | Atende: `npx vitest run`, 11/11/2026, 51 testes, 0 falhas. Roteiro inexistente mostra "Roteiro não encontrado"; busca sem resultado avisa; copiar sem permissão avisa; roteiro inválido quebra o build |
| 7 | Desempenho aceitável | Não atende: o site ainda não está no ar (Pages é do responsável). Medir no site publicado |
| 8 | Acessibilidade básica | Atende: `npx playwright test`, 11/11/2026: axe (WCAG 2.1 A e AA) sem violações em início, detalhes, roteiro, checklist e teleprompter, nos temas claro e escuro, em 1366 px e no celular, com o roteiro real; teclado: setas nas fileiras, Esc fecha e devolve o foco, Tab preso na janela, foco visível. Contraste dos tokens testado à parte (`contraste.test.ts`) |
| 9 | Segurança e conformidade | Parcial: `npm audit --omit=dev`, 11/11/2026: 0 vulnerabilidades; sem segredo no código; sem dado pessoal (ADR-003); HTML do roteiro escapado (ADR-002). Faltam os alertas do Dependabot, que se ligam nas configurações |
| 10 | Entrega confiável | Parcial: CI em PR para `main` e `developer/**`, e publicação só depois dos jobs `verificar` e `e2e`. Falta o ruleset da `main`, do responsável |
| 11 | Testes dos fluxos críticos | Parcial: Vitest e Playwright passam localmente (11/11/2026). Falta o log do CI |
| 12 | Documentação honesta | Atende: README com os comandos conferidos contra o `package.json` em 11/11/2026; sem link publicado, porque o site ainda não responde |

## Fora do MVP

- Abertura animada com o D (fase 4, ADR-004).
- Editar roteiros pelo site, login, comentários.
- Gravar ou editar vídeo: o Studio D só mostra o roteiro.
