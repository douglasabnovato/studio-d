/**
 * Com HashRouter, `href="#conteudo"` viraria a rota "conteudo". O link só move o foco.
 */
export function PularParaConteudo() {
  return (
    <a
      href="#conteudo"
      className="pular-para-conteudo"
      onClick={(ev) => {
        ev.preventDefault();
        const alvo = document.getElementById('conteudo');
        alvo?.focus();
        alvo?.scrollIntoView?.();
      }}
    >
      Pular para o conteúdo
    </a>
  );
}
