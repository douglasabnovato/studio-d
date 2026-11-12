---
titulo: "Critério 8: o axe passou, o modo escuro não"
serie: os-12-criterios
episodio: 1
repositorio: douglasabnovato/sushibar
duracao_alvo: 13 min
publico: Quem já roda o axe ou o Lighthouse e acha que "zero violações" encerra o assunto de acessibilidade.
pre_requisitos:
  - CSS básico (cores e media queries)
  - Já ter aberto o DevTools do navegador
objetivo: Ao final, a pessoa sabe o que o critério 8 da régua pede, por que o axe precisa rodar nos temas claro e escuro, e como testar o teclado de um componente de abas.
situacao: rascunho
resumo: O cardápio do Sushibar passou no axe em 4 telas. No dia seguinte, com o celular no modo escuro, o texto estava branco sobre fundo claro.
fontes:
  - titulo: "Sushibar: docs/MVP.md (critério 8)"
    url: https://github.com/douglasabnovato/sushibar/blob/main/docs/MVP.md
  - titulo: "Sushibar: docs/PLANO-DE-ACAO.md (ciclo de 03/11/2026)"
    url: https://github.com/douglasabnovato/sushibar/blob/main/docs/PLANO-DE-ACAO.md
  - titulo: "Sushibar PR #16: busca, setas nas abas e contraste no modo escuro"
    url: https://github.com/douglasabnovato/sushibar/pull/16
  - titulo: "Sushibar: styles/globals.css"
    url: https://github.com/douglasabnovato/sushibar/blob/main/styles/globals.css
  - titulo: "Sushibar: lib/tabs.ts (teclado das abas)"
    url: https://github.com/douglasabnovato/sushibar/blob/main/lib/tabs.ts
  - titulo: "Sushibar issue #14: axe nas 5 páginas no CI"
    url: https://github.com/douglasabnovato/sushibar/issues/14
  - titulo: "Sushibar issue #13: testes de interface do cardápio"
    url: https://github.com/douglasabnovato/sushibar/issues/13
  - titulo: "Engenharia: régua dos 12 critérios (critério 8)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/arquitetura/padroes.md
  - titulo: "Studio D: playwright.config.ts (projetos claro e escuro)"
    url: https://github.com/douglasabnovato/studio-d/blob/main/playwright.config.ts
  - titulo: "WCAG 2.2: entendendo o contraste mínimo (1.4.3)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
  - titulo: "MDN: prefers-color-scheme"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
  - titulo: "MDN: color-scheme"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
  - titulo: "Playwright: emulação (colorScheme)"
    url: https://playwright.dev/docs/emulation
  - titulo: "Playwright: testes de acessibilidade com axe"
    url: https://playwright.dev/docs/accessibility-testing
  - titulo: "W3C APG: padrão de abas"
    url: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
---

## Gancho · 0:00–0:40

### Fala
- Em 02/11, o cardápio do Sushibar passou no axe: zero violações em 4 telas.
- Em 03/11, com o sistema no modo escuro, o texto estava branco sobre um fundo cinza-claro. Quase ilegível.
- O axe não mentiu. Ele só olhou para o tema que eu mostrei a ele.
- Neste vídeo: o critério 8 da minha régua, por que o axe precisa rodar nos dois temas, e o teste de teclado que o axe não faz.

### Tela
O cardápio do Sushibar no tema claro, legível. Corte para o mesmo cardápio com o sistema no modo escuro, com o texto branco sobre cinza-claro.

## O critério 8 · 0:40–2:00

### Fala
- Na régua que uso em todo repositório, o critério 8 é "acessibilidade básica".
- Ele pede duas coisas: o axe sem violações, nos temas claro e escuro, e um teste de teclado com Tab, Esc e foco visível.
- O axe é uma biblioteca que confere a página contra regras da WCAG, como contraste, rótulos e nomes de botões.
- O teste de teclado é outra coisa: quem não usa mouse precisa chegar a tudo e ver onde está.

### Tela
A linha do critério 8 no `padroes.md` do repositório engenharia.

## O que aconteceu · 2:00–4:15

### Fala
- O Sushibar é o cardápio de um restaurante, feito em Next.js e exportado como site estático.
- O CSS global veio com um bloco para o modo escuro do sistema: se o sistema estiver escuro, o texto vira branco.
- Só que os blocos do cardápio têm fundo próprio, cinza-claro. O texto herdava o branco e ficava sobre esse fundo.
- A conferência com o axe de 02/11 rodou no modo claro. Nesse modo, o bloco escuro nem é aplicado. Por isso passou.
- A WCAG pede contraste de pelo menos 4,5 para 1 em texto normal. Branco sobre cinza-claro fica muito abaixo disso.

### Tela
O `globals.css` antes do commit `72dbb14`, com o bloco `@media (prefers-color-scheme: dark)`. Depois, a página da WCAG sobre o contraste mínimo.

### Comandos
```css
/* antes: o texto ia para branco no modo escuro do sistema */
@media (prefers-color-scheme: dark) {
  html { color-scheme: dark; }
  body { color: white; background: black; }
}
```

## A correção · 4:15–6:00

### Fala
- O site não tinha um tema escuro desenhado. Então a decisão honesta foi assumir: o site é claro.
- O commit `72dbb14` troca o bloco do modo escuro por `color-scheme: light` e cores fixas: texto quase preto sobre cinza-claro.
- O `color-scheme` avisa ao navegador qual esquema a página suporta. Assim, barras de rolagem e campos de formulário também ficam claros.
- Fazer um tema escuro de verdade é outro trabalho, com outras cores e outro teste. Não é ligar um interruptor.

### Tela
O diff do commit `72dbb14` no `globals.css`. Depois, a página da MDN sobre `color-scheme`.

### Comandos
```css
/* depois: o layout é claro, sempre */
html { color-scheme: light; }
body { color: #111827; background: #e5e7eb; }
```

## Por que o axe não pegou · 6:00–7:45

### Fala
- O axe confere o que está na tela no momento. Ele não troca o tema sozinho.
- Se o seu site reage ao modo escuro, o axe precisa rodar duas vezes: uma com o sistema claro e outra com o sistema escuro.
- No Playwright, isso é uma linha: a opção `colorScheme`, que imita a preferência do sistema.
- É o que faço no próprio Studio D, este site de roteiros: os testes rodam em três projetos, escuro, claro e celular, e o axe roda em todos.
- No Sushibar, isso ainda é a issue 14: rodar o axe nas 5 páginas, nos dois modos, e o CI falhar com violação séria.

### Tela
O `playwright.config.ts` do Studio D, nos projetos `escuro` e `claro`. Depois, a issue 14 do Sushibar.

### Comandos
```ts
// playwright.config.ts: o mesmo teste nos dois temas
projects: [
  { name: 'escuro', use: { colorScheme: 'dark' } },
  { name: 'claro', use: { colorScheme: 'light' } },
],
```

## O teclado, que o axe não testa · 7:45–10:00

### Fala
- O axe acha atributo faltando e contraste baixo. Ele não sabe se as setas funcionam.
- No mesmo ciclo, as abas do cardápio ganharam o teclado do padrão de abas da W3C.
- Antes, cada aba era uma parada do Tab, e as setas não faziam nada.
- Agora só a aba ativa entra no Tab. As setas trocam de aba e dão a volta. Home e End vão às pontas.
- A lógica ficou numa função pura, testada sem navegador. A ligação com a tela ainda foi conferida à mão: é a issue 13.

### Tela
A página do padrão de abas da W3C, na seção de teclado. Depois, `lib/tabs.ts` do Sushibar.

### Comandos
```ts
// lib/tabs.ts: setas dão a volta; Home e End vão às pontas
case "ArrowRight": return (current + 1) % count;
case "Home": return 0;
case "End": return count - 1;
```

## Melhoria: o axe nos dois temas no CI · 10:00–11:45

### Fala
- A melhoria é a issue 14, e o caminho está pronto no Studio D para copiar.
- Um script serve o site exportado. O Playwright abre as 5 páginas nos dois temas e roda o axe em cada uma.
- O CI falha com violação séria ou crítica. Para provar, um commit de teste com contraste ruim precisa deixar o CI vermelho.
- Com isso, o critério 8 deixa de depender de uma conferência manual, que só vale no dia em que foi feita.

### Tela
A issue 14 do Sushibar, nos critérios de entrega. Depois, a página de testes de acessibilidade da documentação do Playwright.

## Desafio · 11:45–12:30

### Fala
- Abra o CSS global do seu projeto e procure `prefers-color-scheme`.
- Ligue o modo escuro do sistema e olhe cada tela.
- Se o axe já roda no seu CI, acrescente o projeto escuro. Se não roda, comece por uma página.

## Encerramento · 12:30–13:00

### Fala
- Zero violações vale para o que foi testado. Teste nos dois temas e com o teclado.
- No próximo episódio da série: o critério 10, CI verde e a principal protegida.

## Para o YouTube

### Descrição
O cardápio do Sushibar passou no axe em 4 telas e, no dia seguinte, estava ilegível no modo escuro do sistema. Mostro o critério 8 da minha régua de qualidade, por que o axe precisa rodar nos temas claro e escuro e como testar o teclado de abas no padrão da W3C.

Repositório: https://github.com/douglasabnovato/sushibar

### Capítulos
0:00 Gancho
0:40 O critério 8
2:00 O que aconteceu
4:15 A correção
6:00 Por que o axe não pegou
7:45 O teclado, que o axe não testa
10:00 Melhoria: o axe nos dois temas no CI
11:45 Desafio
12:30 Encerramento

### Tags
acessibilidade, axe, wcag, contraste, modo escuro, teclado, playwright, next.js

### Capa
A mesma tela de cardápio dividida ao meio: à esquerda, clara e legível, com um selo "axe: 0"; à direita, no modo escuro, com o texto apagado. Texto: "Zero violações. Em qual tema?"
