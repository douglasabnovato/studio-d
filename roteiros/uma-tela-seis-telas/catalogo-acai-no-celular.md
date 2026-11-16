---
titulo: "Catálogo de açaí no celular: pedido com uma mão"
serie: uma-tela-seis-telas
episodio: 2
repositorio: douglasabnovato/catalogo-acai
duracao_alvo: 12 min
publico: Quem faz sites que as pessoas usam no celular, em pé, com uma mão, e nunca mediu o tamanho de um botão.
pre_requisitos:
  - CSS básico (padding e tamanho)
  - Já ter aberto o DevTools no modo celular
objetivo: Ao final, a pessoa sabe contar os toques de um fluxo, medir os alvos de toque contra a WCAG 2.2 e aumentar um botão pequeno sem mudar o desenho, com teste.
situacao: rascunho
resumo: "Do cardápio ao WhatsApp em 7 toques. Os botões do carrinho têm 26 pixels: passam na WCAG, mas e no polegar?"
fontes:
  - titulo: "Catálogo de açaí: README"
    url: https://github.com/douglasabnovato/catalogo-acai/blob/main/README.md
  - titulo: "Catálogo de açaí: documentacao/MVP.md (sprint de 12/11)"
    url: https://github.com/douglasabnovato/catalogo-acai/blob/developer/sprint-2026-11-12/documentacao/MVP.md
  - titulo: "Catálogo de açaí: src/pages/cardapio/CardapioPage.tsx"
    url: https://github.com/douglasabnovato/catalogo-acai/blob/main/src/pages/cardapio/CardapioPage.tsx
  - titulo: "Catálogo de açaí: src/features/order/model/order.ts (mensagem e link wa.me)"
    url: https://github.com/douglasabnovato/catalogo-acai/blob/main/src/features/order/model/order.ts
  - titulo: "Catálogo de açaí: e2e/fluxo.pw.ts (sprint de 12/11)"
    url: https://github.com/douglasabnovato/catalogo-acai/blob/developer/sprint-2026-11-12/e2e/fluxo.pw.ts
  - titulo: "Catálogo de açaí PR #29: sprint de 12/11 para a main"
    url: https://github.com/douglasabnovato/catalogo-acai/pull/29
  - titulo: "Catálogo de açaí issue #31: pronto para o vídeo 11"
    url: https://github.com/douglasabnovato/catalogo-acai/issues/31
  - titulo: "Site publicado"
    url: https://catalogo-acai.vercel.app/
  - titulo: "WCAG 2.2: entendendo o tamanho de alvo mínimo (2.5.8)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
  - titulo: "WCAG 2.2: entendendo o tamanho de alvo ampliado (2.5.5)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced
  - titulo: "Apple HIG: acessibilidade (tamanho de controles)"
    url: https://developer.apple.com/design/human-interface-guidelines/accessibility
  - titulo: "Android: tornar apps mais acessíveis (alvo de toque)"
    url: https://developer.android.com/guide/topics/ui/accessibility/apps
  - titulo: "WhatsApp: conversa em um clique"
    url: https://faq.whatsapp.com/5913398998672934
---

## Gancho · 0:00–0:40

### Fala
- Uma pessoa na fila da lanchonete, com o celular numa mão. Quantos toques ela dá até o pedido chegar à loja?
- No catálogo de açaí da Garagem Lanches, com um salgado e retirada no balcão, são 7 toques e dois campos digitados.
- E os botões de mais, menos e lixeira do carrinho têm 26 pixels. A WCAG aceita. O polegar, nem sempre.
- Neste vídeo: contar os toques, medir os alvos contra a WCAG 2.2 e aumentar um botão sem mudar o desenho, com teste.

### Tela
O site publicado no modo celular do DevTools, a 375 pixels de largura. Um dedo desenhado sobre o carrinho, que cobre o botão de mais e a lixeira ao mesmo tempo.

## O produto · 0:40–2:00

### Fala
- O catálogo é o cardápio digital de uma lanchonete e açaí: React 19, TypeScript, Vite e Tailwind, publicado na Vercel.
- A frase do problema está no `MVP.md`: quem compra monta o pedido no celular e envia pronto pelo WhatsApp, sem digitar item por item.
- Não tem pagamento online nem conta de cliente. O pedido vira uma mensagem, e o WhatsApp é o único canal.
- O site publicado não grava dado pessoal: o nome e o telefone vão só na mensagem. O código sabe gravar no Supabase, mas isso fica desligado no MVP.

### Tela
O README, na seção das funcionalidades. Depois, o `MVP.md` da sprint, na frase do problema.

## Contar os toques · 2:00–4:00

### Fala
- Vamos contar com um salgado pronto. Um: "Adicionar". Dois: "Ver pedido", na barra fixa embaixo da tela.
- Três e quatro: tocar no nome e no telefone e digitar. Cinco: "Retirada no balcão". Seis: "Enviar no WhatsApp".
- O site abre o WhatsApp com a mensagem pronta. O sétimo toque é o enviar dentro da conversa. A própria tela de sucesso avisa isso.
- O Pix já vem marcado, e isso poupa um toque. A entrega também vem marcada: quem quer entrega não toca no tipo, mas digita o endereço. A conta continua em 7 toques, com três campos digitados.
- Ao abrir o pedido, o foco vai para o primeiro botão, o de diminuir. Por isso o toque no nome conta.
- O açaí é diferente: o botão é "Montar copo" e abre um passo a mais, com os acompanhamentos.
- E esse fluxo tem teste. Na sprint de 12/11, o Playwright monta o pedido, preenche nome, telefone e retirada, e confere que o WhatsApp abre com o item. O WhatsApp é simulado: o teste não manda mensagem a ninguém.

### Tela
O site no modo celular, com um contador de toques no canto. Na hora do WhatsApp, cortar antes de a nova aba abrir: o endereço `wa.me` traz o número da loja, e ele não aparece no vídeo. Na tela de sucesso, não passar o mouse sobre "O WhatsApp não abriu? Toque aqui.": a barra de status mostraria o número. Depois, a função `montarEEnviar` no `e2e/fluxo.pw.ts`.

### Comandos
```ts
// e2e/fluxo.pw.ts: o WhatsApp é simulado no teste
await context.route('https://wa.me/**', (r) =>
  r.fulfill({ contentType: 'text/html', body: '<title>WhatsApp</title>' }));
```

## O link do WhatsApp · 4:00–5:15

### Fala
- O envio não usa API nem servidor. É o recurso de conversa em um clique do WhatsApp: um link `wa.me` com o número e o texto.
- A função `whatsAppUrl` monta esse link e passa o texto por `encodeURIComponent`, para acentos, quebras de linha e o asterisco do negrito chegarem inteiros.
- O número da loja vem de uma variável de ambiente, com um valor padrão no código. Por isso, neste vídeo, a tela mostra a função, e não o arquivo de configuração.

### Tela
A página de ajuda do WhatsApp sobre a conversa em um clique. Depois, a função `whatsAppUrl` no `order.ts`, só as linhas da função.

### Comandos
```ts
// src/features/order/model/order.ts
export function whatsAppUrl(text: string, phone: string = STORE.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
```

## Medir os alvos · 5:15–7:30

### Fala
- A WCAG 2.2 tem dois critérios de tamanho de alvo. O 2.5.8, nível AA, pede pelo menos 24 por 24 pixels de CSS, ou espaço suficiente em volta.
- O 2.5.5, nível AAA, pede 44 por 44.
- Os guias das plataformas vão na mesma linha: a Apple usa 44 por 44 pontos como tamanho padrão de controle no iPhone, e o Android recomenda pelo menos 48 por 48 dp.
- Medi o site publicado a 375 pixels de largura, com `getBoundingClientRect` no console, em dois momentos: com o carrinho fechado e com ele aberto. Com o carrinho aberto, a barra de "Ver pedido" some.
- As categorias têm 38 de altura. "Adicionar" tem 106 por 32. "Ver pedido", 151 por 40. "Enviar no WhatsApp", 141 por 56.
- No carrinho, diminuir, aumentar e remover têm 26 por 26 cada. Entre o menos e o mais fica a quantidade. Entre o mais e a lixeira, só 4 pixels.
- Todos passam no 2.5.8. Nenhum dos três do carrinho chega aos 44 do 2.5.5. E são justamente os botões pequenos, colados e com ação diferente: quem erra o mais aperta a lixeira.

### Tela
A página do 2.5.8 da WCAG, no texto do critério. Depois, o console do DevTools com a tabela de medidas e o carrinho aberto.

### Comandos
```js
// no console: uma vez com o carrinho fechado, outra com ele aberto
[...document.querySelectorAll('button')].filter((b) => b.offsetParent).map((b) => {
  const r = b.getBoundingClientRect();
  return `${b.getAttribute('aria-label') || b.innerText} ${Math.round(r.width)}x${Math.round(r.height)}`;
});
```

## Melhoria: 44 pixels no carrinho · 7:30–10:30

### Fala
- A melhoria é parte da issue 31: conferir os alvos contra o 2.5.8. Já passam. Então dou um passo além, até os 44 do 2.5.5, só no carrinho.
- Hoje o botão é o ícone de 14 pixels mais `p-1.5`, 6 pixels de cada lado: 26 no total.
- A troca é pôr um tamanho mínimo de 44, com o ícone no centro. O desenho do ícone não muda. Só a área de toque cresce.
- Para caber três botões de 44 na linha, a coluna do nome do item precisa poder quebrar. Ela já tem `min-w-0`, então o texto quebra em vez de empurrar os botões para fora.
- O teste roda no Playwright, com a tela de celular: abre o carrinho e confere a caixa de cada botão.
- Isto ainda não está no repositório. É a proposta gravada ao vivo, que entra por PR na sprint. O Playwright e o `test:e2e` também estão só na sprint de 12/11, no PR 29, ainda sem merge na `main`.

### Tela
O trecho dos três botões no `CardapioPage.tsx`. Depois, o carrinho antes e depois, lado a lado, no modo celular.

### Comandos
```tsx
// antes: 14 de ícone + 6 de cada lado = 26 pixels
className="p-1.5 rounded-lg bg-zinc-800 text-zinc-200"
// depois: no mínimo 44 por 44, ícone no centro
className="min-w-11 min-h-11 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-200"
```

```ts
// e2e/alvos.pw.ts: os botões do carrinho com pelo menos 44 por 44
import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });
test('os botões do carrinho têm 44 pixels', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Adicionar: Esfirra Carne' }).click();
  await page.getByRole('button', { name: /Ver pedido/ }).click();
  for (const nome of ['Diminuir', 'Aumentar', 'Remover']) {
    const caixa = await page.getByRole('button', { name: `${nome} Esfirra Carne` }).boundingBox();
    expect(caixa!.width).toBeGreaterThanOrEqual(44);
    expect(caixa!.height).toBeGreaterThanOrEqual(44);
  }
});
```

```bash
npm run build
npm run test:e2e
```

## Desafio · 10:30–11:30

### Fala
- Pegue o fluxo principal do seu site e conte os toques, do primeiro ao último, no celular.
- Depois, rode a medição no console e ache o menor botão da tela.
- Se ele estiver abaixo de 24, falha no 2.5.8. Se estiver entre 24 e 44 e for muito usado, aumente a área de toque sem mudar o desenho.

## Encerramento · 11:30–12:00

### Fala
- Botão pequeno passa na régua mínima e ainda assim faz a pessoa errar. Meça, e dê ao polegar o espaço de que ele precisa.
- No próximo episódio da série: o mesmo produto em outra tela.

## Para o YouTube

### Descrição
Do cardápio ao WhatsApp em 7 toques: conto o fluxo do catálogo de açaí no celular, meço os botões contra os critérios 2.5.8 e 2.5.5 da WCAG 2.2 e aumento os botões do carrinho de 26 para 44 pixels, com teste no Playwright.

Repositório: https://github.com/douglasabnovato/catalogo-acai

### Capítulos
0:00 Gancho
0:40 O produto
2:00 Contar os toques
4:00 O link do WhatsApp
5:15 Medir os alvos
7:30 Melhoria: 44 pixels no carrinho
10:30 Desafio
11:30 Encerramento

### Tags
celular, alvo de toque, wcag 2.2, acessibilidade, whatsapp, react, tailwind, playwright

### Capa
Um polegar sobre três botões pequenos de mais, menos e lixeira, com uma régua ao lado marcando 26 e 44. Texto: "Passa na WCAG. E no polegar?"
