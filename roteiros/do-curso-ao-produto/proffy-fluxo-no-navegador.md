---
titulo: "Proffy: 11 testes verdes e a tela ainda quebrada"
serie: do-curso-ao-produto
episodio: 2
repositorio: douglasabnovato/proffy
duracao_alvo: 14 min
publico: Quem tem um projeto Node de curso com testes de API e quer saber se o fluxo funciona de verdade para quem usa.
pre_requisitos:
  - Node e Express básico (rotas e formulário)
  - Já ter rodado um teste automatizado, como `node --test` ou Jest
objetivo: Ao final, a pessoa sabe o que um teste de API cobre, o que ele não vê, e como percorrer o fluxo principal no navegador com Playwright e axe.
situacao: rascunho
resumo: Os testes de API do Proffy passavam todos. Bastou percorrer o fluxo no navegador para achar um formulário fora do fundo e ilegível.
fontes:
  - titulo: "Proffy: README"
    url: https://github.com/douglasabnovato/proffy/blob/master/Readme.md
  - titulo: "Proffy: docs/MVP.md (ciclo de 07/11/2026)"
    url: https://github.com/douglasabnovato/proffy/blob/developer/sprint-2026-11-12/docs/MVP.md
  - titulo: "Proffy: docs/PLANO-DE-ACAO.md (seção Ciclo de 07/11/2026)"
    url: https://github.com/douglasabnovato/proffy/blob/developer/sprint-2026-11-12/docs/PLANO-DE-ACAO.md
  - titulo: "Proffy: tests/app.test.js"
    url: https://github.com/douglasabnovato/proffy/blob/developer/sprint-2026-11-12/tests/app.test.js
  - titulo: "Proffy PR #35: busca só pela matéria e fluxo na tela"
    url: https://github.com/douglasabnovato/proffy/pull/35
  - titulo: "Proffy PR #25: CI na sprint e testes da página de erro"
    url: https://github.com/douglasabnovato/proffy/pull/25
  - titulo: "Proffy commit 8c48062: título da busca em uma linha"
    url: https://github.com/douglasabnovato/proffy/commit/8c48062f3448d2562f75dc0d8a5a3620478e3cc1
  - titulo: "Proffy issue #33: rodar no CI o fluxo na tela com Playwright e axe"
    url: https://github.com/douglasabnovato/proffy/issues/33
  - titulo: "Engenharia: régua dos 12 critérios (critério 3)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/arquitetura/padroes.md
  - titulo: "Engenharia: aprendizados (Origin null com helmet)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/ia/aprendizados.md
  - titulo: "Playwright: servidor web nos testes (webServer)"
    url: https://playwright.dev/docs/test-webserver
  - titulo: "Playwright: testes de acessibilidade com axe"
    url: https://playwright.dev/docs/accessibility-testing
  - titulo: "MDN: cabeçalho Origin"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Origin
  - titulo: "MDN: cabeçalho Referrer-Policy"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy
  - titulo: "supertest: README"
    url: https://github.com/ladjs/supertest
---

## Gancho · 0:00–0:40

### Fala
- O Proffy tinha 11 testes automatizados, todos verdes, cobrindo cadastro, busca, contato e páginas de erro.
- Mesmo assim, na tela de busca, o formulário saía do fundo roxo e os rótulos ficavam ilegíveis.
- Nenhum daqueles testes podia ver isso, porque nenhum deles abria um navegador.
- Neste vídeo: o que um teste de API cobre, o que ele não vê, e como percorrer o fluxo no navegador com Playwright e axe.

### Tela
Terminal com `npm test` passando: `# pass 11`. Corte para a tela de busca com o título quebrado uma palavra por linha.

## O projeto · 0:40–2:00

### Fala
- O Proffy nasceu num curso. Ele conecta quem estuda a quem dá aula particular, por matéria, dia e horário.
- O professor publica matéria, preço e horários. O aluno filtra e chama no WhatsApp.
- A pilha é simples: Node com Express, páginas montadas no servidor com Nunjucks e banco SQLite.
- No meu portfólio ele é nível N1, Estudo. A meta de um N1 não é ter usuário: é o fluxo rodar na tela e nos testes.

### Tela
README do Proffy: a frase do problema e a seção "Stack". Depois, o `docs/MVP.md` com a linha "Nível: Estudo (N1)".

## Os testes que passavam · 2:00–3:45

### Fala
- Os testes usam o `node --test`, que já vem no Node, e o supertest, que chama as rotas do Express direto no teste, sem subir o servidor à parte.
- Eles pegaram coisas importantes. Um exemplo: um bug antigo transformava "08:30" em 48030 minutos, por concatenar texto em vez de somar. Hoje há um teste que exige 510.
- Outro: a busca respeita o intervalo com o fim aberto. Quem dá aula das 8:30 às 12:00 aparece às 11:59 e não aparece às 12:00.
- E ainda: dados inválidos dão 422 com mensagens, injeção de SQL no filtro não vaza nada, e rota inexistente dá 404.
- Com tudo isso verde, o critério 11 da régua, testes dos fluxos críticos, atendia. O critério 3, fluxo principal completo, continuava Parcial.

### Tela
`tests/app.test.js` aberto nos testes de `toMinutes` e de intervalo `[início, fim)`.

### Comandos
```bash
npm ci
npm test   # o node --test termina com "# pass 11"
# no Windows com Node 24, o better-sqlite3 11 não compila; o registro do MVP usou:
# npm ci --ignore-scripts && npm i --no-save better-sqlite3@12
```

## O que um teste de API não vê · 3:45–5:15

### Fala
- O supertest manda um pedido HTTP e lê a resposta. Ele não carrega CSS, não desenha a página e não clica em nada.
- Então ele não vê um layout quebrado, um contraste ruim nem um botão fora da tela.
- Ele também não manda os cabeçalhos que um navegador manda. Na régua que uso, o critério 3 diz que teste só de API não basta.
- Um caso real do mesmo ciclo, em projetos vizinhos do portfólio: com o helmet, a política de referência fica `no-referrer`, e o Chrome passa a mandar `Origin: null` no POST do formulário.
- Uma checagem de "mesma origem" no servidor recusava todo cadastro de verdade. Os testes de API passavam, porque não mandam `Origin`.
- O Proffy não tem essa checagem, mas a lição ficou registrada: rodar ao menos um POST pelo navegador antes de marcar o critério 3.

### Tela
Linha do critério 3 em `padroes.md` do repositório engenharia. Depois, a página da MDN sobre o cabeçalho `Origin`.

## O fluxo na tela, passo a passo · 5:15–8:30

### Fala
- Em 09/11, o fluxo foi percorrido no Chromium com o Playwright, nos modos claro e escuro, contra o servidor local com um banco novo.
- Passo 1: a inicial mostra "0 professores cadastrados".
- Passo 2: salvar o cadastro vazio mostra 7 mensagens de erro, uma em cada campo.
- Passo 3: cadastro completo de uma professora fictícia, com dois horários. A tela diz "Cadastro concluído!".
- Passo 4: na busca, só a matéria. O cartão aparece com os dois horários e o preço.
- Passos 5 e 6: quarta às 15:00 acha; quarta às 18:00 não acha, porque o fim do intervalo é exclusivo.
- Passo 7: "Entrar em contato" abre o WhatsApp com o texto da aula.
- Passo 8: de volta à inicial, "Total de 1 conexão realizada".
- O axe rodou nas telas de início, cadastro, sucesso e busca, procurando problemas de acessibilidade. E no fim, Tab na busca e largura de 375 pixels: foco visível e sem rolagem horizontal.

### Tela
A tabela "Fluxo percorrido na tela" do `docs/PLANO-DE-ACAO.md`. Em paralelo, a gravação do navegador fazendo cada passo.

### Comandos
```bash
# servidor com um banco novo (o caminho é exemplo; o registro de 09/11 diz só "banco novo")
PORT=5578 DATABASE_FILE=tmp/fluxo.sqlite npm start
```

## O que a tela pegou · 8:30–10:00

### Fala
- Na primeira passada, o axe acusou contraste nos rótulos da busca.
- A causa não estava na busca: o `main.css` fixava todo `h1` em 105 pixels de largura. O título "Estes são os proffys disponíveis" quebrava uma palavra por linha.
- Com o título alto e a dica nova dos filtros, os rótulos do formulário saíam do fundo roxo e perdiam contraste.
- A correção foi pequena: `width: auto` só para esse título, numa regra da tela de busca. Segunda passada sem violações.
- Nenhum dos 11 testes poderia ter pegado isso. Só o navegador desenha a página.

### Tela
Antes e depois da tela de busca. Depois, o commit `8c48062` no GitHub, com a regra nova em `page-study.css`.

## Melhoria: levar o fluxo ao CI · 10:00–12:30

### Fala
- Hoje o fluxo na tela roda na minha máquina, e o registro está no plano. Isso é melhor que nada, mas não protege o próximo PR.
- A issue 33 do Proffy pede o passo seguinte: rodar esse fluxo no CI, com o axe, a cada PR.
- O Playwright tem a opção `webServer`: ele sobe o `npm start` antes dos testes e espera a porta responder.
- O banco precisa ser novo a cada execução. O caminho do SQLite vai por variável de ambiente, com um nome diferente a cada execução.
- O botão de contato chama a rota `/contact/:id`, que conta a conexão e redireciona para o WhatsApp. No teste, o certo é conferir o cabeçalho `Location` da resposta, sem sair para a internet.
- Um detalhe honesto: o `MVP.md` do Proffy marca o critério 3 como Atende, com a evidência local de 09/11. Pela régua, que pede o teste no navegador passando no CI, ele é Parcial até a issue 33 entrar.

### Tela
Issue 33 do Proffy aberta. Depois, a página do `webServer` na documentação do Playwright.

### Comandos
```ts
// playwright.config.ts (esboço para a issue 33; o Playwright ainda não está no projeto)
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm start',
    url: 'http://localhost:5578',
    // nome novo a cada execução: o banco sempre começa vazio
    env: { PORT: '5578', DATABASE_FILE: `tmp/e2e-${Date.now()}.sqlite` },
  },
});
```

## Desafio · 12:30–13:30

### Fala
- Pegue um projeto seu que tenha só testes de API.
- Escreva um teste de navegador para o fluxo principal: abrir, preencher, enviar e ver o resultado.
- Rode o axe em cada tela, no claro e no escuro.
- Se ele achar algo que os seus testes de API não acharam, me conta nos comentários.

## Encerramento · 13:30–14:00

### Fala
- Teste de API diz que a regra está certa. Teste no navegador diz que a pessoa consegue usar.
- No próximo episódio da série: o AirCnC, com tempo real e token na conexão.

## Para o YouTube

### Descrição
Os 11 testes de API do Proffy passavam, mas a tela de busca estava quebrada. Mostro o que um teste de API cobre, o que ele não vê, e como percorrer o fluxo no navegador com Playwright e axe.

Repositório: https://github.com/douglasabnovato/proffy

### Capítulos
0:00 Gancho
0:40 O projeto
2:00 Os testes que passavam
3:45 O que um teste de API não vê
5:15 O fluxo na tela, passo a passo
8:30 O que a tela pegou
10:00 Melhoria: levar o fluxo ao CI
12:30 Desafio
13:30 Encerramento

### Tags
testes, playwright, axe, acessibilidade, node, express, supertest, ponta a ponta

### Capa
À esquerda, um terminal com "# pass 11" em verde. À direita, a tela de busca com o título quebrado em várias linhas e um alerta em vermelho. Texto: "Verde no teste. Quebrado na tela."
