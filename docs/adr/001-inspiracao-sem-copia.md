# ADR-001: inspiração em streaming, sem copiar marca

**Data:** 11/11/2026 · **Situação:** aceita (decisão do responsável no chat, 11/11/2026)

## Contexto
O autor quer uma vitrine de roteiros com a experiência de um serviço de streaming de séries: destaque no topo, fileiras por série, card que cresce e janela de detalhes. Copiar o nome, o logo, a fonte, a cor ou a abertura de uma marca existente imitaria outra empresa e traria risco de marca.

## Decisão
- Reaproveitar só os **padrões de interface**: fundo escuro, destaque, fileiras horizontais, card com zoom, janela de detalhes com episódios.
- **Identidade própria:** nome Studio D, azul (`--azul-studio: #1e6bff`) no lugar do vermelho, fonte Manrope, capas geradas em SVG.
- A abertura animada (fase 4) usa a letra D com desenho próprio, sem reproduzir quadro a quadro nenhuma abertura existente, e sem som de terceiros.
- O rodapé diz que a interface é inspirada em serviços de streaming, com identidade própria.

## Consequências
- Nenhum logo, imagem ou som de terceiros no repositório.
- Revisões de design conferem esta ADR antes de aceitar mudanças visuais.
