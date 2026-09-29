<!-- SEED: established with the user before implementation; re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: Zeus
description: Sistema de gestão escolar — clareza operacional em roxo e laranja sobre superfícies lilás-claras.
---

## Overview

Zeus é uma ferramenta de trabalho, não uma vitrine. O modo dominante é
**Operate**: professor e aluno vêm buscar um número e sair. A tese visual é
*calma densa* — muita informação por tela, lida sem esforço, com o mínimo de
ruído entre o olho e o dado.

O mundo se apoia em três decisões que valem para tudo:

**Superfície branca flutuando sobre lilás.** O fundo da aplicação é um lilás
muito claro; o conteúdo vive em cartões brancos de canto generoso com sombra
quase imperceptível. Isso dá hierarquia sem bordas pesadas e sem cinza morto.

**Uma âncora escura à esquerda.** A navegação é uma faixa vertical quase preta,
de matiz roxo, fixa por toda a sessão. Ela ancora a composição e libera o resto
da tela para o dado. Nada mais na interface é escuro.

**Cor é dado, não decoração.** O roxo carrega a ação e o desempenho adequado; o
laranja marca posição e atenção. Verde e vermelho só aparecem quando um número
os justifica. Uma tela sem nada de notável é quase monocromática — e isso é
correto, não sem graça.

O material é plano e mate: sem gradiente decorativo, sem vidro, sem textura. A
única profundidade permitida é a sombra suave que separa cartão de fundo. O
movimento é utilitário — transições curtas que explicam uma mudança de estado e
nunca chamam atenção para si.

A assinatura reutilizável é a **barra de desempenho**: um trilho fino de canto
totalmente arredondado, preenchido na cor da faixa em que o número cai, sempre
com o número ao lado. Ela aparece em notas, frequência e progresso de entrega, e
é o que faz uma tabela do Zeus ser reconhecível a três metros de distância.

## Colors

Palette estabelecida pelo usuário como restrição vinculante. Os três tons de
marca abaixo são normativos; as escalas ao redor deles existem para cobrir
hover, borda, fundo suave e estado pressionado.

**Roxo — ação e desempenho adequado.** Âncora `#7A5AF8`. É a cor do botão
primário, do foco, do link e da faixa de nota adequada. Escala de apoio de
`#F4F1FE` (fundo suave) a `#391D96` (pressionado).

**Laranja — posição e atenção.** Âncora `#FD853A`. Deliberadamente escasso: marca
a página atual da paginação e a faixa de nota em atenção. Nunca é fundo de botão
primário, e **nunca recebe texto por cima** — texto laranja vai em `#C24F13`
sobre `#FFF6ED`.

**Cinza de matiz roxo — estrutura.** Âncoras de marca `#F2EEF8` (fundo da
aplicação), `#867E96` (texto secundário e cabeçalho de tabela) e `#362E46`
(texto principal). A faixa escura da navegação é `#251F32`, um passo além da
âncora, para que o item selecionado — em `#443B57` — leia como bloco destacado.
Cinza neutro é proibido: todo cinza do sistema carrega o matiz ~260° herdado
dessas três cores.

**Estado.** Sucesso `#12B76A`, atenção `#F79009`, erro `#F04438`, cada um com
fundo suave e variante escura para texto. Essas cores não vieram da paleta de
marca — foram estabelecidas aqui porque o produto codifica desempenho por cor e
a paleta original não cobria os extremos.

**A regra de faixa.** Nota, frequência e gravidade escolhem a cor por limiar, e
o limiar é único para todo o sistema. Nota 0–10: ≥8,5 sucesso · 6,0–8,4 roxo ·
5,0–5,9 atenção · <5,0 erro. Frequência: ≥90% sucesso · 75–89% roxo · 60–74%
atenção · <60% erro. Os cortes são os do domínio escolar brasileiro — 6,0 é média
de aprovação, 75% é frequência mínima.

## Typography

**Lato é a única família.** Restrição vinculante do usuário. Uma segunda
família é violação do mundo.

A família distribuída não traz o peso 500, então os três papéis da imagem de
tipografia — Regular, Medium e Bold — assentam em **dois pesos reais, 400 e
700**. Medium e Bold dividem o 700 e se separam por tamanho e cor. Nenhum outro
peso entra no sistema.

O contraste de tipo é feito por **peso e cor, não por tamanho**. A escala é
curta de propósito — título de página em 28px é o único salto grande; todo o
resto vive entre 12 e 20px. Numa tela de tabela, o que separa o nome do aluno do
resto da linha é Medium contra Regular, e o que separa o cabeçalho da coluna do
dado é cinza médio contra cinza escuro.

Bold é reservado a títulos. Medium marca o dado que a pessoa veio buscar. Regular
é todo o resto. Não use Bold dentro de uma célula de tabela para dar ênfase —
esse é o trabalho da cor da barra.

Toda coluna numérica usa numerais tabulares. Sem isso as colunas dançam entre
linhas, e essa é a diferença mais visível entre uma tabela cuidada e uma
descuidada.

## Layout

**Grade de duas zonas, fixa.** Faixa de navegação de largura constante à
esquerda, área de conteúdo rolável à direita. A faixa não rola com o conteúdo e
não muda de largura. Toda tela autenticada usa essa mesma estrutura — a única
exceção é o login, que não tem faixa.

Dentro da área de conteúdo a ordem é sempre a mesma: trilha de navegação, título
da página, e então o cartão. **Trilha e título ficam fora do cartão**; o cartão
contém apenas dado. Um cartão principal por tela; quando a tela precisa de dois
blocos, eles se empilham com respiro constante — cartão dentro de cartão é
proibido.

O ritmo espacial é uma escala de base 4, e todo respiro do sistema sai dela.
Valor fora da escala é erro, não ajuste fino.

O conteúdo tem largura máxima e fica centralizado: em monitor largo o sistema não
estica a tabela até a borda, porque linha longa demais quebra a leitura de
varredura, que é o gesto dominante deste produto.

**Comportamento responsivo.** A apresentação é em desktop, mas o layout não pode
quebrar. Abaixo da largura de notebook a faixa vira gaveta sobreposta, acionada
por botão no topo. Em largura de telefone a tabela deixa de ser tabela e vira
lista de cartões, um por registro, com rótulo acima do valor. Em nenhuma largura
existe rolagem horizontal de página.

## Elevation & Depth

Plano e mate. A profundidade existe para uma única finalidade: separar o cartão
branco do fundo lilás. Sombra suave, curta e **tingida de roxo** — sombra preta
neutra suja a paleta e é imediatamente visível como erro.

Só três níveis existem. Cartão recebe o mais discreto. Menu suspenso e modal
recebem o mais alto, porque flutuam sobre o conteúdo. Nada mais é elevado:
linha de tabela não levanta no hover, botão não afunda ao clicar. Hover é
mudança de fundo, não de altura.

Modal escurece o fundo com o próprio escuro da navegação em meia opacidade, com
desfoque mínimo. Não há sobreposição colorida.

## Shapes

Canto arredondado em toda parte, com o raio crescendo junto com a superfície:
controle pequeno tem canto discreto, cartão de conteúdo tem canto
visivelmente generoso — é o que dá ao sistema o ar de ferramenta contemporânea
em vez de painel administrativo.

Três formas são **totalmente circulares** e essa escolha é invariante: avatar,
barra de desempenho e pílula de estado. São os três elementos que se repetem
dezenas de vezes por tela, e o círculo completo é o que impede a repetição de
parecer grade de retângulos.

Borda é fina e de baixo contraste, usada para delimitar campo e separar linha —
nunca para dar ênfase. Ênfase é cor de fundo ou peso de tipo.

Ícone é de traço, não preenchido, com espessura constante em todo o sistema.

**A marca.** O símbolo do Zeus é um **raio atravessando o Z na diagonal**,
fundido à letra — não um raio colocado ao lado dela. O raio é o corte que separa
as duas metades do Z, e essa negativa é a forma. Construção geométrica e plana:
sem bisel, sem contorno, sem sombra projetada, sem gradiente. O Z é roxo; o raio
é laranja.

Essa é a **única aparição decorativa do laranja em todo o sistema** — em todo o
resto ele significa atenção ou posição. A exceção vale porque a marca é
identidade, não dado, e porque um raio de qualquer outra cor deixa de ser o raio
do Zeus.

## Do's and Don'ts

**Do**

- Acompanhe toda cor semântica de um número ou rótulo. A tela precisa funcionar
  para quem não distingue as cores.
- Deixe a tela quase monocromática quando não há nada de notável nela.
- Use numerais tabulares em toda coluna numérica.
- Trate estado vazio, carregando e erro como parte do design da tela, não como
  sobra. Texto de estado vazio é específico da tela.
- Mantenha o foco de teclado visível e óbvio em todo elemento interativo.

**Don't**

- Não escreva cor, tamanho de fonte ou família literal no componente. Tudo passa
  por token.
- Não coloque texto sobre o laranja de marca.
- Não introduza uma segunda família tipográfica, nem peso fora de Regular /
  Medium / Bold.
- Não use gradiente decorativo, vidro, textura ou sombra colorida fora do roxo.
- Não eleve linha de tabela no hover, nem anime o que não mudou de estado.
- Não use cinza neutro em lugar nenhum.
- Não exiba dado com campo desabilitado. Somente-leitura é valor sem moldura.
- Não reproduza a marca "Edu.Link" do mockup de referência em nenhum lugar — é
  marca de terceiro; a marca do produto é Zeus.
