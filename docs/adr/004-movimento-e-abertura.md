# ADR-004: movimento reduzido e a abertura

**Data:** 11/11/2026 · **Situação:** aceita (abertura entregue em 11/11/2026, issue #5)

## Contexto
O Studio D tem uma abertura com a letra D, pedida pelo autor. A abertura não pode cansar quem volta várias vezes, atrapalhar quem usa teclado ou leitor de tela, nem atrasar a primeira tela.

## Decisão
- **Desenho próprio (ADR-001):** a haste do D desce em luz azul (0 a 0,6 s), a curva se desenha (0,6 a 1,3 s), o D se preenche e brilha com faixas de luz se abrindo atrás (1,3 a 1,8 s), e a câmera entra no D enquanto a tela de início aparece (1,8 a 2,4 s). Só SVG e CSS, sem vídeo e sem som.
- **Duração:** 2,4 s. O fim vem por um temporizador, e não por `animationend`, que não dispara com animação desligada.
- **Quando aparece:** uma vez por sessão (`sessionStorage`), e só para quem entra pela tela de início. Quem abre direto um roteiro ou o modo gravação vai direto ao que pediu. Sem armazenamento disponível, a abertura não aparece.
- **Como pular:** o botão "Pular abertura" é o primeiro item do Tab, sem roubar o foco ao abrir; Esc também pula.
- **Movimento reduzido:** com `prefers-reduced-motion: reduce`, o D aparece pronto e parado por 0,5 s, sem faixas nem zoom. Toda transição do site respeita a mesma preferência.
- **Desempenho:** a tela de início é desenhada por baixo da abertura.

## Medição (local, 11/11/2026)
Build de produção servido com compressão (`serve@14`), Lighthouse 12 móvel, 3 execuções cada:

| Versão | LCP | FCP | TBT | Elemento do LCP |
|---|---|---|---|---|
| Antes da abertura | 1,89, 1,96 e 1,88 s (mediana 1,89 s) | 1,73 a 1,81 s | 188 a 352 ms | `p.destaque-resumo` |
| Com a abertura | 1,97, 1,88 e 1,88 s (mediana 1,88 s) | 1,73 a 1,82 s | 216 a 246 ms | `p.destaque-resumo` |

A abertura não piorou o LCP. A medição que vale para o critério 7 é a do site publicado.

## Consequências
- Testes de unidade (`Abertura.test.tsx`) e no navegador (`e2e/abertura.spec.ts`, com o relógio do navegador controlado) cobrem duração, botão, Esc, movimento reduzido e a entrada direta.
- O axe não roda com o relógio parado; o desenho é `aria-hidden`, e o contraste do botão está em `contraste.test.ts`.
