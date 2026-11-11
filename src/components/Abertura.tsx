import { useCallback, useEffect, useRef, useState } from 'react';

const CHAVE = 'studio-d:abertura-vista';
/** Duração da animação completa, em ms (ADR-004: até 2,5 s). */
export const DURACAO = 2400;
/** Com movimento reduzido, o D fica parado por meio segundo. */
export const DURACAO_REDUZIDA = 500;

/** A abertura aparece uma vez por sessão; sem armazenamento, não aparece (nunca trava a entrada). */
export function deveMostrarAbertura(): boolean {
  try {
    return sessionStorage.getItem(CHAVE) !== '1';
  } catch {
    return false;
  }
}

function marcarComoVista() {
  try {
    sessionStorage.setItem(CHAVE, '1');
  } catch {
    /* armazenamento bloqueado: segue sem lembrar */
  }
}

function movimentoReduzido(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Faixas de luz que se abrem atrás do D: ângulo e comprimento de cada uma. */
const FAIXAS = [-62, -40, -22, -8, 8, 22, 40, 62, 118, 140, 158, 172, 188, 202, 220, 242];

/**
 * Abertura do Studio D: a haste do D desce em luz azul, a curva se desenha, o D brilha,
 * faixas de luz se abrem e a câmera entra no D. Desenho próprio (ADR-001), sem som.
 */
export function Abertura({ onFim }: { onFim: () => void }) {
  const [reduzido] = useState(movimentoReduzido);
  const [saindo, setSaindo] = useState(false);
  const pular = useRef<HTMLButtonElement>(null);
  const encerrado = useRef(false);

  const encerrar = useCallback(() => {
    if (encerrado.current) return;
    encerrado.current = true;
    marcarComoVista();
    onFim();
  }, [onFim]);

  // Fim pelo relógio: não depende de animationend, que não dispara com animação desligada.
  useEffect(() => {
    marcarComoVista();
    const total = reduzido ? DURACAO_REDUZIDA : DURACAO;
    const saida = window.setTimeout(() => setSaindo(true), Math.max(total - 300, 0));
    const fim = window.setTimeout(encerrar, total);
    return () => {
      window.clearTimeout(saida);
      window.clearTimeout(fim);
    };
  }, [encerrar, reduzido]);

  // O botão vem antes de tudo na página: o primeiro Tab chega nele, sem roubar o foco ao abrir.
  useEffect(() => {
    const onTecla = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        encerrar();
      }
    };
    document.addEventListener('keydown', onTecla);
    return () => document.removeEventListener('keydown', onTecla);
  }, [encerrar]);

  return (
    <div
      className={`abertura${reduzido ? ' abertura-parada' : ''}${saindo ? ' abertura-saindo' : ''}`}
      data-testid="abertura"
    >
      <svg className="abertura-cena" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="abertura-azul" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8cc0ff" />
            <stop offset="0.5" stopColor="#1e6bff" />
            <stop offset="1" stopColor="#0a2a66" />
          </linearGradient>
          <filter id="abertura-brilho" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="borrado" />
            <feMerge>
              <feMergeNode in="borrado" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g className="abertura-faixas">
          {FAIXAS.map((angulo, i) => (
            <line
              key={angulo}
              x1="200"
              y1="200"
              x2={200 + Math.cos((angulo * Math.PI) / 180) * (220 + (i % 3) * 40)}
              y2={200 + Math.sin((angulo * Math.PI) / 180) * (220 + (i % 3) * 40)}
              pathLength={1}
              style={{ animationDelay: `${1300 + (i % 4) * 60}ms` }}
            />
          ))}
        </g>
        <g className="abertura-d" filter="url(#abertura-brilho)">
          <path className="abertura-preenchimento" d="M140 100h56c62 0 104 40 104 100s-42 100-104 100h-56z" />
          <path className="abertura-haste" d="M140 96v208" pathLength={1} />
          <path className="abertura-curva" d="M140 100h56c62 0 104 40 104 100s-42 100-104 100h-56" pathLength={1} />
        </g>
      </svg>
      <p className="abertura-nome" aria-hidden="true">
        Studio D
      </p>
      <button ref={pular} type="button" className="abertura-pular" onClick={encerrar}>
        Pular abertura
      </button>
    </div>
  );
}
