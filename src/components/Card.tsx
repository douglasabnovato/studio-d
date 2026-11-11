import type { Episodio } from '../lib/catalogo';
import { SITUACOES } from '../lib/roteiro';
import { Capa } from './Capa';

interface Props {
  episodio: Episodio;
  onAbrir: (e: Episodio, origem: HTMLElement) => void;
  onTecla: (ev: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export function Card({ episodio, onAbrir, onTecla }: Props) {
  const { roteiro, serie } = episodio;
  const rotulo = roteiro ? `Episódio ${roteiro.episodio}` : SITUACOES.planejado;
  return (
    <li className="card">
      <button
        type="button"
        className="card-botao"
        data-card
        onClick={(ev) => onAbrir(episodio, ev.currentTarget)}
        onKeyDown={onTecla}
      >
        <span className="card-capa">
          <Capa id={episodio.chave} titulo={episodio.titulo} matiz={serie.matiz} rotulo={rotulo} />
        </span>
        <span className="card-info">
          <span className="card-titulo">{episodio.titulo}</span>
          <span className="card-linha">
            <span className={`selo${episodio.situacao === 'pronto' ? ' selo-pronto' : ''}`}>{SITUACOES[episodio.situacao]}</span>
            {roteiro && <span>{roteiro.duracaoAlvo}</span>}
            <span>{episodio.repositorio.split('/')[1]}</span>
          </span>
        </span>
        <span className="sr-only">. Abrir detalhes</span>
      </button>
    </li>
  );
}
