# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + TypeScript + Tailwind CSS. Front-end apenas: sem backend, sem
banco, sem chamadas de rede. Todo dado é mockado em memória e reinicia a cada
refresh. Escolha confirmada pelo usuário.

## Users

**Professor / secretaria (`teacher`)** — o usuário principal. Professor de
inglês de um Centro Interescolar de Línguas. Trabalha em desktop, durante ou
logo após a aula, com pouco tempo e muitos registros para lançar: notas das
cinco habilidades de uma turma inteira, chamada do dia, uma ocorrência, o prazo
de uma tarefa. O trabalho é repetitivo e em lote; o custo de errar é refazer.

**Aluno (`student`)** — usuário secundário, somente leitura exceto pela entrega
de tarefa. Entra para responder uma pergunta pontual: quanto tirei, quantas
faltas tenho, o que vence essa semana.

Não existe perfil de responsável nem de administrador. O corte é deliberado.

## Product Purpose

Zeus é um sistema de gestão para **Centro Interescolar de Línguas (CIL)**,
no **curso de inglês**. Reúne notas, frequência, ocorrências, tarefas, avisos e
matrícula em um lugar só, com a visão do professor e a do aluno sobre os mesmos
dados.

O que distingue o contexto de uma escola regular e molda a interface inteira:
o aluno do CIL cursa a língua **em contraturno**, em **estágios semestrais**, e
a nota não é de uma disciplina — é composta das **quatro habilidades mais o uso
da língua**. Um aluno pode ir bem em Reading e travar em Speaking, e é esse
perfil, não a média, que diz ao professor o que fazer.

**O artefato deste repositório é uma demonstração comercial**, não o produto em
produção. Ele existe para ser apresentado a uma escola cliente. Sucesso é a
escola terminar a apresentação entendendo o sistema e acreditando que ele já
existe — o que impõe duas exigências que um protótipo comum não teria: nenhum
fluxo pode terminar em beco sem saída, e nenhum dado pode parecer preenchimento.

## Positioning

**Parcialmente decidido.** O sistema é feito para centro de línguas, não
adaptado de escola regular: a nota por habilidade, o estágio semestral e a
rematrícula são de primeira classe, não campos extras. Esse é o recorte.

**Em aberto:** o usuário ainda não definiu o diferencial frente a outros
sistemas para CIL. Trabalho futuro não deve inventar um, e a demo não deve
afirmar superioridade sobre concorrentes.

## Operating Context

O sistema será apresentado ao vivo, em desktop, por quem conduz a venda. Isso
faz da apresentação um contexto de uso de primeira classe:

- A sessão alterna entre a visão do professor e a do aluno. A troca precisa ser
  possível sem tela de administração — resolvida por um seletor de perfil no
  login.
- A navegação da demo é imprevisível: quem assiste pede para ver uma tela
  qualquer. Toda tela do menu precisa abrir com conteúdo plausível.
- O **Dashboard / Meu painel** é a tela-centro da demonstração, confirmada pelo
  usuário. É a primeira impressão e a que recebe maior profundidade; as demais
  ficam funcionais, porém mais simples.

Rotina retratada: **semestres com dois bimestres**, turmas nomeadas por
**estágio de 1A a 6B** (o número é o estágio, a letra é o semestre dentro dele;
1–2 Básico, 3–4 Intermediário, 5–6 Avançado), notas de 0 a 10 com **média de
aprovação 5,0** e frequência com mínimo de 75%.

**Composição da nota, confirmada pelo usuário:** Listening, Speaking, Reading,
Writing e Use of English. A média é sempre derivada dessas cinco e nunca
digitada diretamente.

## Capabilities and Constraints

**Telas:** Login · Dashboard/Meu painel · Turmas · Alunos · Notas · Faltas ·
Ocorrências · Tarefas · Avisos · Matrículas/Minha ficha.

**Confirmado:**
- Login aceita qualquer credencial; o seletor de perfil define a sessão.
- `teacher` escreve em todas as áreas. `student` só lê, exceto entregar tarefa.
- Operações mockadas passam por latência simulada de 300–600ms, para que a
  interface não denuncie a ausência de backend.

**Fora de escopo:** persistência, autenticação real, controle de acesso real,
internacionalização, impressão, perfil de responsável, perfil de administrador.

**Idioma da interface: inglês**, por decisão do usuário. É defensável num
centro de línguas que ensina inglês — a própria interface vira exposição à
língua.

O que **não** se traduz, porque são nomes próprios de brasileiros e de
instituições reais: nomes de alunos, responsáveis e professores, o nome do
Centro Interescolar de Línguas, as escolas de origem e as regiões
administrativas. Traduzi-los soaria falso e descreveria pessoas que não
existem.

Os documentos do projeto seguem em português: eles são para quem constrói.

## Brand Commitments

**Nome: Zeus.** Confirmado pelo usuário. "Edu.Link", do mockup de referência, é
marca de terceiro e não aparece em lugar nenhum do produto — nem em logo, nem em
texto, nem em dado mock.

**Restrições visuais vinculantes** fornecidas pelo usuário, registradas sem
expansão:

- Tipografia: **Lato**, pesos Bold, Medium, Regular.
- Paleta: cinco azuis — `#13293D` (Prussian) · `#006494` (Sapphire) ·
  `#247BA0` (Celadon) · `#1B98E0` (Carolina) · `#E8F1F2` (Azure X11).

> A paleta anterior era roxo e laranja sobre cinzas lilás. O usuário a
> substituiu integralmente por esta. Fica o registro porque ela já mudou uma
> vez: tudo que depende de cor vive na camada semântica de
> `src/styles/tokens.css`, e é lá que uma próxima troca acontece.

**Marca gráfica fornecida pelo usuário:** a palavra "Zeus" com um **raio
atravessando o Z na diagonal**, fundido à letra. O usuário autorizou
explicitamente recolorir e modernizar — o original é azul com contorno escuro,
bisel e sombra projetada, linguagem dos anos 90.

O que é vinculante é a **ideia**: o nome Zeus e o raio fundido ao Z. Cor,
acabamento e construção são livres e devem seguir a paleta e o material plano do
sistema. O arquivo original não está no repositório; a marca é reconstruída como
vetor.

Voz e personalidade não foram definidas pelo usuário. **Decisão em aberto.**

## Evidence on Hand

- Mockup de referência da tela de notas (produto "Edu.Link", terceiro) e imagem
  de tipografia e color scheme, ambos fornecidos pelo usuário no briefing.
- Sistema de design derivado desses insumos:
  `docs/superpowers/specs/2026-09-28-design-system-design.md` — tokens, escala de
  desempenho, shell de layout, inventário de componentes e mapa de telas.

**Ausências que trabalho futuro não deve fabricar:** não existe escola cliente
nomeada, dado real de aluno, depoimento, estudo de caso, logo, número de
contrato, preço, prazo de implantação ou métrica de resultado. Dados mock são
fictícios e plausíveis; nenhum deles pode ser apresentado como real, e a
interface não deve exibir afirmação comercial que ninguém confirmou.

## Product Principles

1. **Habilidade antes de média.** A média esconde o aluno que passa raspando em
   Speaking. Onde couber uma das duas, mostre a decomposição por habilidade.
2. **A demo é o produto.** Enquanto este repositório existir para apresentação,
   um fluxo incompleto é defeito de produto, não pendência. Tela sem conteúdo,
   botão que não responde e estado vazio genérico quebram a venda.
3. **Lançar em lote antes de lançar um.** O professor lida com a turma inteira.
   Ação em massa, edição inline e navegação por teclado valem mais que o
   formulário individual bem-acabado.
4. **O aluno pergunta, não administra.** A visão do aluno responde uma dúvida
   pontual na primeira tela. Se ele precisa navegar para saber como vai, a
   tela errou.
5. **Dado mock é conteúdo, não preenchimento.** Nomes brasileiros, notas com
   distribuição crível, datas coerentes e volume suficiente para a paginação
   existir. Dado repetido ou aleatório derruba a credibilidade na hora.
6. **Não afirmar o que ninguém confirmou.** Sem diferencial inventado, sem
   cliente fictício, sem número de resultado. A demo mostra o sistema
   funcionando; ela não promete.

## Accessibility & Inclusion

Nenhum padrão formal foi exigido pelo usuário. O piso estabelecido no sistema de
design (§7) vale como compromisso do projeto: contraste WCAG AA, navegação
completa por teclado com foco visível, `<table>` semântica, respeito a
`prefers-reduced-motion` e layout íntegro a 200% de zoom.

Restrição que vem do domínio, não de norma: **cor nunca carrega significado
sozinha.** Notas, frequência e gravidade de ocorrência são codificadas por cor,
e a leitura precisa funcionar sem enxergá-la — sempre com número ou rótulo ao
lado.
