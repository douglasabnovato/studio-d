import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { entrouPeloInicio } from '../App';
import { Abertura, deveMostrarAbertura, DURACAO, DURACAO_REDUZIDA } from './Abertura';

function preferirMovimentoReduzido(reduzido: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: reduzido && q.includes('reduce'),
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe('Abertura', () => {
  beforeEach(() => {
    sessionStorage.clear();
    preferirMovimentoReduzido(false);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('termina sozinha em até 2,5 s e não volta na mesma sessão', () => {
    vi.useFakeTimers();
    const fim = vi.fn();
    expect(deveMostrarAbertura()).toBe(true);
    render(<Abertura onFim={fim} />);
    act(() => vi.advanceTimersByTime(DURACAO - 1));
    expect(fim).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(fim).toHaveBeenCalledOnce();
    expect(DURACAO).toBeLessThanOrEqual(2500);
    expect(deveMostrarAbertura()).toBe(false);
  });

  it('o botão Pular encerra na hora, uma vez só', async () => {
    const user = userEvent.setup();
    const fim = vi.fn();
    render(<Abertura onFim={fim} />);
    await user.click(screen.getByRole('button', { name: 'Pular abertura' }));
    expect(fim).toHaveBeenCalledOnce();
  });

  it('Esc pula', async () => {
    const user = userEvent.setup();
    const fim = vi.fn();
    render(<Abertura onFim={fim} />);
    await user.keyboard('{Escape}');
    expect(fim).toHaveBeenCalledOnce();
  });

  it('com movimento reduzido, o D fica parado por meio segundo', () => {
    vi.useFakeTimers();
    preferirMovimentoReduzido(true);
    const fim = vi.fn();
    render(<Abertura onFim={fim} />);
    expect(screen.getByTestId('abertura')).toHaveClass('abertura-parada');
    act(() => vi.advanceTimersByTime(DURACAO_REDUZIDA));
    expect(fim).toHaveBeenCalledOnce();
  });

  it('o desenho é decorativo para leitores de tela', () => {
    render(<Abertura onFim={() => {}} />);
    expect(screen.getByTestId('abertura').querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('só aparece para quem entra pela tela de início', () => {
    expect(entrouPeloInicio('')).toBe(true);
    expect(entrouPeloInicio('#/')).toBe(true);
    expect(entrouPeloInicio('#/v/movies-lcp-no-celular')).toBe(false);
    expect(entrouPeloInicio('#/v/movies-lcp-no-celular/gravar')).toBe(false);
  });

  it('sem armazenamento, não mostra (nunca trava a entrada)', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'sessionStorage')!;
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('bloqueado');
      },
    });
    try {
      expect(deveMostrarAbertura()).toBe(false);
    } finally {
      Object.defineProperty(window, 'sessionStorage', original);
    }
  });
});
