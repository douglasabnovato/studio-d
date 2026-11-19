import { useCallback, useEffect, useState } from 'react';
import type { Catalogo } from './catalogo';
import type { Roteiro, RoteiroResumo } from './tipos';

export type EstadoDoRoteiro =
  | { estado: 'inexistente' }
  | { estado: 'carregando'; resumo: RoteiroResumo }
  | { estado: 'erro'; resumo: RoteiroResumo; tentarDeNovo: () => void }
  | { estado: 'pronto'; resumo: RoteiroResumo; roteiro: Roteiro };

/** Acha o resumo pelo slug e carrega o roteiro completo (#56), com carregamento e erro. */
export function useRoteiro(catalogo: Catalogo, slug: string | undefined): EstadoDoRoteiro {
  const resumo = catalogo.roteiros.find((r) => r.slug === slug);
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<{ slug: string; roteiro?: Roteiro; erro?: true } | null>(null);
  const tentarDeNovo = useCallback(() => setTentativa((t) => t + 1), []);

  useEffect(() => {
    if (!resumo) return;
    let valido = true;
    setResultado(null);
    catalogo.carregar(resumo.slug).then(
      (roteiro) => valido && setResultado({ slug: resumo.slug, roteiro }),
      () => valido && setResultado({ slug: resumo.slug, erro: true }),
    );
    return () => {
      valido = false;
    };
  }, [catalogo, resumo, tentativa]);

  if (!resumo) return { estado: 'inexistente' };
  if (resultado?.slug !== resumo.slug) return { estado: 'carregando', resumo };
  if (resultado.roteiro) return { estado: 'pronto', resumo, roteiro: resultado.roteiro };
  return { estado: 'erro', resumo, tentarDeNovo };
}
