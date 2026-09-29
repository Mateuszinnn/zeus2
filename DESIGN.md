<!-- SEED: established with the user before implementation; re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: Zeus
description: Gestão de centro de línguas — clareza operacional em roxo e laranja sobre superfícies lilás-claras.
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

Paleta de **cinco azuis**, fornecida pelo usuário como restrição vinculante.
Elas caem em pontos naturais de uma única rampa de matiz ~200°, da mais clara
à mais escura, e é isso que dá coesão ao sistema inteiro:

| | hex | papel |
|---|---|---|
| Azure X11 | `#E8F1F2` | o fundo da aplicação, sobre o qual os cartões brancos flutuam |
| Carolina | `#1B98E0` | o azul que sobrevive sobre o escuro: ícone ativo e o raio da marca |
| Celadon | `#247BA0` | degrau intermediário da rampa |
| Sapphire | `#006494` | a cor da ação: botão primário, foco, link, desempenho adequado |
| Prussian | `#13293D` | a faixa de navegação, o único escuro da tela |

Os degraus entre elas foram derivados por luminosidade, preservando o matiz,
para cobrir hover, borda, fundo suave e estado pressionado.

**Cinza com matiz azul.** Toda a escala de estrutura e texto carrega o mesmo
matiz ~205°, com saturação muito baixa, para não competir com o azul de ação.
Cinza neutro ao lado desta paleta suja a tela.

**A paleta é monocromática, e isso tem uma consequência.** Antes existia um par
quente/frio: o laranja marcava **posição** e o roxo marcava **ação**, duas
coisas diferentes com matizes diferentes. Agora ambas são azuis, e a distinção
passa a vir do **peso**, não do matiz: a página atual da paginação é a única
superfície preenchida da lista, e nada mais ali tem fundo. Onde o sistema
precisar separar dois papéis, separe por preenchimento e valor — nunca
introduza um matiz fora desta rampa para resolver o problema.

**Estado.** Sucesso `#12B76A`, atenção `#F79009`, erro `#F04438`, cada um com
fundo suave e variante escura para texto. Essas cores **não são da marca** e
não seguem a rampa: o produto codifica desempenho por cor, e uma escala de nota
monocromática não comunicaria nada. São as únicas cores não-azuis do sistema, e
existem porque carregam dado.

**A regra de faixa.** Nota, frequência e gravidade escolhem a cor por limiar, e
o limiar é único para todo o sistema. Nota 0–10: ≥8,5 sucesso · 5,0–8,4 azul de
ação · 4,0–4,9 atenção · <4,0 erro. Frequência: ≥90% sucesso · 75–89% azul ·
60–74% atenção · <60% erro.

Os cortes saem da regra institucional do CIL, não do gosto: **5,0 é a média de
aprovação**, **4,0** marca quem está abaixo mas ao alcance de recuperar, e
**75%** é a frequência mínima. Mudar a regra do CIL muda estes números, e eles
vivem num lugar só, `src/lib/grade.ts`.

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
sem bisel, sem contorno, sem sombra projetada, sem gradiente.

Numa paleta monocromática, um Z azul com raio azul vira lama. Então **o Z herda
a cor do contexto** — escuro sobre o login claro, branco sobre a faixa de
navegação — e **o raio fica fixo no Carolina `#1B98E0`**. É o raio, não o Z, que
identifica o produto nos dois fundos, e ele é a única aparição decorativa de cor
em todo o sistema: em qualquer outro lugar, cor significa dado.

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
- Não introduza matiz fora da rampa azul. Dois papéis que precisam se
  distinguir se separam por preenchimento e valor, não por uma cor nova.
- Não introduza uma segunda família tipográfica, nem peso fora de Regular /
  Medium / Bold.
- Não use gradiente decorativo, vidro, textura ou sombra colorida fora do azul
  escuro da marca.
- Não eleve linha de tabela no hover, nem anime o que não mudou de estado.
- Não use cinza neutro em lugar nenhum: todo cinza carrega o matiz azul.
- Não exiba dado com campo desabilitado. Somente-leitura é valor sem moldura.
- Não reproduza a marca "Edu.Link" do mockup de referência em nenhum lugar — é
  marca de terceiro; a marca do produto é Zeus.
