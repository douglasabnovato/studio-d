import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const SLUG = 'movies-lcp-no-celular';

/**
 * O tema do site segue o sistema (#57): cada projeto só define o `colorScheme`, sem gravar escolha.
 * O celular (Pixel 7) usa o padrão do Playwright, claro.
 */
async function abrir(page: Page, rota: string, projeto: string) {
  const esperado = projeto === 'escuro' ? 'dark' : 'light';
  // A abertura tem o próprio teste (abertura.spec.ts); aqui ela já foi vista na sessão.
  await page.addInitScript(() => sessionStorage.setItem('studio-d:abertura-vista', '1'));
  // Nada de rede externa nos testes, além do próprio site.
  await page.route(/^https:\/\/fonts\./, (r) => r.abort());
  await page.goto(rota);
  await expect(page.locator('html')).toHaveAttribute('data-theme', esperado);
  expect(await page.evaluate(() => localStorage.getItem('studio-d:tema'))).toBeNull();
}

async function semViolacoes(page: Page, escopo?: string) {
  let axe = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  if (escopo) axe = axe.include(escopo);
  const { violations } = await axe.analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([]);
}

test('do início ao teleprompter, pelo teclado', async ({ page }, info) => {
  test.skip(info.project.name === 'celular', 'fluxo de teclado é de desktop');
  await abrir(page, './', info.project.name);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Movies');

  // Card da fileira "Do curso ao produto" → detalhes → Esc devolve o foco.
  const fileira = page.getByRole('region', { name: 'Do curso ao produto' });
  const card = fileira.getByRole('button', { name: /Movies: de 3,3 s/ });
  await card.focus();
  await page.keyboard.press('Enter');
  const janela = page.getByRole('dialog');
  await expect(janela).toBeVisible();
  await expect(janela.getByRole('button', { name: 'Fechar detalhes' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(janela).toBeHidden();
  await expect(card).toBeFocused();

  // Detalhes → Ver roteiro → Gravar.
  await card.click();
  await janela.getByRole('link', { name: 'Ver roteiro' }).click();
  await expect(page).toHaveURL(new RegExp(`#/v/${SLUG}$`));
  await page.getByRole('link', { name: /Gravar/ }).first().click();

  const comecar = page.getByRole('button', { name: /Começar a gravação/ });
  await expect(comecar).toBeDisabled();
  for (const caixa of await page.getByRole('checkbox').all()) await caixa.check();
  await comecar.click();

  const tele = page.getByRole('region', { name: /Modo gravação/ });
  await expect(tele).toBeVisible();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Pausar' })).toBeVisible();
  const texto = page.locator('.gravacao-texto');
  await expect.poll(() => texto.evaluate((el) => el.scrollTop)).toBeGreaterThan(5);
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.gravacao-faixa')).toContainText('Cena 2');
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(new RegExp(`#/v/${SLUG}$`));
});

test('axe sem violações: início, detalhes, roteiro e gravação', async ({ page }, info) => {
  await abrir(page, './', info.project.name);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await semViolacoes(page);

  await page.getByRole('button', { name: /Movies: de 3,3 s/ }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await semViolacoes(page, '.janela');
  await page.keyboard.press('Escape');

  await page.goto(`./#/v/${SLUG}`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // O axe roda com o roteiro completo na tela, depois que o pedaço chegou (#56).
  await expect(page.getByRole('heading', { name: /^Roteiro em \d+ blocos$/ })).toBeVisible();
  await semViolacoes(page);

  await page.goto(`./#/v/${SLUG}/gravar`);
  await semViolacoes(page);
  for (const caixa of await page.getByRole('checkbox').all()) await caixa.check();
  await page.getByRole('button', { name: /Começar a gravação/ }).click();
  await semViolacoes(page);
});

test('sem rolagem lateral da página', async ({ page }, info) => {
  await abrir(page, './', info.project.name);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // Compara com a largura do projeto, e não com o innerWidth, que alarga junto com o conteúdo no celular (#89).
  const viewport = page.viewportSize()!.width;
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport);
  await page.goto(`./#/v/${SLUG}`);
  await expect(page.getByRole('heading', { name: /^Roteiro em \d+ blocos$/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport);
});

test('o foco fica visível nos cards', async ({ page }, info) => {
  test.skip(info.project.name === 'celular', 'foco de teclado é de desktop');
  await abrir(page, './', info.project.name);
  await page.addStyleTag({ content: '*{transition:none!important}' });
  const card = page.locator('[data-card]').first();
  await card.focus();
  const contorno = await card.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(contorno).not.toBe('none');
});

test('o texto do roteiro só é baixado ao abrir o roteiro (#56)', async ({ page }, info) => {
  const pedidos: string[] = [];
  page.on('request', (r) => pedidos.push(new URL(r.url()).pathname));
  const doRoteiro = (p: string) => p.includes(`/assets/${SLUG}-`);

  await abrir(page, './', info.project.name);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Movies');
  await page.waitForLoadState('networkidle');
  expect(pedidos.filter(doRoteiro)).toEqual([]);

  // Aberto direto pelo endereço, com a página recarregada: o pedaço chega e os blocos aparecem.
  await page.goto(`./#/v/${SLUG}`);
  await page.reload();
  await expect(page.getByRole('heading', { name: /^Roteiro em \d+ blocos$/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fontes' })).toBeVisible();
  expect(pedidos.filter(doRoteiro).length).toBeGreaterThan(0);
});

test('cabeçalho e destaque inteiros em 360 px (#79)', async ({ page }, info) => {
  test.skip(info.project.name !== 'celular', 'mede a largura de 360 px');
  await page.setViewportSize({ width: 360, height: 800 });
  await abrir(page, './', info.project.name);
  const nome = page.locator('.marca span', { hasText: 'Studio D' }).first();
  const caixa = await nome.boundingBox();
  const linha = await nome.evaluate((e) => parseFloat(getComputedStyle(e).fontSize) * 1.6);
  expect(caixa!.height).toBeLessThan(linha);
  const busca = page.getByRole('searchbox', { name: 'Buscar roteiros' });
  const cabe = await busca.evaluate((e: HTMLInputElement) => {
    const s = getComputedStyle(e);
    const c = document.createElement('canvas').getContext('2d')!;
    c.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    return c.measureText(e.placeholder).width <= e.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
  });
  expect(cabe).toBe(true);
  for (const alvo of await page.locator('.topo a, .topo button, .topo input').all()) {
    const r = await alvo.boundingBox();
    expect(Math.min(r!.width, r!.height)).toBeGreaterThanOrEqual(44);
  }
  const capa = await page.locator('.destaque-capa svg').boundingBox();
  expect(capa!.width / capa!.height).toBeCloseTo(16 / 9, 1);
  const conteudo = await page.locator('.destaque-conteudo').boundingBox();
  expect(conteudo!.y).toBeGreaterThanOrEqual(capa!.y + capa!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

/**
 * Reflow (WCAG 1.4.10) em todas as rotas, em 360 px (#89). Compara com 360 fixo, e não com o
 * innerWidth: na emulação de celular, a viewport de layout alarga junto com o conteúdo, e
 * `scrollWidth <= innerWidth` passava com a página do roteiro rolando até 1383 px (#87).
 */
const ROTAS: { nome: string; rota: string; pronto: (page: Page) => Promise<void> }[] = [
  { nome: 'início', rota: './', pronto: (p) => expect(p.getByRole('heading', { level: 1 })).toBeVisible() },
  {
    nome: 'detalhes',
    rota: './',
    pronto: async (p) => {
      await p.getByRole('button', { name: /Movies: de 3,3 s/ }).first().click();
      await expect(p.getByRole('dialog')).toBeVisible();
      // A janela é fixa e corta o que passa da borda: o scrollWidth da página não pega isso.
      const j = await p.locator('.janela').evaluate((e) => [e.scrollWidth, e.clientWidth]);
      expect(j[0], 'conteúdo cortado na janela').toBeLessThanOrEqual(j[1]);
    },
  },
  { nome: 'roteiro', rota: `./#/v/${SLUG}`, pronto: (p) => expect(p.getByRole('heading', { name: /^Roteiro em \d+ blocos$/ })).toBeVisible() },
  { nome: 'gravação', rota: `./#/v/${SLUG}/gravar`, pronto: (p) => expect(p.getByRole('button', { name: /Começar a gravação/ })).toBeVisible() },
  { nome: 'roteiro inexistente', rota: './#/v/nao-existe', pronto: (p) => expect(p.getByRole('heading', { name: 'Roteiro não encontrado' })).toBeVisible() },
];

for (const { nome, rota, pronto } of ROTAS) {
  test(`sem rolagem lateral em 360 px: ${nome} (#89)`, async ({ page }, info) => {
    test.skip(info.project.name !== 'celular', 'mede a largura de 360 px');
    await page.setViewportSize({ width: 360, height: 800 });
    await abrir(page, rota, info.project.name);
    await pronto(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  });
}

test('no roteiro, o comando longo rola dentro do bloco em 360 px (#87)', async ({ page }, info) => {
  test.skip(info.project.name !== 'celular', 'mede a largura de 360 px');
  await page.setViewportSize({ width: 360, height: 800 });
  await abrir(page, `./#/v/${SLUG}`, info.project.name);
  await expect(page.getByRole('heading', { name: /^Roteiro em \d+ blocos$/ })).toBeVisible();
  const caixa = await page.locator('.bloco pre').first().boundingBox();
  expect(caixa!.x + caixa!.width).toBeLessThanOrEqual(360);
});

test('teleprompter: contagem antes do 1º começo e progresso do bloco (#84)', async ({ page }, info) => {
  test.skip(info.project.name === 'celular', 'atalho de teclado é de desktop');
  await abrir(page, `./#/v/${SLUG}/gravar`, info.project.name);
  for (const caixa of await page.getByRole('checkbox').all()) await caixa.check();
  await page.getByRole('button', { name: /Começar a gravação/ }).click();
  await expect(page.getByRole('progressbar', { name: /^Bloco 1: / })).toBeVisible();
  await page.keyboard.press('Space');
  const contagem = page.getByRole('status').filter({ hasText: /Começa em/ });
  await expect(contagem).toBeVisible();
  await semViolacoes(page, '.gravacao');
  await expect(page.getByRole('button', { name: 'Pausar' })).toBeVisible({ timeout: 6000 });
  await expect(contagem).toHaveCount(0);
  const barra = page.getByRole('progressbar', { name: /^Bloco \d+: / });
  await expect.poll(async () => Number(await barra.getAttribute('aria-valuenow')), { timeout: 6000 }).toBeGreaterThan(0);
});
