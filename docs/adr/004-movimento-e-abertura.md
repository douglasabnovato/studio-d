# ADR-004: movimento reduzido e a abertura

**Data:** 11/11/2026 · **Situação:** proposta (a abertura é a fase 4)

## Decisão
- Toda transição respeita `prefers-reduced-motion: reduce` (o CSS desliga transições e animações).
- A abertura com o D terá até 2,5 s, botão "Pular", só na primeira visita da sessão, e com movimento reduzido mostra o D parado por meio segundo.
- A tela de início carrega por baixo da abertura, para a animação não atrasar o LCP; o LCP é medido antes e depois.
