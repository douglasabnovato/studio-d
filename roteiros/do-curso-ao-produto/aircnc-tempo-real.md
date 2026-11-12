---
titulo: "AirCnC: quem está do outro lado do tempo real?"
serie: do-curso-ao-produto
episodio: 3
repositorio: douglasabnovato/aircnc
duracao_alvo: 14 min
publico: Quem já usou Socket.IO num projeto de curso e quer saber se a conexão sabe, de verdade, quem é o usuário.
pre_requisitos:
  - Node e Express básico
  - Já ter visto Socket.IO emitir um evento do servidor para o navegador
objetivo: Ao final, a pessoa sabe autenticar uma conexão Socket.IO com token no handshake, mandar cada evento só para a sala do dono e provar isso com teste.
situacao: rascunho
resumo: No curso, o tempo real acreditava no id que o navegador dizia ter. Mostro como passou a exigir um token assinado, com teste e publicação no Render.
fontes:
  - titulo: "AirCnC: README"
    url: https://github.com/douglasabnovato/aircnc/blob/master/Readme.md
  - titulo: "AirCnC: docs/MVP.md"
    url: https://github.com/douglasabnovato/aircnc/blob/master/docs/MVP.md
  - titulo: "AirCnC: docs/ANALISE.md (achados de segurança)"
    url: https://github.com/douglasabnovato/aircnc/blob/master/docs/ANALISE.md
  - titulo: "AirCnC: docs/DEPLOY.md (um usuário de banco por app)"
    url: https://github.com/douglasabnovato/aircnc/blob/master/docs/DEPLOY.md
  - titulo: "AirCnC: backend/src/realtime.js"
    url: https://github.com/douglasabnovato/aircnc/blob/master/backend/src/realtime.js
  - titulo: "AirCnC: backend/tests/api.test.js (teste do tempo real)"
    url: https://github.com/douglasabnovato/aircnc/blob/master/backend/tests/api.test.js
  - titulo: "AirCnC: render.yaml"
    url: https://github.com/douglasabnovato/aircnc/blob/master/render.yaml
  - titulo: "AirCnC commit 60e11d3: versão nova da API"
    url: https://github.com/douglasabnovato/aircnc/commit/60e11d3b3d5bd0bc6fc551db2bb8e6264d22274c
  - titulo: "AirCnC PR #99: fluxo na tela e aprovação em dobro"
    url: https://github.com/douglasabnovato/aircnc/pull/99
  - titulo: "AirCnC PR #103: endereço real da API no Render"
    url: https://github.com/douglasabnovato/aircnc/pull/103
  - titulo: "AirCnC issue #93: desconectar o tempo real quando o token expirar"
    url: https://github.com/douglasabnovato/aircnc/issues/93
  - titulo: "Socket.IO: middlewares (io.use)"
    url: https://socket.io/docs/v4/middlewares/
  - titulo: "Socket.IO: rooms"
    url: https://socket.io/docs/v4/rooms/
  - titulo: "Socket.IO: opção auth do cliente"
    url: https://socket.io/docs/v4/client-options/#auth
  - titulo: "MongoDB Atlas: usuários e papéis do banco"
    url: https://www.mongodb.com/docs/atlas/security-add-mongodb-users/
---

## Gancho · 0:00–0:40

### Fala
- No AirCnC, a empresa recebe na hora o pedido de reserva de um dev. É tempo real com Socket.IO.
- Na versão do curso, o servidor perguntava ao navegador "quem é você?" e acreditava na resposta.
- Neste vídeo eu mostro por que isso é um problema, como a conexão passou a exigir um token assinado, e o teste que prova que cada um só recebe os próprios eventos.

### Tela
O painel da empresa recebendo um pedido de reserva sem recarregar a página.

## O projeto · 0:40–2:00

### Fala
- O AirCnC liga empresas que oferecem espaços, os spots, a devs que querem trabalhar ou conhecer a empresa por um período.
- São três partes com o mesmo contrato: a API em Node com Express e MongoDB, o painel web da empresa em React e o app do dev em React Native com Expo.
- O dev pede a reserva no app. A empresa recebe o pedido no painel, na hora, e aprova ou recusa.
- No meu portfólio ele é nível N1, Estudo: a meta é o fluxo rodar na tela e nos testes.

### Tela
README do AirCnC na seção "Projeto". Depois, as três pastas do repositório: `backend`, `frontend` e `mobile`.

## Como era no curso · 2:00–4:00

### Fala
- Este é o servidor antes da versão nova, no commit `60e11d3`.
- Na conexão, o servidor lia o `user_id` da URL do socket e guardava num objeto: este id está neste socket.
- Para avisar a empresa, a rota procurava o socket pelo id do dono do spot e emitia o evento.
- O problema: o `user_id` vinha do navegador. Pela leitura do código, quem abrisse a conexão com o id de outra empresa passava a ocupar o lugar dela no objeto e a receber os pedidos dela.
- A análise de segurança do projeto registrou dois achados parecidos: o `user_id` no cabeçalho deixava agir como qualquer um, e a senha do banco estava escrita no código.
- Um aviso importante: na tela, a linha da conexão com o banco aparece borrada. Uma senha que foi para o Git continua no histórico, mesmo depois de apagada. O certo é apagar o usuário no Atlas, e isso está no `DEPLOY.md`.

### Tela
O `server.js` antigo no commit `60e11d3`, só com o trecho do `connectedUsers` e do `socket.handshake.query`. A linha do `mongoose.connect` fica **borrada na edição**. Depois, a tabela de achados do `docs/ANALISE.md`.

## A versão nova: token no handshake · 4:00–7:00

### Fala
- Primeiro, o login. Agora ele pede e-mail e senha, a senha é guardada com scrypt, e a API devolve um token JWT assinado com um segredo do servidor.
- O cliente manda esse token no `auth` do handshake, o primeiro passo da conexão. Não vai na URL.
- No servidor, um middleware do Socket.IO, o `io.use`, confere o token antes de aceitar a conexão. Token inválido ou ausente: a conexão é recusada com "unauthorized".
- O id do usuário sai do token, não do navegador. E o socket entra numa sala com o nome `user:` mais esse id.
- Para avisar alguém, a API emite para a sala da pessoa. Se ela tiver duas abas abertas, as duas recebem. Ninguém mais recebe.
- O arquivo inteiro tem 21 linhas. Dá para ler junto na tela.

### Tela
`backend/src/realtime.js` inteiro, destacando `io.use`, `jwt.verify`, `socket.join` e `io.to(...).emit`. Depois, a linha do Dashboard no `frontend` com `io(API_URL, { auth: { token } })`.

### Comandos
```js
// frontend: o token vai no handshake, não na URL
const socket = io(API_URL, { auth: { token: getSession()?.token } });
```

## O teste que prova · 7:00–9:00

### Fala
- Segurança sem teste é promessa. O teste do tempo real sobe um servidor de verdade numa porta livre.
- Primeiro, um cliente sem token tenta conectar. O teste espera o erro "unauthorized".
- Depois, um cliente com token conecta. O servidor emite um evento para outro usuário e outro para o dono do token.
- O teste confere que chegou só o evento do dono.
- E existe o teste de ponta a ponta no navegador, com Playwright, rodando no CI: a empresa cadastra o spot, recebe o pedido em tempo real e aprova.

### Tela
O bloco "tempo real" de `backend/tests/api.test.js`. Depois, o job `e2e` verde no GitHub Actions.

### Comandos
```bash
cd backend
npm ci
npm test
# API sem MongoDB, com dados em memória, para ver o fluxo na tela
npm run demo
```

## Publicação: um usuário de banco por app · 9:00–10:45

### Fala
- A API e o painel estão no plano gratuito do Render, descritos num arquivo só, o `render.yaml`.
- O segredo do token é gerado pelo próprio Render. A URI do banco é preenchida à mão no painel e nunca vai para o Git.
- No MongoDB Atlas, cada app tem o seu usuário, com permissão de leitura e escrita só no banco dele. Se uma senha vazar, só um app é afetado.
- Uma pegadinha: o nome `aircnc-api.onrender.com` já era de outra conta. O Render deu à API um sufixo, e o endereço real precisou entrar no `render.yaml` e no CORS.
- No plano gratuito, a API dorme depois de 15 minutos sem acesso, e as imagens enviadas somem quando ela reinicia. Isso está escrito no README.

### Tela
`render.yaml` com `AUTH_SECRET: generateValue` e `MONGODB_URI: sync: false`. Depois, a tabela "um usuário e um banco por app" do `DEPLOY.md`. Nunca mostrar o painel do Atlas com senhas.

## Melhoria: o token vence, a conexão não · 10:45–12:45

### Fala
- Ainda tem um buraco, e ele está registrado na issue 93.
- O token vale sete dias. Mas o servidor só confere o token na hora de conectar.
- Uma conexão que fica aberta continua recebendo eventos mesmo depois que o token venceu.
- O caminho: guardar a data de validade do token no socket e desconectar quando ela passar. No painel, quem for desconectado por isso volta para o login.
- E o teste: um token com validade curta, e a conferência de que a conexão cai.

### Tela
Issue 93 do AirCnC. Depois, a página de middlewares da documentação do Socket.IO.

### Comandos
```js
// esboço para a issue 93: desconectar quando o token vencer
io.use((socket, next) => {
  const { sub, exp } = jwt.verify(token, config.authSecret);
  socket.data.userId = sub;
  setTimeout(() => socket.disconnect(true), exp * 1000 - Date.now());
  next();
});
```

## Desafio · 12:45–13:30

### Fala
- Abra um projeto seu com Socket.IO e procure de onde vem a identidade do usuário na conexão.
- Se vier da URL ou de um campo que o navegador escolhe, troque por um token conferido no `io.use`.
- Escreva o teste com dois clientes: um sem token, que deve ser recusado, e um com token, que só recebe o que é dele.

## Encerramento · 13:30–14:00

### Fala
- Tempo real é uma conexão aberta. Ela precisa saber quem está do outro lado, e por quanto tempo.
- No próximo episódio da série: o Be The Hero, e o que fazer quando um projeto de estudo tem dados pessoais de verdade no Git.

## Para o YouTube

### Descrição
No curso, o tempo real do AirCnC acreditava no id que o navegador dizia ter. Mostro como a conexão Socket.IO passou a exigir um token no handshake, com salas por usuário, teste automatizado e publicação no Render com um usuário de banco por app.

Repositório: https://github.com/douglasabnovato/aircnc

### Capítulos
0:00 Gancho
0:40 O projeto
2:00 Como era no curso
4:00 A versão nova: token no handshake
7:00 O teste que prova
9:00 Publicação: um usuário de banco por app
10:45 Melhoria: o token vence, a conexão não
12:45 Desafio
13:30 Encerramento

### Tags
socket.io, tempo real, jwt, autenticação, node, express, mongodb, render, segurança

### Capa
Duas abas de navegador lado a lado. Na da esquerda, um cadeado aberto com "user_id=?". Na da direita, um cadeado fechado com "token". Texto: "Quem está do outro lado?"
