import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const SLUG = 'movies-lcp-no-celular';

/** O tema do site segue o projeto: o claro grava a escolha antes de abrir. */
async function abrir(page: Page, rota: string, projeto: string) {
  if (projeto === 'claro') {
    await page.addInitScript(() => localStorage.setItem('studio-d:tema', 'light'));
  }
  // Nada de rede externa nos testes, além do próprio site.
  await page.route(/^https:\/\/fonts\./, (r) => r.abort());
  await page.goto(rota);
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
  const largura = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(largura[0]).toBeLessThanOrEqual(largura[1]);
  await page.goto(`./#/v/${SLUG}`);
  const l2 = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(l2[0]).toBeLessThanOrEqual(l2[1]);
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
