import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aplicarTema, temaSalvo, type Tema } from '../lib/tema';

interface Props {
  busca?: string;
  onBusca?: (texto: string) => void;
}

export function Topo({ busca, onBusca }: Props) {
  const [tema, setTema] = useState<Tema>(temaSalvo);
  useEffect(() => {
    aplicarTema(tema);
  }, [tema]);
  const outro: Tema = tema === 'dark' ? 'light' : 'dark';

  return (
    <header className="topo">
      <Link to="/" className="marca">
        <span className="marca-d" aria-hidden="true">
          D
        </span>
        <span>Studio D</span>
        <span className="sr-only">, início</span>
      </Link>
      <div className="topo-acoes">
        {onBusca && (
          <>
            <label htmlFor="busca" className="sr-only">
              Buscar roteiros
            </label>
            <input
              id="busca"
              className="busca"
              type="search"
              placeholder="Buscar por título ou repositório"
              value={busca}
              onChange={(e) => onBusca(e.target.value)}
            />
          </>
        )}
        <button
          type="button"
          className="botao botao-secundario botao-icone"
          onClick={() => setTema(outro)}
          aria-label={outro === 'light' ? 'Usar tema claro' : 'Usar tema escuro'}
          title={outro === 'light' ? 'Tema claro' : 'Tema escuro'}
        >
          <span aria-hidden="true">{tema === 'dark' ? '☀' : '☾'}</span>
        </button>
      </div>
    </header>
  );
}
