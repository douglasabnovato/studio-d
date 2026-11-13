import { memo } from 'react';

/**
 * Mostra o HTML de um trecho do roteiro. O HTML vem do build, já escapado por
 * src/lib/markdown.ts (ADR-002, #9). Memorizado: o teleprompter renderiza a cada quadro.
 */
export const Markdown = memo(function Markdown({ html, className }: { html?: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html ?? '' }} />;
});
