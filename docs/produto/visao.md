# Visão do produto

> Atualizada em 11/11/2026. Dono: o autor do canal. Estado dos critérios em [`../MVP.md`](../MVP.md).

## O problema

O autor tem dezenas de repositórios com plano, critérios, decisões e PRs documentados. É material raro para ensinar, mas está espalhado. Na hora de gravar, ele precisa de um roteiro claro, com o tempo de cada parte, o que mostrar na tela, os comandos e as fontes, sem procurar em vários lugares nem ler um texto corrido para a câmera.

## Para quem

| Pessoa | O que precisa | Como o Studio D ajuda |
|---|---|---|
| **O autor, ao gravar** | Saber o que dizer, o que mostrar e quanto tempo falta | Teleprompter com bloco atual, tela e cronômetro; checklist de segurança |
| **O autor, ao planejar** | Ver o calendário de séries e o que está pronto | Fileiras por série com situação (planejado, rascunho, pronto, gravado, publicado) |
| **Quem assiste ao canal** | Conferir as fontes e o código do vídeo | Página do roteiro pública, com os links de cada afirmação |

## Hipótese e meta

> Acreditamos que roteiros em blocos, com teleprompter e checklist, farão o autor gravar **um vídeo por semana**. Saberemos quando houver **4 vídeos publicados em 30 dias** depois do primeiro.

**Métricas**
- **Principal:** vídeos publicados por semana (situação `publicado` nos roteiros).
- **De apoio:** vezes que o modo gravação é aberto (depende da medição, #4); tempo entre `rascunho` e `publicado`.
- **De qualidade:** LCP móvel até 2,5 s no site publicado; axe sem violações.

## Roadmap por marcos

| Marco | O que entrega | Issues | Situação |
|---|---|---|---|
| **M1: ferramenta pronta** | Vitrine, roteiro, modo gravação e o primeiro roteiro | PR #1 | Feito em 11/11/2026 |
| **M2: no ar** | Abertura, documentação, Pages, `main` protegida, LCP no site | Épico #15: #2, #3, #5, #14 | Em andamento |
| **M3: primeiro vídeo** | Roteiro do Movies revisado, gravado e publicado | #10 | Depende do autor |
| **M4: uma série por semana** | Um roteiro por série | #6, #7, #8 | Planejado |
| **M5: aprender com o uso** | Medição e um pacote menor | #4, #9 | Planejado |

## Princípios

1. **Toda afirmação tem fonte.** O roteiro sem fonte não passa no build.
2. **Ensinar mostrando o erro.** O que não funcionou ensina tanto quanto a correção.
3. **Segurança antes de gravar.** O checklist pede tela sem segredo e sem dado de outras pessoas.
4. **Identidade própria.** A vitrine é inspirada em streaming, mas o nome, as cores e o desenho são do Studio D ([ADR-001](../adr/001-inspiracao-sem-copia.md)).

## Fora do produto, por ora

Editar roteiro pelo site, login, comentários, gravar ou editar vídeo e tradução.
