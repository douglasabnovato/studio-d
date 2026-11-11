import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Episodio } from '../lib/catalogo';
import { SITUACOES } from '../lib/roteiro';
import { Capa } from './Capa';

interface Props {
  episodio: Episodio;
  episodiosDaSerie: Episodio[];
  onFechar: () => void;
}

const FOCAVEIS = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Janela de detalhes: prende o foco, fecha com Esc ou clique fora. Quem abre devolve o foco ao card. */
export function Detalhes({ episodio, episodiosDaSerie, onFechar }: Props) {
  const janela = useRef<HTMLDivElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);
  const { roteiro, serie } = episodio;
  const tituloId = 'detalhes-titulo';

  useEffect(() => {
    fechar.current?.focus();
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = anterior;
    };
  }, []);

  // No document, e não só na janela: depois de um clique num texto, o foco sai dela,
  // e mesmo assim Esc precisa fechar e o Tab precisa voltar para dentro.
  useEffect(() => {
    const onTecla = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        onFechar();
        return;
      }
      if (ev.key !== 'Tab' || !janela.current) return;
      const focaveis = Array.from(janela.current.querySelectorAll<HTMLElement>(FOCAVEIS));
      if (focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      const dentro = janela.current.contains(document.activeElement);
      if (ev.shiftKey && (!dentro || document.activeElement === primeiro)) {
        ev.preventDefault();
        ultimo.focus();
      } else if (!ev.shiftKey && (!dentro || document.activeElement === ultimo)) {
        ev.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener('keydown', onTecla);
    return () => document.removeEventListener('keydown', onTecla);
  }, [onFechar]);

  return (
    <div
      className="janela-fundo"
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) onFechar();
      }}
    >
      <div className="janela" role="dialog" aria-modal="true" aria-labelledby={tituloId} ref={janela}>
        <div className="janela-capa">
          <Capa id={`janela-${episodio.chave}`} titulo="" matiz={serie.matiz} rotulo={serie.nome} />
          <button ref={fechar} type="button" className="botao botao-icone janela-fechar" onClick={onFechar} aria-label="Fechar detalhes">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="janela-corpo">
          <h2 id={tituloId}>{episodio.titulo}</h2>
          <ul className="metadados">
            <li>
              <span className={`selo${episodio.situacao === 'pronto' ? ' selo-pronto' : ''}`}>{SITUACOES[episodio.situacao]}</span>
            </li>
            {roteiro && <li>{roteiro.duracaoAlvo}</li>}
            {roteiro && <li>Episódio {roteiro.episodio}</li>}
            <li>{episodio.repositorio}</li>
          </ul>
          {roteiro && (
            <div className="destaque-acoes janela-acoes">
              <Link className="botao botao-principal" to={`/v/${roteiro.slug}/gravar`}>
                <span aria-hidden="true">▶</span> Gravar
              </Link>
              <Link className="botao botao-secundario" to={`/v/${roteiro.slug}`}>
                Ver roteiro
              </Link>
            </div>
          )}
          <div className="janela-grade">
            <div>
              <p>{episodio.resumo}</p>
              {roteiro && (
                <p>
                  <span className="rotulo">Objetivo: </span>
                  {roteiro.objetivo}
                </p>
              )}
            </div>
            <div>
              {roteiro ? (
                <>
                  <p>
                    <span className="rotulo">Para quem: </span>
                    {roteiro.publico}
                  </p>
                  {roteiro.preRequisitos.length > 0 && (
                    <p>
                      <span className="rotulo">Antes de assistir: </span>
                      {roteiro.preRequisitos.join(', ')}
                    </p>
                  )}
                  <p>
                    <span className="rotulo">Fontes: </span>
                    {roteiro.fontes.length} links no roteiro
                  </p>
                </>
              ) : (
                <p className="rotulo">Roteiro ainda não escrito.</p>
              )}
            </div>
          </div>
          <h3>Episódios de {serie.nome}</h3>
          <ol className="episodios">
            {episodiosDaSerie.map((e, i) => (
              <li key={e.chave}>
                <span className="episodio-numero" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  {e.roteiro ? <Link to={`/v/${e.roteiro.slug}`}>{e.titulo}</Link> : <strong>{e.titulo}</strong>}
                  <p>
                    {SITUACOES[e.situacao]} · {e.resumo}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
