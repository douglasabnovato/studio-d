---
titulo: "Hipótese com meta: como escrever e como medir"
serie: pm-na-pratica
episodio: 1
repositorio: douglasabnovato/movies
duracao_alvo: 12 min
publico: Quem faz produto sozinho ou em time pequeno e já escreveu "acho que as pessoas vão gostar" sem saber como conferir.
pre_requisitos:
  - Saber o que é uma rota numa aplicação web
  - Nenhuma experiência com ferramentas de análise
objetivo: Ao final, a pessoa escreve uma hipótese com meta e com o sinal que diz se ela deu certo, e sabe ligar uma medição sem cookie que conte esse sinal.
situacao: rascunho
resumo: "O Movies tem uma aposta escrita, uma meta e o código que mede. Só não tem nenhum dado ainda, e o vídeo mostra por quê."
fontes:
  - titulo: "Movies: docs/MVP.md (sprint de 12/11, seção 5 e critérios 2 e 5)"
    url: https://github.com/douglasabnovato/movies/blob/developer/sprint-2026-11-12/docs/MVP.md
  - titulo: "Movies: docs/ANALISE.md (métrica norte)"
    url: https://github.com/douglasabnovato/movies/blob/main/docs/ANALISE.md
  - titulo: "Movies: src/utils/medicao.js (sprint de 12/11)"
    url: https://github.com/douglasabnovato/movies/blob/developer/sprint-2026-11-12/src/utils/medicao.js
  - titulo: "Movies PR #94: GoatCounter e evento abriu-filme"
    url: https://github.com/douglasabnovato/movies/pull/94
  - titulo: "Movies PR #91: sprint de 12/11 para a main"
    url: https://github.com/douglasabnovato/movies/pull/91
  - titulo: "Movies issue #58: medir a chegada ao detalhe do filme"
    url: https://github.com/douglasabnovato/movies/issues/58
  - titulo: "Movies issue #59: validar com uma pessoa de fora"
    url: https://github.com/douglasabnovato/movies/issues/59
  - titulo: "Movies issue #97: pronto para o vídeo 12"
    url: https://github.com/douglasabnovato/movies/issues/97
  - titulo: "Engenharia: decisão de 10/11/2026 (D1 e D5)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/decisoes/2026-11-10-ciclo-faixa-90.md
  - titulo: "Engenharia: régua dos 12 critérios (critérios 2 e 5)"
    url: https://github.com/douglasabnovato/engenharia/blob/developer/sprint-2026-11-12/arquitetura/padroes.md
  - titulo: "Jeff Gothelf: como quebrar hipóteses para testar (modelo de hipótese)"
    url: https://jeffgothelf.com/blog/how-i-break-down-hypotheses-to-make-them-easier-to-test/
  - titulo: "GoatCounter: eventos"
    url: https://www.goatcounter.com/help/events
  - titulo: "GoatCounter: sessões e visitantes"
    url: https://www.goatcounter.com/help/sessions
  - titulo: "GoatCounter: avisos de consentimento (GDPR)"
    url: https://www.goatcounter.com/help/gdpr
---

## Gancho · 0:00–0:40

### Fala
- No Movies, meu catálogo de filmes, está escrito: ao menos 50% das sessões devem abrir um filme.
- O código que mede isso já existe, com teste. E o número de hoje é: nenhum. Não tem um dado sequer.
- Neste vídeo: como escrever uma hipótese com meta, como medir sem cookie, e o que falta para o número aparecer.

### Tela
A seção 5 do `MVP.md` do Movies, com a linha "Ao menos 50% das sessões". Corte para um painel em branco.

## A hipótese do Movies · 0:40–2:30

### Fala
- A hipótese do Movies é: quem chega ao site quer descobrir um filme, e buscar ou filtrar por gênero basta para encontrar um que valha abrir.
- A métrica é a chegada ao detalhe: sessões que abrem ao menos um filme, divididas pelas sessões totais.
- Ela tem duas metas. Num teste com 5 pessoas, sem ajuda, ao menos 4 encontram um filme e abrem a ficha em até 2 minutos. No uso real, ao menos 50% das sessões, com no mínimo 100 sessões.
- E cada meta tem o que fazer se não for atingida: rever a busca e o filtro antes de qualquer função nova, ou olhar onde as pessoas param.
- O próprio documento admite: as metas são um ponto de partida, escolhido por julgamento, sem dado anterior.

### Tela
A seção 5 do `docs/MVP.md`, na tabela das duas metas. Depois, a linha da métrica norte no `docs/ANALISE.md`.

## Como escrever uma hipótese · 2:30–4:15

### Fala
- O Jeff Gothelf, um dos autores do Lean UX, usa um modelo de quatro partes: acreditamos que este resultado será alcançado se estas pessoas tiverem este benefício com esta funcionalidade.
- A régua dos meus projetos encurta esse modelo e acrescenta uma parte: acreditamos que X fará Y; saberemos quando Z.
- Esse "saberemos quando" é o que separa uma hipótese de um desejo. Ele diz qual número olhar e qual valor conta como acerto.
- Reescrita nesse formato, a do Movies fica assim: acreditamos que quem quer escolher um filme encontra um que vale abrir usando a busca e o filtro por gênero. Saberemos quando ao menos 50% das sessões abrirem um filme, depois de 100 sessões.

### Tela
O post do Gothelf, no modelo de hipótese. Depois, a linha do critério 2 no `padroes.md` do repositório engenharia.

### Comandos
```text
Acreditamos que [resultado] será alcançado
se [estas pessoas] tiverem [este benefício]
com [esta funcionalidade].

# acréscimo da régua dos meus projetos:
Saberemos quando [número] chegar a [valor], até [data].
```

## Medir sem cookie · 4:15–6:45

### Fala
- Para medir, a decisão de 10/11 foi uma conta do GoatCounter para o portfólio todo. É uma ferramenta de contagem de visitas que não usa cookie.
- O GoatCounter conta visitas, e não carregamentos de página. Recarregar a mesma página não conta de novo.
- Para saber que é a mesma pessoa, ele junta site, navegador e IP só na memória, por 8 horas. Segundo a documentação dele, o IP e o navegador nunca vão para o disco.
- No Movies, o código conta cada rota e, quando a rota é a ficha de um filme, manda também o evento `abriu-filme`.
- E ele só liga no site publicado: no build de produção, fora de `localhost` e fora de navegador automatizado. Assim, rodar os testes não conta visita falsa.
- Sobre consentimento: o próprio GoatCounter diz que provavelmente dá para usá-lo sem aviso de consentimento da GDPR, a lei europeia. O autor diz que não é advogado. Para a LGPD, tomo isso como argumento, não como garantia.

### Tela
A página de sessões e visitantes do GoatCounter, no trecho das 8 horas. Depois, `src/utils/medicao.js`, nas funções `deveMedir` e `registrarRota`.

### Comandos
```js
// src/utils/medicao.js (sprint de 12/11)
export function registrarRota(rota) {
  const gc = typeof window === "undefined" ? undefined : window.goatcounter;
  if (!gc || !gc.count) return;
  gc.count({ path: rota });
  if (rota.startsWith("/movie/")) {
    gc.count({ path: EVENTO_ABRIU_FILME, title: EVENTO_ABRIU_FILME, event: true });
  }
}
```

## Por que não tem nenhum dado · 6:45–8:15

### Fala
- Três coisas faltam, e nenhuma delas é código.
- Primeiro, a conta do GoatCounter com o código `douglasabnovato` ainda não foi criada. O passo a passo está na issue 58.
- Segundo, a medição está na sprint de 12/11 e ainda não foi para a `main`. O PR 91 espera a minha revisão. O site publicado roda a versão antiga, sem o script.
- Terceiro, o teste com 5 pessoas, a primeira meta, também não foi feito. É a issue 59.
- E tem um detalhe de honestidade. No mesmo `MVP.md`, o critério 5 já fala do GoatCounter, mas a seção 5 ainda diz "Ferramenta: nenhuma foi adotada", e a tabela fala em "depois de escolher a ferramenta". O documento se contradiz, e isso entra na melhoria.

### Tela
A issue 58, no comentário com o passo a passo. Depois, o PR 91 aberto. Por fim, as duas linhas do `MVP.md` lado a lado: a do critério 5 e a da seção 5.

## Melhoria: a hipótese com o "saberemos quando" · 8:15–10:30

### Fala
- A melhoria é no texto, e não no código.
- A seção 5 ganha a hipótese no formato completo, com o "saberemos quando".
- A linha da ferramenta passa a dizer a verdade: GoatCounter escolhido em 10/11, código pronto na sprint, sem dado até a conta e o merge.
- E a leitura fica escrita antes do primeiro dado. O GoatCounter conta uma visita por caminho, por navegador e IP, numa janela de 8 horas. Como todo filme manda o mesmo evento, `abriu-filme`, as visitas desse evento são as sessões que abriram ao menos um filme. Para o denominador, uso as visitas da Home.
- Essa conta tem limites, e eles ficam escritos junto. Quem chega direto pelo link de um filme entra no numerador e não passa pela Home, então a razão sai inflada e pode até passar de 100%. E duas pessoas com o mesmo navegador atrás do mesmo IP viram uma sessão só.
- A issue 58 dividia pelas visitas em geral. Trocar pela Home é uma decisão, e ela fica registrada na issue 97.
- Escrever a leitura antes evita escolher a conta que favorece o resultado depois de ver o número.
- Isto ainda não está no repositório. É a proposta para a issue 97, que entra por PR na sprint.

### Tela
O editor com a seção 5 do `MVP.md`, antes e depois.

### Comandos
```markdown
**Hipótese:** acreditamos que quem quer escolher um filme encontra um que vale abrir
usando a busca e o filtro por gênero. Saberemos quando ao menos 50% das sessões
abrirem um filme, depois de 100 sessões.

**Leitura:** visitas do evento `abriu-filme` ÷ visitas da Home, no painel do GoatCounter.
Limite: quem entra direto pela ficha de um filme conta no numerador e não passa pela Home;
a razão sai inflada. Mesmo navegador e mesmo IP contam como uma sessão.

**Ferramenta:** GoatCounter, decidido em 10/11/2026 (D5). Código na sprint de 12/11;
sem dado até criar a conta e mesclar a sprint na `main`.
```

## Desafio · 10:30–11:30

### Fala
- Pegue um projeto seu e escreva a aposta dele no formato: acreditamos que, saberemos quando.
- Escolha um número só e o valor que conta como acerto, antes de ter qualquer dado.
- Depois, confira se o seu site consegue contar esse número hoje. Se não consegue, essa é a próxima tarefa, e não uma função nova.

## Encerramento · 11:30–12:00

### Fala
- Uma hipótese sem o "saberemos quando" é um desejo. E uma meta sem medição é um número bonito no documento.
- No próximo episódio da série: ativação numa comunidade, com o Painel de Formação.

## Para o YouTube

### Descrição
O Movies tem uma aposta escrita, uma meta de 50% e o código que mede, sem cookie. Mesmo assim, o número de hoje é nenhum. Mostro como escrever uma hipótese com meta no formato do Lean UX, como o GoatCounter conta visitas sem cookie e o que falta para o primeiro dado aparecer.

Repositório: https://github.com/douglasabnovato/movies

### Capítulos
0:00 Gancho
0:40 A hipótese do Movies
2:30 Como escrever uma hipótese
4:15 Medir sem cookie
6:45 Por que não tem nenhum dado
8:15 Melhoria: a hipótese com o "saberemos quando"
10:30 Desafio
11:30 Encerramento

### Tags
product management, hipótese, métrica, lean ux, goatcounter, privacidade, mvp

### Capa
Um gráfico de barras vazio, com uma linha tracejada na altura de 50%. Texto: "A meta existe. E o dado?"
