import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Capa } from '../components/Capa';
import { CarregarRoteiro } from '../components/CarregarRoteiro';
import { Markdown } from '../components/Markdown';
import { PularParaConteudo } from '../components/PularParaConteudo';
import { Topo } from '../components/Topo';
import type { Catalogo } from '../lib/catalogo';
import { excessoDeFala, falaPassaDoBloco, formatarFala } from '../lib/ritmo';
import { SITUACOES, type Roteiro } from '../lib/tipos';
import { useRoteiro } from '../lib/usar-roteiro';

function Copiar({ texto, nome }: { texto: string; nome: string }) {
  const [aviso, setAviso] = useState('');
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setAviso(`Copiado: ${nome.toLowerCase()}.`);
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
  const estado = useRoteiro(catalogo, slug);

  if (estado.estado === 'inexistente') {
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

  // O cabeçalho sai do resumo, que já está no pacote inicial; o resto espera o pedaço do roteiro (#56).
  const roteiro = estado.resumo;
  const serie = catalogo.series.find((s) => s.id === roteiro.serie)!;
  const outros = (catalogo.porSerie.get(serie.id) ?? []).filter((e) => e.chave !== roteiro.slug);

  return (
    <>
      <PularParaConteudo />
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
              <li>
                {roteiro.duracaoAlvo}, cerca de {formatarFala(roteiro.falaSegundos)} de fala
              </li>
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
            {estado.estado === 'pronto' ? <Corpo roteiro={estado.roteiro} /> : <CarregarRoteiro estado={estado} />}
          </div>

          <aside className="lateral" aria-label="Fontes e próximos episódios">
            {estado.estado === 'pronto' && (
              <>
                <h2>Fontes</h2>
                <ul className="fontes">
                  {estado.roteiro.fontes.map((f) => (
                    <li key={f.url}>
                      <a href={f.url}>{f.titulo}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
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

/** Blocos e textos do YouTube: só com o roteiro completo carregado. */
function Corpo({ roteiro }: { roteiro: Roteiro }) {
  const { youtube } = roteiro;
  return (
    <>
      <h2>Roteiro em {roteiro.blocos.length} blocos</h2>
      {roteiro.blocos.map((b, i) => (
        <section className="bloco" key={b.nome} aria-labelledby={`bloco-${i}`}>
          <h2 id={`bloco-${i}`}>
            <span>
              {i + 1}. {b.nome}
            </span>
            <span className="bloco-tempo">
              {b.inicio}–{b.fim}
              {b.falaSegundos > 0 && ` · ${formatarFala(b.falaSegundos)} de fala`}
            </span>
          </h2>
          {falaPassaDoBloco(b.falaSegundos, b.inicio, b.fim) && (
            <p className="bloco-aviso">
              <span aria-hidden="true">⚠ </span>A fala estimada passa {formatarFala(excessoDeFala(b.falaSegundos, b.inicio, b.fim))} do tempo do bloco: encurte a fala ou aumente o tempo do bloco.
            </p>
          )}
          <h3>Fala</h3>
          <Markdown html={b.html?.fala} />
          {b.tela && (
            <>
              <h3>Tela</h3>
              <Markdown html={b.html?.tela} />
            </>
          )}
          {b.comandos && (
            <>
              <h3>Comandos</h3>
              <Markdown html={b.html?.comandos} />
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
    </>
  );
}
