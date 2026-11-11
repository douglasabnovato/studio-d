export type Tema = 'dark' | 'light';
const CHAVE = 'studio-d:tema';

export function temaSalvo(): Tema {
  try {
    const t = localStorage.getItem(CHAVE);
    if (t === 'dark' || t === 'light') return t;
  } catch {
    /* armazenamento bloqueado: segue o padrão */
  }
  return 'dark';
}

export function aplicarTema(t: Tema) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(CHAVE, t);
  } catch {
    /* armazenamento bloqueado: o tema vale só nesta visita */
  }
}
