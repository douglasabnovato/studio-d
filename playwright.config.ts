import { defineConfig, devices } from '@playwright/test';

const porta = 4173;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${porta}/studio-d/`,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'escuro', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 }, colorScheme: 'dark' } },
    { name: 'claro', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 }, colorScheme: 'light' } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${porta} --strictPort`,
    url: `http://localhost:${porta}/studio-d/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
