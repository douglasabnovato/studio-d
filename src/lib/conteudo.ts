import dados from 'virtual:roteiros';
import { indexarCatalogo } from './catalogo';

// O plugin `roteiros` do vite.config.ts lê series.yml e os roteiros no build, para o build
// se algum for inválido e entrega tudo já lido, com o Markdown em HTML seguro (#9).
export const catalogo = indexarCatalogo(dados.series, dados.roteiros);
