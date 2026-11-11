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

## Ciclo de 11/11/2026, tarde: Studio D no ar (épico #15)

### Produto
- **Objetivo do autor:** abertura animada com o D, site hospedado no GitHub Pages e documentação que sirva de porta de entrada, com o trabalho guiado por issues.
- **Como medimos:** site respondendo (HTTP 200), LCP móvel no site publicado até 2,5 s, abertura sem piorar o LCP, links da documentação sem quebra.
- **Fontes:** WAI-ARIA para foco e movimento (<https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html>), documentação do Pages com Actions (<https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>) e relógio do Playwright (<https://playwright.dev/docs/clock>).

### Engenharia
- **Abertura:** SVG e CSS, fim por temporizador, uma vez por sessão, só na entrada pela tela de início (ADR-004).
- **Hospedagem:** Pages com a fonte "GitHub Actions", Variable `PAGES_ATIVO` e ambiente `github-pages` restrito à `main`. Ligado em 11/11/2026 a pedido do autor.
- **Riscos:** a abertura atrasar o LCP (medido: não atrasou); a fila do Actions atrasar o merge.

### Plano de ação (issues)
| Tarefa | Issue | Quem |
|---|---|---|
| Ligar o Pages e a Variable | #2 | Feito pelo agente, a pedido do autor; o site sobe com o merge na `main` |
| Abertura com o D | #5 | Agente, PR #13 |
| README como porta de entrada e `docs/` com índice | #14 | Agente, PR #13 |
| Proteger a `main` e alertas do Dependabot | #3 | Autor |
| Medir o LCP no site publicado | #15 | Agente, depois do merge na `main` |
