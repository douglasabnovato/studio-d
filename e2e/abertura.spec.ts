import { expect, test } from '@playwright/test';

// O relógio do navegador fica parado (page.clock): a abertura só avança quando o teste manda,
// e a demora para carregar a página na máquina de teste não come o tempo da animação.
test.describe('abertura com o D', () => {
  test.beforeEach(async ({ page }, info) => {
    test.skip(info.project.name !== 'escuro', 'roda num projeto só');
    // install() sozinho deixa o tempo correr; pauseAt() congela até o teste mandar avançar.
    const inicio = new Date('2026-11-11T10:00:00Z');
    await page.clock.install({ time: inicio });
    await page.clock.pauseAt(new Date(inicio.getTime() + 1000));
  });

  test('anima, pode ser pulada e não volta na mesma sessão', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('./');
    const abertura = page.getByTestId('abertura');
    await expect(abertura).toBeVisible();
    await expect(abertura).not.toHaveClass(/abertura-parada/);

    // O axe usa temporizadores e trava com o relógio parado. A abertura só tem um botão com texto;
    // o desenho e o nome são decorativos (aria-hidden), e o contraste do botão está em contraste.test.ts.
    await expect(page.getByTestId('abertura').locator('svg')).toHaveAttribute('aria-hidden', 'true');

    // O primeiro Tab chega no botão de pular.
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Pular abertura' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(abertura).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(abertura).toHaveCount(0);
  });

  test('termina sozinha em até 2,5 s', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('./');
    const abertura = page.getByTestId('abertura');
    await expect(abertura).toBeVisible();
    await page.clock.runFor(2300);
    await expect(abertura).toBeVisible();
    await page.clock.runFor(200);
    await expect(abertura).toHaveCount(0);
  });

  test('com movimento reduzido, mostra o D parado por meio segundo', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    const abertura = page.getByTestId('abertura');
    await expect(abertura).toHaveClass(/abertura-parada/);
    await page.clock.runFor(500);
    await expect(abertura).toHaveCount(0);
  });

  test('quem entra direto no modo gravação não vê a abertura', async ({ page }) => {
    await page.goto('./#/v/movies-lcp-no-celular/gravar');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByTestId('abertura')).toHaveCount(0);
  });
});
