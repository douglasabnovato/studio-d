import { useEffect, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Abertura, deveMostrarAbertura } from './components/Abertura';
import type { Catalogo } from './lib/catalogo';
import { Gravacao } from './pages/Gravacao';
import { Inicio } from './pages/Inicio';
import { RoteiroPagina } from './pages/RoteiroPagina';

/** HashRouter: o GitHub Pages não reescreve rotas, então /#/v/slug funciona em qualquer endereço. */
export function App({ catalogo }: { catalogo: Catalogo }) {
  // A abertura só aparece para quem entra pela tela de início, uma vez por sessão.
  // Quem abre direto um roteiro ou o modo gravação vai direto ao que pediu.
  const [abertura, setAbertura] = useState(() => entrouPeloInicio() && deveMostrarAbertura());
  return (
    <HashRouter>
      {abertura && <Abertura onFim={() => setAbertura(false)} />}
      <Rotas catalogo={catalogo} />
    </HashRouter>
  );
}

export function entrouPeloInicio(hash = window.location.hash): boolean {
  return hash === '' || hash === '#' || hash === '#/';
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
