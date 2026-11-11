import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { Catalogo } from './lib/catalogo';
import { Gravacao } from './pages/Gravacao';
import { Inicio } from './pages/Inicio';
import { RoteiroPagina } from './pages/RoteiroPagina';

/** HashRouter: o GitHub Pages não reescreve rotas, então /#/v/slug funciona em qualquer endereço. */
export function App({ catalogo }: { catalogo: Catalogo }) {
  return (
    <HashRouter>
      <Rotas catalogo={catalogo} />
    </HashRouter>
  );
}

/** Cada página nova começa do topo, como num site de várias páginas. */
function VoltarAoTopo() {
  const { pathname } = useLocation();
  // Sem retorno: no Chrome novo, scrollTo devolve uma Promise, e o React a trataria como limpeza.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Rotas({ catalogo }: { catalogo: Catalogo }) {
  return (
    <>
    <VoltarAoTopo />
    <Routes>
      <Route path="/" element={<Inicio catalogo={catalogo} />} />
      <Route path="/v/:slug" element={<RoteiroPagina catalogo={catalogo} />} />
      <Route path="/v/:slug/gravar" element={<Gravacao catalogo={catalogo} />} />
      <Route path="*" element={<Inicio catalogo={catalogo} />} />
    </Routes>
    </>
  );
}
