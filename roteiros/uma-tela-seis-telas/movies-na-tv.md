---
titulo: "Movies na TV: a interface vista a três metros"
serie: uma-tela-seis-telas
episodio: 1
repositorio: douglasabnovato/movies
duracao_alvo: 12 min
publico: Quem faz sites e nunca abriu o próprio projeto numa TV, com o controle remoto na mão.
pre_requisitos:
  - CSS básico (seletores e grid)
  - Saber o que é um teste de ponta a ponta no navegador
objetivo: Ao final, a pessoa sabe o que muda numa interface vista a três metros, confere o foco visível do próprio site com a régua da WCAG e liga as setas numa grade de cards, com teste.
situacao: rascunho
resumo: "O Movies já passa no teste de teclado. Na TV, isso não basta: o controle só tem quatro setas e um OK."
fontes:
  - titulo: "Movies: docs/MVP.md (critério 8)"
    url: https://github.com/douglasabnovato/movies/blob/main/docs/MVP.md
  - titulo: "Movies: src/pages/Home/styles.css (foco e grade)"
    url: https://github.com/douglasabnovato/movies/blob/main/src/pages/Home/styles.css
  - titulo: "Movies: src/pages/Home/index.js (cards da lista)"
    url: https://github.com/douglasabnovato/movies/blob/main/src/pages/Home/index.js
  - titulo: "Movies: e2e/tests/fluxo.spec.js (teste de teclado)"
    url: https://github.com/douglasabnovato/movies/blob/main/e2e/tests/fluxo.spec.js
  - titulo: "Movies issue #96: pronto para o vídeo 10"
    url: https://github.com/douglasabnovato/movies/issues/96
  - titulo: "Android TV: design para TV (distância de 3 metros e D-pad)"
    url: https://developer.android.com/design/ui/tv/guides/foundations/design-for-tv
  - titulo: "Android TV: navegação na TV"
    url: https://developer.android.com/design/ui/tv/guides/foundations/navigation-on-tv
  - titulo: "Android TV: layouts (margens de overscan)"
    url: https://developer.android.com/design/ui/tv/guides/styles/layouts
  - titulo: "Android TV: tipografia"
    url: https://developer.android.com/design/ui/tv/guides/styles/typography
  - titulo: "Apple HIG: foco e seleção"
    url: https://developer.apple.com/design/human-interface-guidelines/focus-and-selection
  - titulo: "WCAG 2.2: entendendo o foco visível (2.4.7)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible
  - titulo: "WCAG 2.2: entendendo a aparência do foco (2.4.13)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance
  - titulo: "MDN: :focus-visible"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
  - titulo: "Playwright: teclado"
    url: https://playwright.dev/docs/input#keys-and-shortcuts
---

## Gancho · 0:00–0:40

### Fala
- O Movies, meu catálogo de filmes, tem um teste que conclui o fluxo só com o teclado, com o foco visível. Ele roda no CI.
- Agora imagine esse site numa TV. Não tem mouse, não tem teclado. Tem um controle com quatro setas e um botão de OK.
- E a pessoa está no sofá, a uns três metros da tela.
- Neste vídeo: o que muda numa interface vista de longe, como conferir o foco do seu site com a régua da WCAG, e as setas numa grade de cards, com teste.

### Tela
A Home do Movies no navegador, em tela cheia. Um cursor de mouse some da tela.

## Três metros e quatro setas · 0:40–2:30

### Fala
- O guia de design para TV do Android parte de um número: a distância média entre a TV e quem assiste é de 3 metros, ou 10 pés.
- Por isso o nome "interface de 10 pés". Texto e elementos precisam ser grandes o bastante para ler de longe, e o guia sugere pôr menos texto na tela.
- O controle tem um direcional, com cima, baixo, esquerda e direita, e os botões de selecionar, início e voltar.
- O direcional move o foco para o elemento mais próximo naquela direção. Não existe ponteiro. O foco é o único jeito de saber onde você está.
- A Apple diz algo parecido para a Apple TV: mover o foco e selecionar são gestos separados. Primeiro você leva o foco, depois confirma.

### Tela
A página "Design for TV" do Android, no trecho dos 3 metros. Depois, a página de navegação, no trecho do D-pad. Por fim, a página de foco e seleção da Apple.

## O que o Movies já tem · 2:30–4:30

### Fala
- O critério 8 do Movies, acessibilidade básica, está como "Atende" no `MVP.md`: Lighthouse 100, teclado no CI e axe nas três telas do fluxo.
- No CSS da Home, a busca e os cards ganham um contorno laranja de 3 pixels quando recebem foco pelo teclado.
- O seletor é `:focus-visible`. Ele só desenha o contorno quando o navegador acha que o foco precisa aparecer, como na navegação por teclado. Num card, o clique de mouse não acende o contorno. Num campo de texto, como a busca, o navegador mostra o foco também no clique.
- E o teste de ponta a ponta confere, a cada passo, que o elemento focado tem contorno de verdade, e não `outline: none`.
- Os gêneros não têm regra própria: eles passam no teste com o anel de foco padrão do navegador. O laranja é só da busca e dos cards.

### Tela
A linha do critério 8 no `docs/MVP.md`. Depois, o trecho de foco no `styles.css` da Home. Por fim, o teste "conclui o fluxo só com o teclado, com o foco visível" no `fluxo.spec.js`. Na gravação, focar um card com Tab e conferir que o contorno envolve o card inteiro.

### Comandos
```css
/* src/pages/Home/styles.css */
.search-input:focus-visible,
.film a:focus-visible {
  outline: 3px solid #d18000;
  outline-offset: 2px;
}
```

## O foco passa na régua? · 4:30–6:15

### Fala
- A WCAG tem dois critérios de foco. O 2.4.7, nível AA, pede só que o foco seja visível.
- O 2.4.13, nível AAA, dá uma medida: o indicador precisa ter área de pelo menos um contorno de 2 pixels em volta do componente, e contraste de 3 para 1 entre o estado com foco e o estado sem foco.
- O contorno do Movies tem 3 pixels. Fica afastado 2 pixels do card, sobre o fundo branco da página.
- Laranja `#d18000` sobre branco dá 3,09 para 1, pela fórmula de contraste da WCAG. Passa, mas raspando.
- Na TV, raspando é pouco. A 3 metros, um contorno fino some. É aqui que a TV pede mais do que a régua mínima: contorno mais grosso, ou o card que cresce quando recebe foco, como o guia do Android prevê ao falar do espaço entre os itens.

### Tela
A página do 2.4.13 da WCAG, no texto do critério. Depois, um verificador de contraste com `#d18000` e `#ffffff`.

## Onde o teclado não basta · 6:15–7:45

### Fala
- Olhe o teste de novo. A busca e o primeiro gênero são alcançados com Tab. Mas, para chegar ao card, o teste chama `card.focus()` direto.
- No teclado, chegar ao vigésimo filme pede uma fila de Tabs, passando pela busca e por todos os gêneros.
- Na TV, a pessoa aperta "para baixo" e espera descer uma linha. Aperta "direita" e espera o filme ao lado.
- A grade da Home é um CSS grid com `auto-fill`: o número de colunas muda com a largura da tela. Então as setas precisam descobrir quantas colunas existem agora.
- Isso é parte do que a issue 96 pede: navegação por setas com foco visível, e um teste de teclado cobrindo as setas. Os tamanhos de fonte e de foco para três metros ficam para depois.

### Tela
O trecho `await card.focus();` no `fluxo.spec.js`. Depois, a regra `.films` no `styles.css`, com `repeat(auto-fill, minmax(180px, 1fr))`. Por fim, a issue 96 do Movies.

## Melhoria: as setas na grade · 7:45–10:45

### Fala
- A melhoria tem duas partes: uma função pura, que decide o próximo card, e um ouvinte de teclado na lista.
- A função recebe o card atual, a tecla, o número de colunas e o total. Direita soma um, esquerda tira um, baixo soma uma linha, cima tira uma linha.
- Nas bordas, o foco fica onde está. Na última coluna, a direita não pula para a linha de baixo. É o que o guia do Android pede: o foco vai ao elemento mais próximo naquela direção, e na borda não há nenhum.
- O número de colunas sai da própria tela: o `getComputedStyle` da lista devolve as colunas que o `auto-fill` resolveu. Contar cards na mesma altura falharia, porque um título de duas linhas desalinha a linha.
- O ouvinte fica na seção da lista. Ele só age quando o foco está num card, chama `preventDefault` para a página não rolar sozinha e move o foco para o card escolhido.
- O teste usa o mesmo Playwright do projeto: foco no primeiro card, `ArrowRight`, e o segundo card precisa estar focado e com contorno. Para isso, a função `outlineOf`, que hoje mora dentro do outro teste, sobe para o topo do arquivo.
- O dado simulado da TMDB tem só dois filmes populares, então o teste de ponta a ponta cobre direita e esquerda. Cima, baixo e as bordas ficam no teste da função pura, que roda sem navegador.
- Isto ainda não está no repositório. É a proposta para a issue 96, gravada ao vivo, que entra por PR na sprint como qualquer outra mudança.

### Tela
O editor com um arquivo novo para a função. Depois, o teste rodando no terminal.

### Comandos
```js
// a função pura: qual card recebe o foco
export function proximoCard(atual, tecla, colunas, total) {
  const passo = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: colunas, ArrowUp: -colunas }[tecla];
  if (passo === undefined) return atual;
  const coluna = atual % colunas;
  if (tecla === "ArrowRight" && coluna === colunas - 1) return atual; // borda direita
  if (tecla === "ArrowLeft" && coluna === 0) return atual; // borda esquerda
  const proximo = atual + passo;
  return proximo >= 0 && proximo < total ? proximo : atual;
}
```

```js
// as colunas que o auto-fill resolveu agora
const colunas = getComputedStyle(lista).gridTemplateColumns.split(" ").length;
```

```js
// o teste de ponta a ponta
await page.goto("/");
await expect(page.getByText("Filme Popular")).toBeVisible();
const cards = page.locator(".film a");
await cards.nth(0).focus();
await page.keyboard.press("ArrowRight");
await expect(cards.nth(1)).toBeFocused();
expect(await outlineOf(cards.nth(1))).toBe(true);
```

```bash
# o e2e roda contra o build de produção: construir antes
npm run build
cd e2e
npm ci
npx playwright install chromium
npx playwright test
```

## Desafio · 10:45–11:30

### Fala
- Abra o seu site, tire o mouse da mesa e afaste a cadeira até a parede.
- Você vê onde está o foco? Se não vê, mexa no contorno e meça o contraste com a régua do 2.4.13.
- Depois, escolha a sua maior lista de itens e tente chegar ao último só com o teclado. Conte as teclas.

## Encerramento · 11:30–12:00

### Fala
- Na TV, o foco é o cursor. Se ele não aparece de longe, a pessoa está perdida.
- No próximo episódio da série: o mesmo cuidado na outra ponta, o celular, com um pedido feito com uma mão.

## Para o YouTube

### Descrição
O Movies, meu catálogo de filmes, passa no teste de teclado. Mas e numa TV, a três metros, só com quatro setas e um OK? Mostro o que os guias do Android e da Apple dizem sobre foco, confiro o contorno do site com o critério 2.4.13 da WCAG e ligo as setas numa grade de cards, com teste no Playwright.

Repositório: https://github.com/douglasabnovato/movies

### Capítulos
0:00 Gancho
0:40 Três metros e quatro setas
2:30 O que o Movies já tem
4:30 O foco passa na régua?
6:15 Onde o teclado não basta
7:45 Melhoria: as setas na grade
10:45 Desafio
11:30 Encerramento

### Tags
tv, interface de 10 pés, foco visível, acessibilidade, wcag, teclado, react, playwright

### Capa
Uma sala vista de trás de um sofá, com a Home do Movies numa TV ao fundo e um card com contorno laranja bem grosso. Texto: "Cadê o foco?"
