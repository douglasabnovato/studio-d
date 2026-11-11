# ADR-003: site estático, sem dados pessoais

**Data:** 11/11/2026 · **Situação:** aceita

## Contexto
O Studio D é uma ferramenta de gravação e uma vitrine pública. Não há conta, login nem formulário.

## Decisão
- Site estático no GitHub Pages, com `HashRouter` (o Pages não reescreve rotas) e `base: '/studio-d/'`.
- O único dado guardado é o tema escolhido, no `localStorage` do navegador de quem visita. O checklist de gravação não é guardado.
- Sem cookie, sem medição por enquanto. A medição de uso (critério 5) depende da conta do GoatCounter do responsável.

## Consequências
- Nada de LGPD a tratar além do que está acima.
- A publicação é ligada pelo responsável (Variable `PAGES_ATIVO` e fonte do Pages em "GitHub Actions").
