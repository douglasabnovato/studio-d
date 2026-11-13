import { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Capa } from '../components/Capa';
import { Detalhes } from '../components/Detalhes';
import { Fileira } from '../components/Fileira';
import { PularParaConteudo } from '../components/PularParaConteudo';
import { Topo } from '../components/Topo';
import { destaque, type Catalogo, type Episodio } from '../lib/catalogo';
import { SITUACOES } from '../lib/tipos';

export function Inicio({ catalogo }: { catalogo: Catalogo }) {
  const [busca, setBusca] = useState('');
  const [aberto, setAberto] = useState<Episodio | null>(null);
  const origem = useRef<HTMLElement | null>(null);
  const principal = destaque(catalogo);
  const seriePrincipal = catalogo.series.find((s) => s.id === principal?.serie);

  const termo = busca.trim().toLowerCase();
  const filtra = (eps: Episodio[]) =>
    termo ? eps.filter((e) => `${e.titulo} ${e.repositorio} ${e.resumo}`.toLowerCase().includes(termo)) : eps;

  const todos = useMemo(() => catalogo.series.flatMap((s) => catalogo.porSerie.get(s.id) ?? []), [catalogo]);
  const prontos = todos.filter((e) => e.situacao === 'pronto' || e.situacao === 'rascunho');
  const publicados = todos.filter((e) => e.situacao === 'publicado');

  const abrir = (e: Episodio, el: HTMLElement) => {
    origem.current = el;
    setAberto(e);
  };
  const fechar = useCallback(() => {
    setAberto(null);
    requestAnimationFrame(() => origem.current?.focus());
  }, []);

  const fileiras = [
    { serie: { id: 'para-gravar', nome: 'Para gravar', descricao: 'Rascunhos e roteiros prontos, do mais adiantado ao mais novo.' }, eps: prontos },
    ...catalogo.series.map((s) => ({ serie: s, eps: catalogo.porSerie.get(s.id) ?? [] })),
    { serie: { id: 'publicados', nome: 'Publicados', descricao: '' }, eps: publicados },
  ];
  const visiveis = fileiras.map((f) => ({ ...f, eps: filtra(f.eps) }));
  const nada = termo && visiveis.every((f) => f.eps.length === 0);

  return (
    <>
      <PularParaConteudo />
      <Topo busca={busca} onBusca={setBusca} />
      <main id="conteudo" tabIndex={-1}>
        {principal && seriePrincipal && !termo && (
          <section className="destaque" aria-labelledby="destaque-titulo">
            <div className="destaque-capa">
              <Capa id="destaque" titulo="" matiz={seriePrincipal.matiz} />
            </div>
            <div className="destaque-conteudo">
              <p className="destaque-serie">
                {seriePrincipal.nome} · Episódio {principal.episodio}
              </p>
              <h1 id="destaque-titulo">{principal.titulo}</h1>
              <ul className="metadados">
                <li>
                  <span className={`selo${principal.situacao === 'pronto' ? ' selo-pronto' : ''}`}>{SITUACOES[principal.situacao]}</span>
                </li>
                <li>{principal.duracaoAlvo}</li>
                <li>{principal.repositorio}</li>
              </ul>
              <p className="destaque-resumo">{principal.resumo}</p>
              <div className="destaque-acoes">
                <Link className="botao botao-principal" to={`/v/${principal.slug}/gravar`}>
                  <span aria-hidden="true">▶</span> Gravar
                </Link>
                <Link className="botao botao-secundario" to={`/v/${principal.slug}`}>
                  <span aria-hidden="true">ⓘ</span> Ver roteiro
                </Link>
              </div>
            </div>
          </section>
        )}
        {termo && <h1 className="pagina">Resultados para “{busca.trim()}”</h1>}
        {nada && (
          <p className="pagina" role="status">
            Nenhum episódio com esse termo. Tente o nome de um repositório, como “movies”.
          </p>
        )}
        <div className="fileiras">
          {visiveis.map((f) => (
            <Fileira key={f.serie.id} serie={f.serie} episodios={f.eps} onAbrir={abrir} />
          ))}
        </div>
      </main>
      <footer className="rodape">
        Studio D · roteiros montados a partir dos repositórios de{' '}
        <a href="https://github.com/douglasabnovato">douglasabnovato</a>. Interface inspirada em serviços de streaming, com
        identidade própria.
      </footer>
      {aberto && <Detalhes episodio={aberto} episodiosDaSerie={catalogo.porSerie.get(aberto.serie.id) ?? []} onFechar={fechar} />}
    </>
  );
}
