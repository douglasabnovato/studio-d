import dados, { carregadores } from 'virtual:roteiros';
import { indexarCatalogo } from './catalogo';
import type { Roteiro } from './tipos';

// O plugin `roteiros` do vite.config.ts lê series.yml e os roteiros no build, para o build
// se algum for inválido e entrega tudo já lido, com o Markdown em HTML seguro (#9).
// O pacote inicial leva só os resumos; o resto de cada roteiro vem ao abrir (#56).
const pedidos = new Map<string, Promise<Roteiro>>();

export function carregarRoteiro(slug: string): Promise<Roteiro> {
  const resumo = dados.roteiros.find((r) => r.slug === slug);
  const carregar = carregadores[slug];
  if (!resumo || !carregar) return Promise.reject(new Error(`roteiro inexistente: ${slug}`));
  let pedido = pedidos.get(slug);
  if (!pedido) {
    pedido = carregar().then((m) => ({ ...resumo, ...m.default }));
    // Falha de rede não fica guardada: o próximo pedido tenta de novo.
    pedido.catch(() => pedidos.delete(slug));
    pedidos.set(slug, pedido);
  }
  return pedido;
}

export const catalogo = indexarCatalogo(dados.series, dados.roteiros, carregarRoteiro);
