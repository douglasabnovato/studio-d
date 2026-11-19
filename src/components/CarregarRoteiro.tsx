import type { EstadoDoRoteiro } from '../lib/usar-roteiro';

/** O que aparece enquanto o roteiro carrega ou quando o pedaço não chega (#56). */
export function CarregarRoteiro({ estado }: { estado: Extract<EstadoDoRoteiro, { estado: 'carregando' | 'erro' }> }) {
  if (estado.estado === 'carregando') {
    return (
      <p className="rotulo" role="status">
        Carregando o roteiro…
      </p>
    );
  }
  return (
    <div role="alert">
      <p>Não deu para carregar o roteiro. Confira a conexão e tente de novo.</p>
      <button type="button" className="botao botao-secundario" onClick={estado.tentarDeNovo}>
        Tentar de novo
      </button>
    </div>
  );
}
