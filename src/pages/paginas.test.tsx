import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Rotas } from '../App';
import { indexarCatalogo, type Catalogo } from '../lib/catalogo';
import { catalogo } from '../lib/conteudo';
import { emSegundos, type Roteiro } from '../lib/tipos';
import { ITENS_CHECKLIST, Teleprompter } from './Gravacao';

const abrir = (rota = '/', c: Catalogo = catalogo) =>
  render(
    <MemoryRouter initialEntries={[rota]}>
      <Rotas catalogo={c} />
    </MemoryRouter>,
  );

// O primeiro roteiro completo, com fontes, blocos e YouTube, que chegam num pedaço à parte (#56).
let primeiro: Roteiro;
beforeAll(async () => {
  primeiro = await catalogo.carregar(catalogo.roteiros[0].slug);
});

describe('Início', () => {
  it('mostra a meta do MVP: sem vídeo publicado, o relógio ainda não começou (#80)', () => {
    abrir();
    const linha = screen.getByText('Meta do MVP:').closest('p')!;
    expect(linha).toHaveTextContent('Meta do MVP: 4 vídeos em 30 dias. O relógio começa no 1º vídeo publicado.');
    expect(screen.getByText('Meta do MVP:').tagName).toBe('STRONG');
  });

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
  it('mostra os blocos, as fontes e o botão de gravar', async () => {
    abrir(`/v/${primeiro.slug}`);
    expect(screen.getByRole('heading', { level: 1, name: primeiro.titulo })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: `Roteiro em ${primeiro.blocos.length} blocos` })).toBeInTheDocument();
    for (const f of primeiro.fontes) expect(screen.getByRole('link', { name: f.titulo })).toHaveAttribute('href', f.url);
    expect(screen.getByRole('link', { name: /Gravar/ })).toHaveAttribute('href', `/v/${primeiro.slug}/gravar`);
  });

  it('mostra a fala, a tela e os comandos que vieram do build (#9)', async () => {
    const { container } = abrir(`/v/${primeiro.slug}`);
    await screen.findByRole('heading', { name: /^Roteiro em/ });
    const trecho = (md: string) => md.replace(/[*_`#>[\]()-]/g, ' ').split(/\s+/).filter((p) => p.length > 4).slice(0, 3);
    const textoDaPagina = container.textContent ?? '';
    const comTela = primeiro.blocos.find((b) => b.tela)!;
    const comComandos = primeiro.blocos.find((b) => b.comandos)!;
    for (const md of [primeiro.blocos[0].fala, comTela.tela, comComandos.comandos]) {
      for (const palavra of trecho(md)) expect(textoDaPagina).toContain(palavra);
    }
  });

  it('avisa quando o roteiro não existe', () => {
    abrir('/v/nao-existe');
    expect(screen.getByRole('heading', { name: 'Roteiro não encontrado' })).toBeInTheDocument();
  });

  it('copia o texto do YouTube e confirma', async () => {
    const user = userEvent.setup();
    abrir(`/v/${primeiro.slug}`);
    await user.click(await screen.findByRole('button', { name: 'Copiar descrição' }));
    expect(await screen.findByText('Copiado: descrição.')).toBeInTheDocument();
    expect(await navigator.clipboard.readText()).toBe(primeiro.youtube.descricao);
  });

  it('avisa quando o navegador não deixa copiar', async () => {
    const user = userEvent.setup();
    const negado = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new DOMException('negado', 'NotAllowedError'));
    try {
      abrir(`/v/${primeiro.slug}`);
      await user.click(await screen.findByRole('button', { name: 'Copiar tags' }));
      expect(await screen.findByText('Não deu para copiar. Selecione o texto e use Ctrl+C.')).toBeInTheDocument();
      expect(negado).toHaveBeenCalledWith(primeiro.youtube.tags);
    } finally {
      negado.mockRestore();
    }
  });

  it('não deixa HTML do roteiro virar elemento', async () => {
    abrir(`/v/${primeiro.slug}`);
    await screen.findByRole('heading', { name: /^Roteiro em/ });
    expect(document.querySelector('main script, main iframe')).toBeNull();
  });
});

describe('Carregar o roteiro sob demanda (#56)', () => {
  /** Catálogo com os mesmos resumos e um carregador controlado pelo teste. */
  const comCarregador = (carregar: Catalogo['carregar']) => indexarCatalogo(catalogo.series, catalogo.roteiros, carregar);

  it('mostra o cabeçalho na hora e avisa enquanto o roteiro carrega', async () => {
    let entregar: (r: Roteiro) => void = () => {};
    abrir(`/v/${primeiro.slug}`, comCarregador(() => new Promise((ok) => (entregar = ok))));
    expect(screen.getByRole('heading', { level: 1, name: primeiro.titulo })).toBeInTheDocument();
    expect(screen.getByText('Carregando o roteiro…')).toHaveAttribute('aria-live', 'polite');
    entregar(primeiro);
    expect(await screen.findByRole('heading', { name: `Roteiro em ${primeiro.blocos.length} blocos` })).toBeInTheDocument();
    expect(screen.queryByText('Carregando o roteiro…')).not.toBeInTheDocument();
  });

  it('avisa quando o pedaço não chega e tenta de novo', async () => {
    const user = userEvent.setup();
    const carregar = vi.fn<Catalogo['carregar']>().mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValue(primeiro);
    abrir(`/v/${primeiro.slug}`, comCarregador(carregar));
    expect(await screen.findByRole('alert')).toHaveTextContent('Não deu para carregar o roteiro');
    expect(screen.getByRole('button', { name: 'Recarregar a página' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(await screen.findByRole('heading', { name: /^Roteiro em/ })).toBeInTheDocument();
    expect(carregar).toHaveBeenCalledTimes(2);
  });

  it('no modo gravação, o botão de começar espera o roteiro e avisa a falha', async () => {
    const user = userEvent.setup();
    abrir(`/v/${primeiro.slug}/gravar`, comCarregador(() => Promise.reject(new TypeError('Failed to fetch'))));
    for (const c of screen.getAllByRole('checkbox')) await user.click(c);
    expect(await screen.findByRole('alert')).toHaveTextContent('Não deu para carregar o roteiro');
    expect(screen.getByRole('button', { name: /Começar a gravação/ })).toBeDisabled();
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
    await vi.waitFor(() => expect(comecar).toBeEnabled());
    await user.click(comecar);
    expect(screen.getByRole('region', { name: /Modo gravação/ })).toBeInTheDocument();
  });

  it('teclado: espaço pausa, setas mudam o ritmo e Esc sai', async () => {
    const user = userEvent.setup();
    const sair = vi.fn();
    render(<Teleprompter roteiro={primeiro} onSair={sair} contagemSegundos={0} />);
    const rolar = screen.getByRole('button', { name: 'Rolar' });
    expect(rolar).not.toHaveAttribute('aria-pressed');
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument();
    await user.keyboard(' ');
    expect(screen.getByText('Ritmo 100%')).toBeInTheDocument();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByText('Ritmo 120%')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Ritmo 110%')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(sair).toHaveBeenCalledOnce();
  });

  it('ignora atalhos com Ctrl (o zoom do navegador)', async () => {
    const user = userEvent.setup();
    render(<Teleprompter roteiro={primeiro} onSair={() => {}} />);
    await user.keyboard('{Control>}{ArrowUp}{/Control}');
    expect(screen.getByText('Ritmo 100%')).toBeInTheDocument();
  });

  it('o primeiro começo conta e só então rola (#84)', async () => {
    const user = userEvent.setup();
    // Contagem curta no teste (2 s), com o relógio real.
    render(<Teleprompter roteiro={primeiro} onSair={() => {}} contagemSegundos={2} />);
    await user.keyboard(' ');
    expect(screen.getByRole('status')).toHaveTextContent('Começa em 2');
    expect(screen.getByRole('button', { name: 'Cancelar contagem' })).toBeInTheDocument();
    await vi.waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Começa em 1'), { timeout: 1600 });
    expect(await screen.findByRole('button', { name: 'Pausar' }, { timeout: 1600 })).toBeInTheDocument();
    // Do 1 direto para a rolagem: nunca anuncia "Começa em 0".
    expect(screen.getByRole('status')).toHaveTextContent('');
    // Pausar e voltar a rolar não conta de novo.
    await user.keyboard('  ');
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument();
  });

  it('Esc cancela a contagem sem sair, e Zerar tempo volta a contar (#84)', async () => {
    const user = userEvent.setup();
    const sair = vi.fn();
    render(<Teleprompter roteiro={primeiro} onSair={sair} />);
    await user.keyboard(' ');
    expect(screen.getByRole('status')).toHaveTextContent('Começa em 3');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('status')).toHaveTextContent('');
    expect(sair).not.toHaveBeenCalled();
    // Cancelar não conta como começo: o próximo também conta.
    await user.click(screen.getByRole('button', { name: 'Rolar' }));
    expect(screen.getByRole('status')).toHaveTextContent('Começa em 3');
    await user.click(screen.getByRole('button', { name: 'Cancelar contagem' }));
    await user.click(screen.getByRole('button', { name: 'Zerar tempo' }));
    await user.click(screen.getByRole('button', { name: 'Rolar' }));
    expect(screen.getByRole('status')).toHaveTextContent('Começa em 3');
  });

  it('"Zerar tempo" com o texto rolando pausa, e o próximo Rolar conta de novo (#84)', async () => {
    const user = userEvent.setup();
    render(<Teleprompter roteiro={primeiro} onSair={() => {}} contagemSegundos={2} />);
    await user.click(screen.getByRole('button', { name: 'Rolar' }));
    expect(await screen.findByRole('button', { name: 'Pausar' }, { timeout: 2600 })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Zerar tempo' }));
    expect(screen.getByRole('button', { name: 'Rolar' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Rolar' }));
    expect(screen.getByRole('status')).toHaveTextContent('Começa em 2');
  });

  it('mostra o progresso do bloco atual, com o nome do bloco (#84)', () => {
    render(<Teleprompter roteiro={primeiro} onSair={() => {}} />);
    const barra = screen.getByRole('progressbar', { name: `Bloco 1: ${primeiro.blocos[0].nome}` });
    expect(barra).toHaveAttribute('aria-valuemin', '0');
    expect(barra).toHaveAttribute('aria-valuemax', '100');
  });

  it('o ritmo fica entre 50% e 200%, de 10 em 10 (#83)', async () => {
    const user = userEvent.setup();
    render(<Teleprompter roteiro={primeiro} onSair={() => {}} contagemSegundos={0} />);
    for (let i = 0; i < 12; i++) await user.click(screen.getByRole('button', { name: 'Mais rápido' }));
    expect(screen.getByText('Ritmo 200%')).toBeInTheDocument();
    for (let i = 0; i < 20; i++) await user.click(screen.getByRole('button', { name: 'Mais devagar' }));
    expect(screen.getByText('Ritmo 50%')).toBeInTheDocument();
  });

  it('mostra a cena atual e o tempo total do roteiro', () => {
    render(<Teleprompter roteiro={primeiro} onSair={() => {}} />);
    expect(screen.getByText(/de \d+ ·/)).toHaveTextContent(`de ${primeiro.blocos.length}`);
    expect(screen.getByText(/0:00 \//)).toHaveTextContent(primeiro.blocos[primeiro.blocos.length - 1].fim);
  });
});

describe('Fala por bloco (#90)', () => {
  const comBlocos = (ajustar: (r: Roteiro) => Roteiro) =>
    indexarCatalogo(catalogo.series, catalogo.roteiros, async (slug) => ajustar(await catalogo.carregar(slug)));

  it('esconde o "de fala" num bloco sem fala estimada', async () => {
    const r0 = (r: Roteiro) => ({ ...r, blocos: r.blocos.map((b, i) => (i === 0 ? { ...b, falaSegundos: 0 } : b)) });
    abrir(`/v/${primeiro.slug}`, comBlocos(r0));
    const titulo = await screen.findByRole('heading', { level: 2, name: new RegExp(`^1\. ${primeiro.blocos[0].nome}`) });
    expect(titulo).not.toHaveTextContent('de fala');
    expect(screen.getByRole('heading', { level: 2, name: new RegExp(`^2\. ${primeiro.blocos[1].nome}`) })).toHaveTextContent('de fala');
  });

  it('avisa, em texto, quando a fala passa do tempo do bloco', async () => {
    // A fala do 1º bloco fica 12 s maior que a janela dele.
    const longo = (r: Roteiro) => ({
      ...r,
      blocos: r.blocos.map((b, i) => (i === 0 ? { ...b, falaSegundos: emSegundos(b.fim) - emSegundos(b.inicio) + 12 } : b)),
    });
    abrir(`/v/${primeiro.slug}`, comBlocos(longo));
    await screen.findByRole('heading', { name: /^Roteiro em/ });
    const avisos = screen.getAllByText(/A fala estimada passa .+ do tempo do bloco/);
    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toHaveTextContent('A fala estimada passa 12 s do tempo do bloco: encurte a fala ou aumente o tempo do bloco.');
  });

  it('não avisa nos roteiros de hoje, que cabem no tempo', async () => {
    abrir(`/v/${primeiro.slug}`);
    await screen.findByRole('heading', { name: /^Roteiro em/ });
    expect(screen.queryByText(/A fala estimada passa .+ do tempo do bloco/)).not.toBeInTheDocument();
  });
});
