# ADR-003: site estático, sem dados pessoais

**Data:** 11/11/2026 · **Situação:** aceita

## Contexto
O Studio D é uma ferramenta de gravação e uma vitrine pública. Não há conta, login nem formulário.

## Decisão
- Site estático no GitHub Pages, com `HashRouter` (o Pages não reescreve rotas) e `base: '/studio-d/'`.
- O único dado guardado é o tema escolhido, no `localStorage` do navegador de quem visita. O checklist de gravação não é guardado.
- Sem cookie, sem medição por enquanto. A medição de uso (critério 5) depende da conta do GoatCounter do responsável.
- A fonte Manrope vem do próprio site (`@fontsource-variable/manrope`), e não do Google Fonts, para o endereço IP de quem visita não ir a terceiros.

## Consequências
- O site não faz pedido a terceiros ao abrir. Os únicos dados são os acima, e nenhum sai do navegador.
- A publicação é ligada pelo responsável (Variable `PAGES_ATIVO` e fonte do Pages em "GitHub Actions").
