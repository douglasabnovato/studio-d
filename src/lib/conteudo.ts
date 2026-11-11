import seriesYml from '../../roteiros/series.yml?raw';
import { montarCatalogo } from './catalogo';

// Os arquivos entram no pacote como texto. O plugin `validar-roteiros` do vite.config.ts
// lê os mesmos arquivos no build e para o build se algum for inválido.
const arquivos = import.meta.glob('../../roteiros/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const catalogo = montarCatalogo(seriesYml, arquivos);
