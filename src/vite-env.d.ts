/// <reference types="vite/client" />
declare module 'virtual:roteiros' {
  const dados: { series: import('./lib/catalogo').Serie[]; roteiros: import('./lib/tipos').RoteiroResumo[] };
  export default dados;
  /** Um `import()` por roteiro: fontes, blocos e YouTube, carregados ao abrir (#56). */
  export const carregadores: Record<string, () => Promise<{ default: import('./lib/tipos').ConteudoDoRoteiro }>>;
}
