import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Capa } from '../components/Capa';
import { Markdown } from '../components/Markdown';
import { Topo } from '../components/Topo';
import type { Catalogo } from '../lib/catalogo';
import { SITUACOES } from '../lib/roteiro';

function Copiar({ texto, nome }: { texto: string; nome: string }) {
  const [aviso, setAviso] = useState('');
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setAviso(`${nome} copiado.`);
    } catch {
      setAviso('Não deu para copiar. Selecione o texto e use Ctrl+C.');
    }
  };
  return (
    <>
      <button type="button" className="botao botao-secundario" onClick={copiar}>
        Copiar {nome.toLowerCase()}
      </button>
      <span role="status" className="rotulo">
        {' '}
        {aviso}
      </span>
    </>
  );
}

export function RoteiroPagina({ catalogo }: { catalogo: Catalogo }) {
  const { slug } = useParams();
  const roteiro = catalogo.roteiros.find((r) => r.slug === slug);

  if (!roteiro) {
    return (
      <>
        <Topo />
        <main id="conteudo" className="pagina">
          <h1>Roteiro não encontrado</h1>
          <p>
            Não há roteiro com o endereço “{slug}”. <Link to="/">Voltar ao início</Link>.
          </p>
        </main>
      </>
    );
  }

  const serie = catalogo.series.find((s) => s.id === roteiro.serie)!;
  const outros = (catalogo.porSerie.get(serie.id) ?? []).filter((e) => e.chave !== roteiro.slug);
  const { youtube } = roteiro;

  return (
    <>
      <a href="#conteudo" className="pular-para-conteudo">
        Pular para o conteúdo
      </a>
      <Topo />
      <main id="conteudo" className="pagina" tabIndex={-1}>
        <div className="roteiro-cabecalho">
          <div className="roteiro-capa">
            <Capa id={`roteiro-${roteiro.slug}`} titulo={roteiro.titulo} matiz={serie.matiz} rotulo={`${serie.nome} · Ep. ${roteiro.episodio}`} />
          </div>
          <div>
            <p className="destaque-serie">
              {serie.nome} · Episódio {roteiro.episodio}
            </p>
            <h1>{roteiro.titulo}</h1>
            <ul className="metadados">
              <li>
                <span className={`selo${roteiro.situacao === 'pronto' ? ' selo-pronto' : ''}`}>{SITUACOES[roteiro.situacao]}</span>
              </li>
              <li>{roteiro.duracaoAlvo}</li>
              <li>
                <a href={`https://github.com/${roteiro.repositorio}`}>{roteiro.repositorio}</a>
              </li>
            </ul>
            <p>{roteiro.resumo}</p>
            <p>
              <span className="rotulo">Objetivo: </span>
              {roteiro.objetivo}
            </p>
            <p>
              <span className="rotulo">Para quem: </span>
              {roteiro.publico}
            </p>
            <div className="destaque-acoes">
              <Link className="botao botao-principal" to={`/v/${roteiro.slug}/gravar`}>
                <span aria-hidden="true">▶</span> Gravar
              </Link>
            </div>
          </div>
        </div>

        <div className="roteiro-layout">
          <div>
            <h2>Roteiro em {roteiro.blocos.length} blocos</h2>
            {roteiro.blocos.map((b, i) => (
              <section className="bloco" key={b.nome} aria-labelledby={`bloco-${i}`}>
                <h2 id={`bloco-${i}`}>
                  <span>
                    {i + 1}. {b.nome}
                  </span>
                  <span className="bloco-tempo">
                    {b.inicio}–{b.fim}
                  </span>
                </h2>
                <h3>Fala</h3>
                <Markdown texto={b.fala} />
                {b.tela && (
                  <>
                    <h3>Tela</h3>
                    <Markdown texto={b.tela} />
                  </>
                )}
                {b.comandos && (
                  <>
                    <h3>Comandos</h3>
                    <Markdown texto={b.comandos} />
                  </>
                )}
              </section>
            ))}

            <section className="bloco" aria-labelledby="youtube">
              <h2 id="youtube">Para o YouTube</h2>
              {youtube.descricao && (
                <div className="youtube-campo">
                  <h3>Descrição</h3>
                  <pre>{youtube.descricao}</pre>
                  <Copiar texto={youtube.descricao} nome="Descrição" />
                </div>
              )}
              {youtube.capitulos && (
                <div className="youtube-campo">
                  <h3>Capítulos</h3>
                  <pre>{youtube.capitulos}</pre>
                  <Copiar texto={youtube.capitulos} nome="Capítulos" />
                </div>
              )}
              {youtube.tags && (
                <div className="youtube-campo">
                  <h3>Tags</h3>
                  <pre>{youtube.tags}</pre>
                  <Copiar texto={youtube.tags} nome="Tags" />
                </div>
              )}
              {youtube.capa && (
                <div className="youtube-campo">
                  <h3>Ideia de capa</h3>
                  <p>{youtube.capa}</p>
                </div>
              )}
            </section>
          </div>

          <aside className="lateral" aria-label="Fontes e próximos episódios">
            <h2>Fontes</h2>
            <ul className="fontes">
              {roteiro.fontes.map((f) => (
                <li key={f.url}>
                  <a href={f.url}>{f.titulo}</a>
                </li>
              ))}
            </ul>
            <h2>A seguir em {serie.nome}</h2>
            <ul className="lateral-lista">
              {outros.map((e) => (
                <li key={e.chave}>
                  {e.roteiro ? (
                    <Link to={`/v/${e.roteiro.slug}`}>
                      {e.titulo}
                      <small>{SITUACOES[e.situacao]}</small>
                    </Link>
                  ) : (
                    <span>
                      {e.titulo}
                      <small>
                        {SITUACOES[e.situacao]} · {e.repositorio}
                      </small>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </>
  );
}
