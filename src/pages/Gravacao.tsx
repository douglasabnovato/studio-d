import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Markdown } from '../components/Markdown';
import { PularParaConteudo } from '../components/PularParaConteudo';
import { Topo } from '../components/Topo';
import type { Catalogo } from '../lib/catalogo';
import { emSegundos, type Roteiro } from '../lib/tipos';

export const ITENS_CHECKLIST = [
  'Nenhum .env, token, senha ou chave na tela, no terminal ou no histórico do navegador.',
  'Nenhum dado de outra pessoa na tela: nomes, e-mails ou issues com links privados.',
  'Notificações do computador e do celular desligadas.',
  'O site no ar mostra a versão que o roteiro descreve (PRs já na principal).',
  'Microfone testado e janela no tamanho da gravação.',
  'Abas, repositórios e terminal do roteiro já abertos.',
];

function relogio(segundos: number) {
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Cronômetro à parte: só ele renderiza a cada quadro, não o texto do roteiro. */
function Cronometro({ rodando, total, zerar }: { rodando: boolean; total: number; zerar: number }) {
  const [tempo, setTempo] = useState(0);
  useEffect(() => {
    setTempo(0);
  }, [zerar]);
  useEffect(() => {
    if (!rodando) return;
    const id = window.setInterval(() => setTempo((t) => t + 0.25), 250);
    return () => window.clearInterval(id);
  }, [rodando]);
  return (
    <span className="gravacao-cronometro" aria-live="off">
      {relogio(tempo)} / {relogio(total)}
    </span>
  );
}

function Checklist({ roteiro, onComecar }: { roteiro: Roteiro; onComecar: () => void }) {
  const [marcados, setMarcados] = useState<boolean[]>(() => ITENS_CHECKLIST.map(() => false));
  const todos = marcados.every(Boolean);
  return (
    <>
      <PularParaConteudo />
      <Topo />
      <main id="conteudo" className="pagina checklist" tabIndex={-1}>
        <p className="destaque-serie">Antes de gravar</p>
        <h1>{roteiro.titulo}</h1>
        <p>Confira cada item. O botão de começar só libera com todos marcados.</p>
        <ul>
          {ITENS_CHECKLIST.map((item, i) => (
            <li key={item}>
              <label>
                <input
                  type="checkbox"
                  checked={marcados[i]}
                  onChange={(e) => setMarcados((m) => m.map((v, j) => (j === i ? e.target.checked : v)))}
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="destaque-acoes">
          <button type="button" className="botao botao-principal" disabled={!todos} onClick={onComecar}>
            <span aria-hidden="true">▶</span> Começar a gravação
          </button>
          <Link className="botao botao-secundario" to={`/v/${roteiro.slug}`}>
            Voltar ao roteiro
          </Link>
        </div>
        {!todos && (
          <p className="rotulo" role="status">
            Faltam {marcados.filter((m) => !m).length} itens.
          </p>
        )}
      </main>
    </>
  );
}

/** Teleprompter: espaço pausa, ↑ e ↓ mudam a velocidade, ← e → trocam o bloco, + e − mudam a letra, Esc sai. */
export function Teleprompter({ roteiro, onSair }: { roteiro: Roteiro; onSair: () => void }) {
  const texto = useRef<HTMLDivElement>(null);
  const [rodando, setRodando] = useState(false);
  const [velocidade, setVelocidade] = useState(40);
  const [letra, setLetra] = useState(44);
  const [atual, setAtual] = useState(0);
  const [zerar, setZerar] = useState(0);
  const posicao = useRef(0);
  const total = emSegundos(roteiro.blocos[roteiro.blocos.length - 1].fim);
  const bloco = roteiro.blocos[atual];

  const irPara = useCallback((i: number) => {
    const alvo = texto.current?.querySelector<HTMLElement>(`[data-bloco="${i}"]`);
    const caixa = texto.current;
    if (!alvo || !caixa) return;
    caixa.scrollTop = alvo.offsetTop - caixa.clientHeight * 0.3;
    posicao.current = caixa.scrollTop;
    setAtual(i);
  }, []);

  // Rolagem automática. A posição fica num ref: somar frações de pixel direto no scrollTop
  // perde o movimento nas velocidades baixas, porque o navegador arredonda.
  useEffect(() => {
    if (!rodando) return;
    const caixa = texto.current;
    if (caixa) posicao.current = caixa.scrollTop;
    let anterior = performance.now();
    let quadro = 0;
    const passo = (agora: number) => {
      const dt = (agora - anterior) / 1000;
      anterior = agora;
      if (caixa) {
        posicao.current = Math.min(posicao.current + velocidade * dt, caixa.scrollHeight);
        caixa.scrollTop = posicao.current;
      }
      quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [rodando, velocidade]);

  // Bloco atual: o que cruza a linha de leitura, a 30% da altura.
  const aoRolar = () => {
    const caixa = texto.current;
    if (!caixa) return;
    // Rolagem manual (roda do mouse) passa a valer como nova posição.
    if (Math.abs(caixa.scrollTop - posicao.current) > 2) posicao.current = caixa.scrollTop;
    const linha = caixa.scrollTop + caixa.clientHeight * 0.3 + 1;
    const blocos = Array.from(caixa.querySelectorAll<HTMLElement>('[data-bloco]'));
    let i = 0;
    for (const b of blocos) if (b.offsetTop <= linha) i = Number(b.dataset.bloco);
    setAtual(i);
  };

  useEffect(() => {
    const onTecla = (ev: KeyboardEvent) => {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return; // Ctrl+− é o zoom do navegador
      const alvo = ev.target as HTMLElement;
      if (ev.key === ' ' && alvo.tagName === 'BUTTON') return; // o botão já trata o espaço
      switch (ev.key) {
        case ' ':
          ev.preventDefault();
          setRodando((r) => !r);
          break;
        case 'ArrowUp':
          ev.preventDefault();
          setVelocidade((v) => Math.min(v + 10, 200));
          break;
        case 'ArrowDown':
          ev.preventDefault();
          setVelocidade((v) => Math.max(v - 10, 10));
          break;
        case 'ArrowRight':
          ev.preventDefault();
          irPara(Math.min(atual + 1, roteiro.blocos.length - 1));
          break;
        case 'ArrowLeft':
          ev.preventDefault();
          irPara(Math.max(atual - 1, 0));
          break;
        case '+':
        case '=':
          setLetra((l) => Math.min(l + 4, 96));
          break;
        case '-':
          setLetra((l) => Math.max(l - 4, 24));
          break;
        case 'Escape':
          onSair();
          break;
      }
    };
    window.addEventListener('keydown', onTecla);
    return () => window.removeEventListener('keydown', onTecla);
  }, [atual, irPara, onSair, roteiro.blocos.length]);

  return (
    <div className="gravacao" role="region" aria-label={`Modo gravação: ${roteiro.titulo}`}>
      <div className="gravacao-faixa">
        <span>
          Cena <strong>{atual + 1}</strong> de {roteiro.blocos.length} · {bloco.nome} · {bloco.inicio}–{bloco.fim}
        </span>
        {bloco.tela && (
          <span className="rotulo-tela">
            Tela: {bloco.tela.replace(/[*_`]/g, '').slice(0, 90)}
            {bloco.tela.length > 90 ? '…' : ''}
          </span>
        )}
        <Cronometro rodando={rodando} total={total} zerar={zerar} />
      </div>
      <div
        className="gravacao-texto"
        ref={texto}
        onScroll={aoRolar}
        tabIndex={0}
        aria-label="Texto do roteiro" style={{ fontSize: `${letra}px`, lineHeight: 1.35 }}>
        {roteiro.blocos.map((b, i) => (
          <section key={b.nome} className="gravacao-bloco" data-bloco={i} data-atual={i === atual}>
            <h2>
              {i + 1}. {b.nome}
            </h2>
            <Markdown html={b.html?.fala} />
          </section>
        ))}
      </div>
      <div className="gravacao-controles">
        <button type="button" className="botao botao-principal" onClick={() => setRodando((r) => !r)} aria-pressed={rodando}>
          {rodando ? 'Pausar' : 'Rolar'}
        </button>
        <button type="button" className="botao botao-secundario" onClick={() => setVelocidade((v) => Math.max(v - 10, 10))} aria-label="Mais devagar">
          −
        </button>
        <span aria-live="polite">Velocidade {velocidade}</span>
        <button type="button" className="botao botao-secundario" onClick={() => setVelocidade((v) => Math.min(v + 10, 200))} aria-label="Mais rápido">
          +
        </button>
        <button type="button" className="botao botao-secundario" onClick={() => setLetra((l) => Math.max(l - 4, 24))} >
          <span aria-hidden="true">A−</span>
          <span className="sr-only">Letra menor</span>
        </button>
        <button type="button" className="botao botao-secundario" onClick={() => setLetra((l) => Math.min(l + 4, 96))} >
          <span aria-hidden="true">A+</span>
          <span className="sr-only">Letra maior</span>
        </button>
        <button type="button" className="botao botao-secundario" onClick={() => setZerar((z) => z + 1)}>
          Zerar tempo
        </button>
        <span className="rotulo-atalhos">Espaço pausa · ↑↓ velocidade · ←→ bloco · Esc sai</span>
        <button type="button" className="botao botao-secundario" onClick={onSair} style={{ marginLeft: 'auto' }}>
          Sair
        </button>
      </div>
    </div>
  );
}

export function Gravacao({ catalogo }: { catalogo: Catalogo }) {
  const { slug } = useParams();
  const navegar = useNavigate();
  const [gravando, setGravando] = useState(false);
  const roteiro = catalogo.roteiros.find((r) => r.slug === slug);
  const sair = useCallback(() => navegar(`/v/${slug}`), [navegar, slug]);

  if (!roteiro) {
    return (
      <main className="pagina">
        <h1>Roteiro não encontrado</h1>
        <Link to="/">Voltar ao início</Link>
      </main>
    );
  }
  return gravando ? <Teleprompter roteiro={roteiro} onSair={sair} /> : <Checklist roteiro={roteiro} onComecar={() => setGravando(true)} />;
}
