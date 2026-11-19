import type { EstadoDoRoteiro } from '../lib/usar-roteiro';

/** O que aparece enquanto o roteiro carrega ou quando o pedaço não chega (#56). */
export function CarregarRoteiro({ estado }: { estado: Extract<EstadoDoRoteiro, { estado: 'carregando' | 'erro' }> }) {
  if (estado.estado === 'carregando') {
    return (
      // aria-live sem role="status": o checklist já tem a própria região de status.
      <p className="rotulo" aria-live="polite">
        Carregando o roteiro…
      </p>
    );
  }
  return (
    <div role="alert">
      <p>Não deu para carregar o roteiro. Confira a conexão e tente de novo.</p>
      <button type="button" className="botao botao-secundario" onClick={estado.tentarDeNovo}>
        Tentar de novo
      </button>{' '}
      {/* Alguns navegadores guardam a falha de um import() para o mesmo endereço: recarregar resolve. */}
      <button type="button" className="botao botao-secundario" onClick={() => window.location.reload()}>
        Recarregar a página
      </button>
    </div>
  );
}
