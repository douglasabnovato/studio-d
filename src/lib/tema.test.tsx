import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Topo } from '../components/Topo';
import { aplicarTema, temaSalvo } from './tema';

/** Simula o `prefers-color-scheme` do sistema. */
function sistema(claro: boolean) {
  vi.stubGlobal('matchMedia', (consulta: string) => ({
    matches: consulta === '(prefers-color-scheme: light)' ? claro : false,
    media: consulta,
    addEventListener() {},
    removeEventListener() {},
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.theme;
});

describe('tema na primeira visita (#57)', () => {
  it('sistema claro, sem escolha salva: abre no claro', () => {
    sistema(true);
    expect(temaSalvo()).toBe('light');
  });

  it('sistema escuro, sem escolha salva: abre no escuro', () => {
    sistema(false);
    expect(temaSalvo()).toBe('dark');
  });

  it('com escolha salva, vale a escolha, qualquer que seja o sistema', () => {
    sistema(true);
    localStorage.setItem('studio-d:tema', 'dark');
    expect(temaSalvo()).toBe('dark');
    sistema(false);
    localStorage.setItem('studio-d:tema', 'light');
    expect(temaSalvo()).toBe('light');
  });

  it('sem matchMedia (navegador antigo), fica no escuro', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(temaSalvo()).toBe('dark');
  });

  it('aplicar o tema do sistema não grava escolha', () => {
    sistema(true);
    aplicarTema(temaSalvo());
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('studio-d:tema')).toBeNull();
  });

  it('o botão do topo grava a escolha manual', async () => {
    sistema(true);
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Topo />
      </MemoryRouter>,
    );
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('studio-d:tema')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Usar tema escuro' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('studio-d:tema')).toBe('dark');
  });
});
