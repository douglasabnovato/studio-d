import { useRef } from 'react';
import type { Episodio, Serie } from '../lib/catalogo';
import { Card } from './Card';

interface Props {
  serie: Pick<Serie, 'id' | 'nome' | 'descricao'>;
  episodios: Episodio[];
  onAbrir: (e: Episodio, origem: HTMLElement) => void;
}

/** Uma fileira horizontal. Setas ← e → movem o foco entre os cards; Home e End vão às pontas. */
export function Fileira({ serie, episodios, onAbrir }: Props) {
  const lista = useRef<HTMLUListElement>(null);
  const tituloId = `fileira-${serie.id}`;

  const onTecla = (ev: React.KeyboardEvent<HTMLButtonElement>) => {
    const todos = Array.from(lista.current?.querySelectorAll<HTMLButtonElement>('[data-card]') ?? []);
    const i = todos.indexOf(ev.currentTarget);
    let alvo = -1;
    if (ev.key === 'ArrowRight') alvo = Math.min(i + 1, todos.length - 1);
    else if (ev.key === 'ArrowLeft') alvo = Math.max(i - 1, 0);
    else if (ev.key === 'Home') alvo = 0;
    else if (ev.key === 'End') alvo = todos.length - 1;
    if (alvo >= 0) {
      ev.preventDefault();
      todos[alvo].focus();
      todos[alvo].scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    }
  };

  const rolar = (sentido: 1 | -1) => {
    const el = lista.current;
    if (el) el.scrollBy({ left: sentido * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (episodios.length === 0) return null;
  return (
    <section className="fileira" aria-labelledby={tituloId}>
      <div className="fileira-cabecalho">
        <h2 id={tituloId}>{serie.nome}</h2>
      </div>
      {serie.descricao && <p className="fileira-descricao fileira-cabecalho">{serie.descricao}</p>}
      <div className="fileira-trilho">
        <button
          type="button"
          className="fileira-seta fileira-seta-esquerda"
          onClick={() => rolar(-1)}
          aria-label={`Voltar em ${serie.nome}`}
          tabIndex={-1}
        >
          ‹
        </button>
        <ul className="fileira-lista" ref={lista}>
          {episodios.map((e) => (
            <Card key={e.chave} episodio={e} onAbrir={onAbrir} onTecla={onTecla} />
          ))}
        </ul>
        <button
          type="button"
          className="fileira-seta fileira-seta-direita"
          onClick={() => rolar(1)}
          aria-label={`Avançar em ${serie.nome}`}
          tabIndex={-1}
        >
          ›
        </button>
      </div>
    </section>
  );
}
