/// <reference types="vite/client" />
declare module 'virtual:roteiros' {
  const dados: { series: import('./lib/catalogo').Serie[]; roteiros: import('./lib/tipos').Roteiro[] };
  export default dados;
}
