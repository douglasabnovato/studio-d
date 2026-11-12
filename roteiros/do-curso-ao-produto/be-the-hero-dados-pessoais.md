---
titulo: "Be The Hero: o banco que ficou seis anos no Git"
serie: do-curso-ao-produto
episodio: 4
repositorio: douglasabnovato/be-the-hero
duracao_alvo: 14 min
publico: Quem tem projetos de estudo no GitHub e nunca conferiu se algum arquivo de banco, `.env` ou planilha foi junto.
pre_requisitos:
  - Git básico (commit, log e .gitignore)
  - Ter visto uma API Express com banco
objetivo: Ao final, a pessoa sabe achar dados pessoais versionados, tirar o arquivo do Git do jeito certo, entender por que o histórico continua e decidir entre aceitar o risco ou reescrever o histórico.
situacao: rascunho
resumo: Um banco SQLite com contatos de ONGs ficou versionado de 2020 a 2026. Mostro como achar, o que apagar resolve, o que não resolve e quem decide o resto.
fontes:
  - titulo: "Be The Hero: README"
    url: https://github.com/douglasabnovato/be-the-hero/blob/master/Readme.md
  - titulo: "Be The Hero: docs/MVP.md (critério 9)"
    url: https://github.com/douglasabnovato/be-the-hero/blob/master/docs/MVP.md
  - titulo: "Be The Hero: docs/ANALISE.md (achados D1 e D6)"
    url: https://github.com/douglasabnovato/be-the-hero/blob/master/docs/ANALISE.md
  - titulo: "Be The Hero: backend/tests/api.test.js"
    url: https://github.com/douglasabnovato/be-the-hero/blob/master/backend/tests/api.test.js
  - titulo: "Be The Hero PR #12: retira bancos e cache do Git"
    url: https://github.com/douglasabnovato/be-the-hero/pull/12
  - titulo: "Be The Hero issue #11: retirar os bancos SQLite do versionamento"
    url: https://github.com/douglasabnovato/be-the-hero/issues/11
  - titulo: "Be The Hero issue #17: decidir o histórico com os bancos"
    url: https://github.com/douglasabnovato/be-the-hero/issues/17
  - titulo: "Be The Hero issue #29: dados de teste e de demonstração só fictícios"
    url: https://github.com/douglasabnovato/be-the-hero/issues/29
  - titulo: "Engenharia: segurança e dados pessoais (padroes.md, seção 4)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/arquitetura/padroes.md
  - titulo: "Lei 13.709/2018 (LGPD), texto no Planalto"
    url: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
  - titulo: "GitHub Docs: remover dados sensíveis de um repositório"
    url: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
  - titulo: "git-filter-repo"
    url: https://github.com/newren/git-filter-repo
  - titulo: "RFC 2606: domínios reservados para exemplo"
    url: https://www.rfc-editor.org/rfc/rfc2606
---

## Gancho · 0:00–0:40

### Fala
- Neste projeto de curso, um arquivo de banco SQLite ficou no Git de agosto de 2020 a novembro de 2026.
- Dentro dele: as ONGs cadastradas durante o estudo, com e-mail, WhatsApp e o ID que servia de senha para cada uma.
- Em 2026 o arquivo saiu do Git. Mas ele continua lá, no histórico.
- Neste vídeo: como achar isso no seu repositório, o que apagar resolve, o que não resolve, e quem decide o resto.

### Tela
`git log` do arquivo `backend/src/database/db.sqlite`, do primeiro commit (31/08/2020) ao último (02/11/2026). **Nunca abrir o arquivo do banco nem mostrar o conteúdo dele.**

### Comandos
```bash
git log --format="%h %ad %s" --date=short -- backend/src/database/db.sqlite
```

## O projeto · 0:40–1:50

### Fala
- O Be The Hero nasceu na Semana Omnistack. ONGs cadastram casos que precisam de ajuda financeira.
- Quem quer ajudar vê os casos no app e fala com a ONG por WhatsApp ou e-mail.
- São três partes: a API em Express com Knex, o painel web da ONG em React e o app em React Native com Expo.
- No portfólio ele é nível N1, Estudo. Não tem usuário real. Mesmo assim, tinha dados de contato no repositório.

### Tela
README do Be The Hero e as três pastas: `backend`, `frontend` e `mobile`.

## Dois vazamentos, não um · 1:50–3:50

### Fala
- A análise de segurança do projeto achou dois problemas ligados.
- O primeiro estava na API: a rota que listava as ONGs devolvia o ID de acesso de todas. Como o ID era a senha, qualquer pessoa entrava como qualquer ONG.
- O segundo estava no Git: o `db.sqlite` e o banco de testes eram versionados. Quem clonasse o repositório levava os contatos junto.
- Um é um erro de código, o outro é um erro de repositório. A correção de cada um é diferente.

### Tela
A tabela de achados do `docs/ANALISE.md`, nas linhas D1 e D6.

## É dado pessoal? · 3:50–5:30

### Fala
- A LGPD chama de dado pessoal a informação ligada a uma pessoa natural identificada ou identificável. Está no artigo 5º.
- O e-mail institucional de uma ONG é de uma pessoa jurídica. Já o WhatsApp de quem atende a ONG, muitas vezes, é o celular de uma pessoa.
- Num banco de estudo, não dá para saber o que é o quê. Então a decisão segura é tratar tudo como dado pessoal.
- E tem o princípio da necessidade, no artigo 6º: usar só o mínimo de dados para a finalidade. Um projeto de estudo não precisa de nenhum contato real.

### Tela
O texto da LGPD no site do Planalto, nos artigos 5º e 6º. Depois, a seção de dados pessoais do `padroes.md` do repositório engenharia.

## O que foi feito · 5:30–8:00

### Fala
- Na API: a rota que listava as ONGs saiu. O ID de acesso passou de 8 para 16 caracteres hexadecimais, com limite de tentativas. E as rotas da ONG passaram a exigir um token assinado.
- Tem teste para cada coisa. Um deles confere que a listagem de ONGs não existe mais.
- No repositório: os dois bancos saíram do Git com `git rm --cached`, que tira o arquivo do versionamento sem apagar a cópia local.
- O `.gitignore` passou a ignorar `*.sqlite`. E o banco é criado ao subir a API, pelas migrações do Knex.
- No mesmo PR, saiu também o cache do Expo, cerca de 350 arquivos que nem deveriam estar ali.

### Tela
PR #12 do Be The Hero: a lista de arquivos com `db.sqlite` e `test.sqlite` saindo. Depois, o teste "a listagem de ONGs (que expunha todos os IDs de acesso) não existe mais".

### Comandos
```bash
git rm --cached backend/src/database/db.sqlite backend/src/database/test.sqlite
echo "*.sqlite" >> .gitignore
cd backend && npm test
```

## O que apagar não resolve · 8:00–10:30

### Fala
- O próprio PR registra o limite: os arquivos continuam no histórico do Git.
- Qualquer pessoa pode voltar a um commit antigo e baixar o banco. Clones e forks feitos antes também têm a cópia.
- Há dois caminhos, e os dois estão na issue 17.
- Caminho um: aceitar o risco, com o motivo escrito. Faz sentido se os dados forem de teste ou se o estrago já não puder ser desfeito.
- Caminho dois: reescrever o histórico com o `git filter-repo`, como a documentação do GitHub ensina. Isso muda todos os commits, exige força no push e obriga quem tem clone a clonar de novo. E não apaga as cópias que já existem lá fora.
- No meu portfólio, essa decisão é do dono do repositório, não do agente que escreve o código. Reescrever histórico não se desfaz.

### Tela
Issue 17 do Be The Hero, nos critérios de entrega. Depois, a página do GitHub Docs sobre remover dados sensíveis, na seção do `git filter-repo`.

## Melhoria: dado de exemplo fictício por construção · 10:30–12:45

### Fala
- Olhando os testes de hoje, achei mais uma coisa: a ONG de exemplo dos testes usa um nome e um e-mail com cara de reais.
- Não é um vazamento. Mas é o mesmo hábito que encheu o banco em 2020.
- A issue 29 propõe a regra: e-mail sempre num domínio reservado para exemplo, como `example.org`, que a RFC 2606 garante que nunca vai ser de ninguém. E telefone que não existe.
- E uma seed do Knex com duas ONGs e quatro casos fictícios, para quem clonar ver a tela cheia sem dado de ninguém.
- Um teste confere a regra: nenhuma seed com domínio fora de `example.org` ou `example.com`.

### Tela
Issue 29 do Be The Hero. Depois, a RFC 2606 na seção dos domínios de exemplo.

### Comandos
```js
// esboço para a issue 29: backend/src/database/seeds/01_demonstracao.js
exports.seed = async (knex) => {
  await knex("incidents").del();
  await knex("ongs").del();
  await knex("ongs").insert({
    id: "0000000000000001",
    name: "ONG Exemplo",
    email: "contato@example.org",
    whatsapp: "11900000000",
    city: "Cidade Exemplo",
    uf: "SP",
  });
};
```

## Desafio · 12:45–13:30

### Fala
- Rode no seu repositório um `git log` procurando bancos, planilhas e `.env` em todo o histórico.
- Se achar algo, tire do Git com `git rm --cached`, ponha no `.gitignore` e escreva a decisão sobre o histórico.
- Se for uma senha ou chave, troque. Apagar o arquivo não invalida o segredo.

### Comandos
```bash
git log --all --format="%h %ad %s" --date=short -- "*.sqlite" "*.db" "*.csv" "*.xlsx" ".env" "*.env"
```

## Encerramento · 13:30–14:00

### Fala
- Apagar o arquivo é o começo. O histórico, a decisão escrita e o dado fictício por construção completam o trabalho.
- Com este, fecho a série "Do curso ao produto". No próximo vídeo começa "Os 12 critérios", com acessibilidade no tema escuro.

## Para o YouTube

### Descrição
Um banco SQLite com contatos de ONGs ficou versionado de 2020 a 2026 num projeto de curso. Mostro como achar dados pessoais no Git, o que o `git rm --cached` resolve, por que o histórico continua e como decidir entre aceitar o risco e reescrever o histórico, à luz da LGPD.

Repositório: https://github.com/douglasabnovato/be-the-hero

### Capítulos
0:00 Gancho
0:40 O projeto
1:50 Dois vazamentos, não um
3:50 É dado pessoal?
5:30 O que foi feito
8:00 O que apagar não resolve
10:30 Melhoria: dado de exemplo fictício por construção
12:45 Desafio
13:30 Encerramento

### Tags
lgpd, dados pessoais, git, segurança, privacidade, sqlite, express, gitignore

### Capa
Uma linha do tempo de commits de 2020 a 2026, com um arquivo de banco preso a ela e a etiqueta "ainda aqui". Texto: "Apagou do Git? Ainda está lá."
