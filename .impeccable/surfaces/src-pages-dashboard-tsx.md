---
version: 1
slug: "src-pages-dashboard-tsx"
primary_target: "src/pages/Dashboard.tsx"
related_targets: ["src/pages/MeuPainel.tsx"]
---

Escopo: o painel do professor (`/dashboard`) e o painel do aluno (`/meu-painel`).
Uma decisão de composição, duas telas: o aluno herda a gramática do professor com
o sujeito espelhado. Modo do visitante: **Operate** nas duas.

## Público e tarefa

Professor polivalente, 1–2 turmas, ~60 alunos, todas as matérias. Abre no começo
da aula ou no fim do turno, com pouco tempo. Sai da primeira dobra com uma
pendência a menos, não com uma impressão.

Aluno: entra para responder uma dúvida pontual e sair. Sai da primeira dobra
sabendo como está e o que vence, sem navegar.

## Prova

A distribuição da turma inteira lida em um olhar, por forma e cor, com o número
sempre ao lado. A 60 alunos a métrica agregada não prova nada; quem precisa de
atenção, nomeado, prova.

## Restrições

Não inventa componente: o que a tela usar tem de constar do inventário do design
system, ou entra nele no mesmo commit. Nenhum dado além das faixas já definidas
(1–2 turmas, ~60 alunos, bimestre 1 de 4). Nenhuma afirmação comercial.

## Momento memorável

O professor clica em "Chamada de hoje" e o cartão se desdobra ali mesmo em 30
alternadores; ele marca todos presentes, salva, e o cartão repinta para "feita"
sem a tela nunca mudar.

## Decisões não resolvidas

Distribuição exata das notas mock e nomes dos alunos em atenção — saem de
`src/mocks/` uma vez e valem para todas as telas. Limiar da lista de atenção:
proposto como faixa crítica de nota **ou** frequência abaixo de 75%, a confirmar
na construção. Texto do estado "tudo em dia".

## Direction contract

**THESIS:** O painel é o dia em ordem, não um relatório do trimestre. Ele recusa
o arranjo padrão da categoria — a fileira de quatro indicadores agregados sobre
um gráfico de tendência —, porque a 60 alunos a média da turma não informa nada
que o professor já não saiba. O que ele não sabe é o que ainda falta fazer hoje e
quem saiu da faixa.

**OWN-WORLD:** Duas faixas de largura total sobre o lilás claro, empilhadas sem
moldura externa. A de cima é acromática: cartões brancos de canto generoso, texto
em cinza de matiz roxo, e a cor entra só como fio fino na borda marcando estado.
A de baixo libera a cor plena, onde ela significa desempenho: trilhos totalmente
arredondados nas quatro faixas, sempre com o número ao lado. A faixa vertical
escura à esquerda é o único escuro da tela. Sem gradiente, sem vidro, sem sombra
que não seja a separação suave de cartão e fundo.

**STORY:** O professor entende, na primeira linha, quanta coisa do dia ainda está
aberta e em que ordem ela acontece. Acredita que o sistema conhece a rotina dele
porque a ordem é a do relógio, não a do banco de dados. E age sem sair da tela:
resolve a pendência dentro do próprio cartão. O aluno percorre o mesmo caminho
com o sujeito trocado — o que vence, e como ele está.

**FIRST VIEWPORT:** Faixa vertical escura fixa à esquerda com a marca no topo.
À direita, trilha e título fora de qualquer cartão. Abaixo, ocupando toda a
largura, a faixa de pendências: cartões de tamanho fixo ordenados por hora do
dia, o mais urgente encostado na borda esquerda e sempre visível, com contador do
total no cabeçalho da faixa; a rolagem horizontal serve só à cauda. A ação
primária vive dentro do primeiro cartão, não em botão de topo. Logo abaixo da
dobra, a segunda faixa em duas colunas: distribuição da turma à esquerda, lista
nomeada de atenção à direita.

**FORM:** Duas faixas — índice 6 da minha lista ordenada de sete. Escolhida pelo
usuário sobre a carta que os dados assinaram (índice 7, "Chamada em primeiro
plano") e sobre o desafiador que venceu nos dois eixos ("Painel de Partidas",
quadro split-flap de concourse). Carrega três doações: ordenação por hora com o
estado repintando o cartão sem mudar tamanho nem posição (Painel de Partidas);
ler e agir como dois modos do mesmo objeto (HyperCard); campo acromático com a
cor confinada ao fio da borda (Borda Iridescente). Seed key 0dc4341c.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
