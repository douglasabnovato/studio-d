export type Tema = 'dark' | 'light';
const CHAVE = 'studio-d:tema';

/** O tema do sistema (#57): claro se o sistema pede claro; escuro nos outros casos. */
export function temaDoSistema(): Tema {
  try {
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/** A escolha manual, se houver; senão, o tema do sistema (#57). */
export function temaSalvo(): Tema {
  try {
    const t = localStorage.getItem(CHAVE);
    if (t === 'dark' || t === 'light') return t;
  } catch {
    /* armazenamento bloqueado: segue o sistema */
  }
  return temaDoSistema();
}

/** Aplica o tema na página, sem gravar: quem não escolheu segue o sistema na próxima visita. */
export function aplicarTema(t: Tema) {
  document.documentElement.dataset.theme = t;
}

/** Escolha manual pelo botão do topo: aplica e grava. */
export function escolherTema(t: Tema) {
  aplicarTema(t);
  try {
    localStorage.setItem(CHAVE, t);
  } catch {
    /* armazenamento bloqueado: o tema vale só nesta visita */
  }
}
