# Studio D

Um lugar para abrir e gravar os roteiros dos vídeos feitos a partir dos meus repositórios. A vitrine lembra um serviço de streaming: um destaque no topo, uma fileira por série e uma janela de detalhes por episódio. Ao abrir um episódio, você vê o roteiro em blocos e, no modo gravação, um teleprompter.

A interface é inspirada em serviços de streaming, com identidade própria: nome, cores e capas são do Studio D ([ADR-001](docs/adr/001-inspiracao-sem-copia.md)).

## O que tem

- **Abertura:** a letra D desenhada em luz azul, em 2,4 s, uma vez por sessão; dá para pular com o botão ou com Esc, e com movimento reduzido o D aparece parado ([ADR-004](docs/adr/004-movimento-e-abertura.md)).
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

- **Feito (11/11/2026, [PR #1](https://github.com/douglasabnovato/studio-d/pull/1)):** vitrine, página do roteiro, modo gravação e o primeiro roteiro, [Movies: de 3,3 s para 2,4 s no celular](roteiros/do-curso-ao-produto/movies-lcp-no-celular.md).
- **Com o responsável:** ligar o Pages ([#2](https://github.com/douglasabnovato/studio-d/issues/2)), proteger a `main` ([#3](https://github.com/douglasabnovato/studio-d/issues/3)), medição ([#4](https://github.com/douglasabnovato/studio-d/issues/4)) e revisar e gravar o roteiro do Movies ([#10](https://github.com/douglasabnovato/studio-d/issues/10)).
- **Abertura com o D:** feita em 11/11/2026 ([#5](https://github.com/douglasabnovato/studio-d/issues/5)).
- **Próximos passos:** roteiros do Proffy ([#6](https://github.com/douglasabnovato/studio-d/issues/6)), do critério 8 ([#7](https://github.com/douglasabnovato/studio-d/issues/7)) e de engenharia com IA ([#8](https://github.com/douglasabnovato/studio-d/issues/8)), e aliviar o JavaScript ([#9](https://github.com/douglasabnovato/studio-d/issues/9)).
- **Estado dos critérios:** [`docs/MVP.md`](docs/MVP.md). Arquitetura: [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).
