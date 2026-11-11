import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Rotas } from '../App';
import { catalogo } from '../lib/conteudo';
import { ITENS_CHECKLIST, Teleprompter } from './Gravacao';

const abrir = (rota = '/') =>
  render(
    <MemoryRouter initialEntries={[rota]}>
      <Rotas catalogo={catalogo} />
    </MemoryRouter>,
  );

const primeiro = catalogo.roteiros[0];

describe('Início', () => {
  it('mostra o destaque e uma fileira por série', () => {
    abrir();
    expect(screen.getByRole('heading', { level: 1, name: primeiro.titulo })).toBeInTheDocument();
    for (const s of catalogo.series) expect(screen.getByRole('heading', { level: 2, name: s.nome })).toBeInTheDocument();
  });

  it('abre os detalhes, fecha com Esc e devolve o foco ao card', async () => {
    const user = userEvent.setup();
    abrir();
    const fileira = screen.getByRole('region', { name: 'Do curso ao produto' });
    const card = within(fileira).getAllByRole('button', { name: /Abrir detalhes/ })[0];
    await user.click(card);
    const janela = screen.getByRole('dialog');
    expect(within(janela).getByRole('heading', { level: 2 })).toHaveTextContent(primeiro.titulo);
    expect(within(janela).getByRole('button', { name: 'Fechar detalhes' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await vi.waitFor(() => expect(card).toHaveFocus());
  });

  it('Esc fecha mesmo depois de o foco sair da janela', async () => {
    const user = userEvent.setup();
    abrir();
    await user.click(screen.getAllByRole('button', { name: /Abrir detalhes/ })[0]);
    (document.activeElement as HTMLElement).blur();
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(false);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('prende o Tab dentro da janela', async () => {
    const user = userEvent.setup();
    abrir();
    await user.click(screen.getAllByRole('button', { name: /Abrir detalhes/ })[0]);
    const janela = screen.getByRole('dialog');
    await user.tab({ shift: true });
    expect(janela.contains(document.activeElement)).toBe(true);
    for (let i = 0; i < 20; i++) await user.tab();
    expect(janela.contains(document.activeElement)).toBe(true);
  });

  it('setas movem o foco entre os cards da fileira', async () => {
    const user = userEvent.setup();
    abrir();
    const fileira = screen.getByRole('region', { name: 'Do curso ao produto' });
    const cards = within(fileira).getAllByRole('button', { name: /Abrir detalhes/ });
    cards[0].focus();
    await user.keyboard('{ArrowRight}');
    expect(cards[1]).toHaveFocus();
    await user.keyboard('{End}');
    expect(cards[cards.length - 1]).toHaveFocus();
    await user.keyboard('{Home}');
    expect(cards[0]).toHaveFocus();
  });

  it('a busca filtra e avisa quando não acha nada', async () => {
    const user = userEvent.setup();
    abrir();
    await user.type(screen.getByRole('searchbox', { name: 'Buscar roteiros' }), 'aircnc');
    expect(screen.getAllByRole('button', { name: /AirCnC/ }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /Movies: de 3,3 s/ })).not.toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'zzzz');
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum episódio');
  });
});

describe('Pular para o conteúdo', () => {
  it('move o foco para o conteúdo sem trocar de rota', async () => {
    const user = userEvent.setup();
    abrir(`/v/${primeiro.slug}`);
    await user.click(screen.getByRole('link', { name: 'Pular para o conteúdo' }));
    expect(screen.getByRole('main')).toHaveFocus();
    expect(screen.getByRole('heading', { level: 1, name: primeiro.titulo })).toBeInTheDocument();
  });
});

describe('Roteiro', () => {
  it('mostra os blocos, as fontes e o botão de gravar', () => {
    abrir(`/v/${primeiro.slug}`);
    expect(screen.getByRole('heading', { level: 1, name: primeiro.titulo })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: `Roteiro em ${primeiro.blocos.length} blocos` })).toBeInTheDocument();
    for (const f of primeiro.fontes) expect(screen.getByRole('link', { name: f.titulo })).toHaveAttribute('href', f.url);
    expect(screen.getByRole('link', { name: /Gravar/ })).toHaveAttribute('href', `/v/${primeiro.slug}/gravar`);
  });

  it('avisa quando o roteiro não existe', () => {
    abrir('/v/nao-existe');
    expect(screen.getByRole('heading', { name: 'Roteiro não encontrado' })).toBeInTheDocument();
  });

  it('não deixa HTML do roteiro virar elemento', () => {
    abrir(`/v/${primeiro.slug}`);
    expect(document.querySelector('main script, main iframe')).toBeNull();
  });
});

describe('Gravação', () => {
  it('só libera o começo com o checklist completo', async () => {
    const user = userEvent.setup();
    abrir(`/v/${primeiro.slug}/gravar`);
    const comecar = screen.getByRole('button', { name: /Começar a gravação/ });
    expect(comecar).toBeDisabled();
    const caixas = screen.getAllByRole('checkbox');
    expect(caixas).toHaveLength(ITENS_CHECKLIST.length);
    for (const c of caixas) await user.click(c);
    expect(comecar).toBeEnabled();
    await user.click(comecar);
    expect(screen.getByRole('region', { name: /Modo gravação/ })).toBeInTheDocument();
  });

  it('teclado: espaço pausa, setas mudam a velocidade e Esc sai', async () => {
    const user = userEvent.setup();
    const sair = vi.fn();
    render(<Teleprompter roteiro={primeiro} onSair={sair} />);
    const rolar = screen.getByRole('button', { name: 'Rolar' });
    expect(rolar).toHaveAttribute('aria-pressed', 'false');
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'Pausar' })).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard(' ');
    expect(screen.getByText('Velocidade 40')).toBeInTheDocument();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByText('Velocidade 60')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Velocidade 50')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(sair).toHaveBeenCalledOnce();
  });

  it('ignora atalhos com Ctrl (o zoom do navegador)', async () => {
    const user = userEvent.setup();
    render(<Teleprompter roteiro={primeiro} onSair={() => {}} />);
    await user.keyboard('{Control>}{ArrowUp}{/Control}');
    expect(screen.getByText('Velocidade 40')).toBeInTheDocument();
  });

  it('mostra a cena atual e o tempo total do roteiro', () => {
    render(<Teleprompter roteiro={primeiro} onSair={() => {}} />);
    expect(screen.getByText(/de \d+ ·/)).toHaveTextContent(`de ${primeiro.blocos.length}`);
    expect(screen.getByText(/0:00 \//)).toHaveTextContent(primeiro.blocos[primeiro.blocos.length - 1].fim);
  });
});
