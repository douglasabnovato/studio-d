import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { catalogo } from './lib/conteudo';
import { aplicarTema, temaSalvo } from './lib/tema';
import '@fontsource-variable/manrope';
import './styles.css';

aplicarTema(temaSalvo());
createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <App catalogo={catalogo} />
  </StrictMode>,
);
