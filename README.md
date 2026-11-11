# Studio D

Um lugar para abrir e gravar os roteiros dos vídeos feitos a partir dos meus repositórios. A vitrine lembra um serviço de streaming: um destaque no topo, uma fileira por série e uma janela de detalhes por episódio. Ao abrir um episódio, você vê o roteiro em blocos e, no modo gravação, um teleprompter.

A interface é inspirada em serviços de streaming, com identidade própria: nome, cores e capas são do Studio D ([ADR-001](docs/adr/001-inspiracao-sem-copia.md)).

## O que tem

- **Início:** o roteiro em destaque, fileiras por série, busca e episódios planejados.
- **Detalhes:** objetivo, público, pré-requisitos, fontes e a lista de episódios da série.
- **Roteiro:** blocos com tempo (Fala, Tela e Comandos), fontes e o texto para o YouTube (descrição, capítulos e tags), com botão de copiar.
- **Gravação:** checklist de segurança antes de começar e teleprompter. Espaço pausa, ↑ e ↓ mudam a velocidade, ← e → trocam o bloco, + e − mudam a letra, Esc sai.

## Rodar

Requer Node 22 ou mais novo.

```bash
npm ci
npm run dev        # http://localhost:5173/studio-d/
npm test           # Vitest
npm run build      # gera dist/
npm run preview    # serve o build em http://localhost:4173/studio-d/
npx playwright install chromium
npm run test:e2e   # Playwright com axe, temas claro e escuro, desktop e celular
```

## Escrever um roteiro

Copie [`roteiros/_modelo.md`](roteiros/_modelo.md) e siga [`docs/como-escrever-um-roteiro.md`](docs/como-escrever-um-roteiro.md). As séries ficam em [`roteiros/series.yml`](roteiros/series.yml).

## Estado e próximos passos

- **Feito (11/11/2026):** vitrine, página do roteiro, modo gravação e o primeiro roteiro, [Movies: de 3,3 s para 2,4 s no celular](roteiros/do-curso-ao-produto/movies-lcp-no-celular.md).
- **Próximos passos:** nas issues do repositório, como a abertura com o D e os roteiros das outras séries.
- **Estado dos critérios:** [`docs/MVP.md`](docs/MVP.md). Arquitetura: [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).
