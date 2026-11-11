---
titulo: "Movies: de 3,3 s para 2,4 s no celular"
serie: do-curso-ao-produto
episodio: 1
repositorio: douglasabnovato/movies
duracao_alvo: 15 min
publico: Quem já fez um app React em curso e quer que ele abra rápido no celular de verdade.
pre_requisitos:
  - React básico (componentes e useEffect)
  - Saber abrir o DevTools do Chrome
objetivo: Ao final, a pessoa sabe medir o LCP, descobrir qual elemento é o LCP e atacar a causa certa antes de mexer no código.
situacao: rascunho
resumo: Três tentativas para baixar o LCP de um catálogo de filmes, e por que a segunda descoberta valeu mais que a primeira correção.
fontes:
  - titulo: "Movies: docs/MVP.md (critério 7 e seção 7, Desempenho)"
    url: https://github.com/douglasabnovato/movies/blob/main/docs/MVP.md
  - titulo: "Movies: docs/ARQUITETURA.md (C4 e ADRs)"
    url: https://github.com/douglasabnovato/movies/blob/main/docs/ARQUITETURA.md
  - titulo: "Movies PR #81: retrato da Home no build"
    url: https://github.com/douglasabnovato/movies/pull/81
  - titulo: "Movies PR #88: pôster do esqueleto como LCP da Home"
    url: https://github.com/douglasabnovato/movies/pull/88
  - titulo: "Movies PR #92: JavaScript depois do pôster e retrato vencido"
    url: https://github.com/douglasabnovato/movies/pull/92
  - titulo: "Movies issue #57: LCP móvel da Home até 2,5 s"
    url: https://github.com/douglasabnovato/movies/issues/57
  - titulo: "web.dev: Largest Contentful Paint (LCP)"
    url: https://web.dev/articles/lcp
  - titulo: "web.dev: Otimizar o LCP"
    url: https://web.dev/articles/optimize-lcp
  - titulo: "MDN: LargestContentfulPaint"
    url: https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint
  - titulo: "Chrome for Developers: visão geral do Lighthouse"
    url: https://developer.chrome.com/docs/lighthouse/overview
---

## Gancho · 0:00–0:45

### Fala
- Este catálogo de filmes nasceu num curso de React. Funciona, tem busca, filtro e ficha do filme.
- No celular, a primeira tela levava 3,3 segundos para mostrar o conteúdo principal. A meta do Google para "bom" é 2,5.
- Neste vídeo eu mostro as três tentativas para chegar a 2,4 s, e a mais importante não foi uma correção: foi descobrir *qual* elemento o navegador estava medindo.
- Se você tem um projeto de curso no ar, dá para fazer o mesmo hoje.

### Tela
Site do Movies aberto no celular (ou no modo dispositivo do DevTools), carregando devagar. Depois, o número 3,33 s grande na tela.

## O projeto e o problema · 0:45–2:30

### Fala
- O Movies é uma vitrine: um catálogo que consome a API do TMDB. Quem visita meu portfólio abre e julga em segundos.
- Por isso, no `MVP.md`, ele é nível N2, Vitrine, e precisa cumprir os 12 critérios, incluindo o 7: LCP de até 2,5 s no celular, medido no site publicado.
- LCP é o tempo até o maior elemento visível da tela pintar. Na Home do Movies, esse elemento é o pôster do primeiro filme.
- Medido no ar em 06/11, com 3 execuções, a mediana foi 3,33 s. Não passava.

### Tela
O `docs/MVP.md` do repositório, rolando até a linha do critério 7. Destacar "LCP de até 2,5 s no celular".

## Como o app é feito · 2:30–4:00

### Fala
- Arquitetura em um minuto: uma SPA React com React Router, publicada no GitHub Pages.
- O navegador baixa o JavaScript, o React monta, chama a API do TMDB, e só então sabe qual pôster mostrar.
- Repare na fila: HTML, depois JS, depois API, depois imagem. Cada etapa espera a anterior. É aí que o tempo vai embora.
- Duas decisões ajudam aqui: o cache próprio com TTL (ADR-003) e uma chamada só no detalhe com `append_to_response` (ADR-004). Mas nenhuma delas resolve a primeira visita.

### Tela
O diagrama C4 de contêineres e de componentes do `docs/ARQUITETURA.md`. Desenhar a fila HTML → JS → API → imagem por cima.

## O que a régua apontou · 4:00–5:30

### Fala
- A régua tem 12 critérios, e o Movies chegou a 10 de 12.
- O 7 é o que conta a história de hoje. Uma regra importante: medição local deixa o critério em "Parcial". Só vale o site publicado.
- Por quê? Porque o seu servidor local não é o Pages. Vou mostrar daqui a pouco como isso me enganou.

### Tela
Tabela de critérios do `MVP.md`, com o 7 destacado em "Parcial".

## Medir antes de mexer · 5:30–8:00

### Fala
- Regra número um: não otimize no escuro. Meça, e meça mais de uma vez.
- Rode o Lighthouse móvel três vezes e use a mediana. Uma execução só pode ter a CPU ocupada por outro programa.
- Depois, pergunte ao navegador: *qual* elemento virou o LCP? O Lighthouse mostra, e o `PerformanceObserver` mostra ao vivo.
- E olhe as fases do LCP: quanto tempo até começar a baixar a imagem, quanto o download leva e quanto tempo ela fica pronta sem aparecer. Cada fase pede uma correção diferente.

### Tela
Terminal rodando o Lighthouse. Depois, o DevTools com o painel Console e o observador imprimindo o elemento.

### Comandos
```bash
npx lighthouse https://douglasabnovato.github.io/movies/ --only-categories=performance --output=json --output-path=./lcp-1.json --quiet --chrome-flags="--headless"
```
```js
new PerformanceObserver((lista) => {
  for (const e of lista.getEntries()) console.log(Math.round(e.startTime), e.element);
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

## Tentativa 1: o retrato no HTML · 8:00–9:30

### Fala
- Primeira ideia (PR #81): se o problema é a fila, adianta a imagem.
- No build, o projeto grava no `index.html` um retrato da primeira página de filmes e o primeiro pôster, com `preload` e `fetchpriority="high"`.
- Resultado: o navegador passou a começar o download do pôster sem esperar nada. A espera caiu para zero.
- Mas, medido no ar depois dele, o LCP ficou em 3,33 s. O pôster já estava pronto, só que demorava 2,3 a 2,8 s para *aparecer*. A medição apontou o próximo suspeito.

### Tela
O diff do PR #81 com o `<link rel="preload">` no HTML gerado. Depois, as fases do LCP com a espera em 0 ms e o atraso de renderização alto.

## A causa real: o esqueleto sumia cedo · 9:30–11:30

### Fala
- Aqui está a descoberta que mais me ensinou (PR #88).
- O HTML já mostrava um esqueleto da Home com o pôster. Quando o React montava, ele apagava o esqueleto e desenhava a página dele.
- O problema: o React apagava o esqueleto *antes* de o pôster dele pintar. Então o pôster do esqueleto nunca virava LCP.
- O LCP passava a ser o pôster do React, desenhado depois, e ainda por cima menor: 176 por 264 pixels contra 182 por 273.
- A correção: o React espera o pôster do esqueleto virar LCP antes de trocar a tela, com um limite de 2,5 s e várias saídas de segurança (primeira interação, aba oculta, imagem com erro).
- Local, a mediana caiu de 3,93 para 3,02 s. Melhor, mas ainda acima da meta.

### Tela
O `PerformanceObserver` antes e depois: antes, o elemento é o `img` do React; depois, o `img` do esqueleto. Mostrar `src/utils/shellPoster.js` no PR #88.

## A armadilha do gzip · 11:30–13:30

### Fala
- O 3,02 s tinha um erro de medição (PR #92). Eu servia o build com um servidor local sem compressão.
- O `main.js` chegava com 181 KB. No Pages, com gzip, ele tem 61 KB. Eu estava medindo um site mais pesado do que o publicado.
- Com o mesmo build servido com compressão, o pôster do esqueleto virou o LCP nas cinco execuções, e a mediana ficou em 2,38 s.
- E uma ideia que *não* funcionou: baixar o JavaScript só depois do pôster. A mediana não mudou, então a mudança foi desfeita. Medir também serve para desistir.
- Lição: compare o `transferSize` antes de comparar números. Servidor local sem gzip mente.

### Tela
DevTools, aba Rede, coluna "Transferido" do `main.js`: 181 KB sem compressão e 61 KB com. Depois, a tabela de medições da seção 7 do `MVP.md`.

### Comandos
```bash
npm run build
npx serve build -l 5000
```

## Desafio para você · 13:30–14:30

### Fala
- Agora é com você. Abra o seu projeto de curso publicado e rode o Lighthouse móvel três vezes.
- Descubra qual elemento é o LCP e em qual fase o tempo está. Não corrija nada antes disso.
- Se quiser praticar num projeto real, a issue #85 do Movies, salvar filmes favoritos no navegador, está aberta e explicada.
- Comente o seu número de antes e de depois.

### Tela
A issue #85 do Movies aberta no GitHub.

## Encerramento · 14:30–15:00

### Fala
- Resumo: meça três vezes, descubra o elemento, ataque a fase certa e meça no lugar onde o usuário está.
- O código, os PRs e as medições estão no repositório, com link na descrição.
- No próximo episódio da série, o Proffy: por que um teste de API não basta para dizer que o fluxo funciona.

### Tela
Repositório douglasabnovato/movies e a fileira "Do curso ao produto" do Studio D.

## Para o YouTube

### Descrição
Meu catálogo de filmes nasceu num curso de React e levava 3,3 s para mostrar a primeira tela no celular. Neste vídeo, mostro como medi o LCP, descobri qual elemento o navegador estava medindo e cheguei a 2,4 s, com três tentativas e um erro de medição pelo caminho.

Repositório: https://github.com/douglasabnovato/movies
Medições e critérios: https://github.com/douglasabnovato/movies/blob/main/docs/MVP.md
O que é LCP (web.dev): https://web.dev/articles/lcp

### Capítulos
0:00 O problema: 3,3 s no celular
0:45 O projeto e a régua
2:30 Como o app é feito
4:00 O que a régua apontou
5:30 Medir antes de mexer
8:00 Tentativa 1: retrato no HTML
9:30 A causa real: o esqueleto sumia cedo
11:30 A armadilha do gzip
13:30 Desafio
14:30 Encerramento

### Tags
react, desempenho web, lcp, core web vitals, lighthouse, github pages, projeto de curso, portfólio

### Capa
Fundo escuro, um celular com o pôster do filme, e o texto "3,3 s → 2,4 s" em azul. Sem logo de terceiros.
