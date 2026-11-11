# Plano de ação

## Ciclo de 11/11/2026

### Produto
- **Problema e público:** o autor vai gravar vídeos ensinando a partir dos próprios repositórios e precisa de um roteiro claro na hora de gravar. O público final é quem assiste: pessoas que fizeram cursos e querem levar projetos a produto.
- **Hipótese:** acreditamos que roteiros em blocos, com teleprompter e checklist, farão o autor gravar um vídeo por semana; saberemos quando houver 4 vídeos publicados em 30 dias depois do primeiro.
- **Pesquisa (fontes):** padrões de interface de serviços de streaming (destaque, fileiras, janela de detalhes), usados só como referência de uso (ADR-001); guias de acessibilidade do WAI-ARIA para janela modal (<https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>) e de carrossel (<https://www.w3.org/WAI/ARIA/apg/patterns/carousel/>); LCP no web.dev (<https://web.dev/articles/lcp>), fonte do primeiro roteiro.
- **Backlog (impacto × esforço):** 1. vitrine, roteiro e gravação (alto × médio, feito); 2. primeiro roteiro, movies (alto × médio, feito); 3. abertura com o D (médio × médio, issue); 4. roteiros das outras séries (alto × médio, issues); 5. ler os roteiros no build para aliviar o pacote (médio × baixo, issue).
- **Fora do escopo:** editar roteiro pelo site, login, comentários.

### Engenharia
- **Arquitetura:** site estático React + Vite, conteúdo em Markdown lido no build, publicação no Pages pelo Actions (`docs/ARQUITETURA.md`).
- **Riscos:** pacote pesado por `yaml` e `marked`; roteiro com dado sensível (mitigado pelo checklist e pela revisão por PR); a principal sem ruleset (responsável).
- **Qualidade:** Vitest (leitura, catálogo, contraste dos tokens, páginas), Playwright com axe nos temas claro e escuro, em desktop e celular, e teste de teclado.
- **Definição de pronto:** CI verde no PR, `MVP.md` com evidência, ADRs escritas, 5 issues de próximos passos.

### Plano de ação
- Este ciclo: esqueleto, vitrine, página do roteiro, modo gravação, roteiro do movies, CI, documentação.
- Vira issue: ligar o Pages e proteger a `main` (responsável), medição de uso (responsável), abertura com o D, roteiros das outras séries, leitura no build.
