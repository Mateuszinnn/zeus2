# Design System — Zeus2

> Documento normativo. Toda tela, componente e PR deste repositório segue o que
> está aqui. Quando o código e este documento divergirem, o documento está certo
> até que alguém o altere deliberadamente.

**Status:** aprovado · **Data:** 2026-09-28 · **Stack:** React + Vite + TypeScript + Tailwind CSS

**Documentos irmãos.** [`PRODUCT.md`](../../../PRODUCT.md) é a autoridade sobre
verdade de produto — usuários, propósito, contexto de uso, marca.
[`DESIGN.md`](../../../DESIGN.md) é a autoridade sobre o mundo visual e seus
invariantes, no formato que o Impeccable lê. **Este documento é o contrato de
implementação:** os valores exatos, a anatomia de cada componente, o mapa de
telas e o checklist. Se um valor divergir entre este documento e o `DESIGN.md`,
este está certo — corrija o `DESIGN.md`.

---

## 1. Contexto e escopo

Zeus2 é um sistema escolar **front-end apenas, 100% mockado**, construído para
apresentação. Não há backend, banco de dados nem autenticação real. Os dados
vivem em memória e são reiniciados a cada refresh.

**Perfis de usuário (dois):**

| Perfil | Quem é | O que faz |
|---|---|---|
| `teacher` | Professor / secretaria | Lança e edita notas, faltas, ocorrências, tarefas e avisos. Gerencia fichas de matrícula. |
| `student` | Aluno | Consulta o próprio desempenho. Somente leitura, exceto entrega de tarefa. |

Não existe perfil de responsável. Não existe perfil de administrador.

**Telas:** Login, Dashboard, Turmas, Notas, Ocorrências, Faltas, Tarefas, Avisos,
Ficha de matrícula — com variações por perfil (ver §8).

**Fora de escopo:** persistência, chamadas de rede, controle de acesso real,
internacionalização, impressão.

### Princípios

1. **Densidade legível.** As telas são listas de dados. Priorize ler muitas
   linhas sem esforço: linha de tabela com 56px de altura, texto 14px, contraste
   forte só onde importa.
2. **Cor carrega significado, nunca sozinha.** Toda cor semântica acompanha
   número, rótulo ou ícone. Um daltônico precisa entender a tela inteira.
3. **Um único esqueleto.** Toda tela autenticada usa o mesmo shell (§4). Telas
   novas compõem componentes existentes; inventar componente é exceção que se
   justifica neste documento.
4. **Componentes usam tokens semânticos, nunca hex.** Um `#7A5AF8` solto no JSX
   é bug de revisão.
5. **Mock realista.** Nomes brasileiros plausíveis, notas 0–10, datas coerentes,
   volume suficiente para a paginação existir de verdade. Dado mock feio estraga
   apresentação.

---

## 2. Tokens de design

Os tokens têm **duas camadas**. Componentes consomem apenas a camada semântica.
Assim, rebrand ou dark mode é a troca de um arquivo.

```
primitivo  (purple-500, gray-90)  →  semântico  (bg-surface, text-muted)  →  componente
```

### 2.1 Cor — primitivos

As três cores de marca vieram do color scheme fornecido. Cada uma foi expandida
em escala por ajuste de luminosidade preservando o matiz, porque um tom só não
resolve hover, borda, fundo suave e estado pressionado.

**Roxo — cor primária de ação.** Âncora de marca: `500 = #7A5AF8`.

| | 50 | 100 | 200 | 300 | 400 | **500** | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| hex | `#F4F1FE` | `#EBE5FE` | `#DACFFD` | `#C2AFFB` | `#A287F9` | `#7A5AF8` | `#6438F0` | `#5326DC` | `#4520B8` | `#391D96` |

**Laranja — cor de destaque e alerta de desempenho.** Âncora: `500 = #FD853A`.

| | 50 | 100 | 200 | 300 | 400 | **500** | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| hex | `#FFF6ED` | `#FFEAD5` | `#FED7AA` | `#FDBA74` | `#FD9A5C` | `#FD853A` | `#EA6A1C` | `#C24F13` | `#9A3F16` | `#7C3515` |

**Cinza — estrutura, texto e superfícies.** Não é cinza neutro: tem matiz roxo
(~260°), herdado de `#362E46`, `#867E96` e `#F2EEF8`. Usar cinza neutro ao lado
da marca suja a paleta.

| token | hex | uso |
|---|---|---|
| `gray-0` | `#FFFFFF` | superfície de card, fundo de tabela |
| `gray-20` | `#F2EEF8` | **marca** · fundo da aplicação, linha zebrada |
| `gray-25` | `#FAF8FD` | hover de linha de tabela |
| `gray-30` | `#E4DFEE` | bordas, divisores, trilho de progresso |
| `gray-35` | `#C5BDD4` | texto desabilitado, placeholder |
| `gray-40` | `#867E96` | **marca** · texto secundário, cabeçalho de tabela, ícones |
| `gray-50` | `#6E6682` | texto secundário com mais peso |
| `gray-70` | `#443B57` | item ativo/hover da sidebar |
| `gray-80` | `#362E46` | **marca** · texto principal |
| `gray-90` | `#251F32` | fundo da sidebar |

> Nota sobre a sidebar: no mockup ela é mais escura que `#362E46`. `gray-90`
> é o fundo e `gray-70` o item ativo — é isso que produz o bloco destacado do
> item selecionado.

**Semânticas de estado.** O mockup usa verde, vermelho e amarelo nas barras de
nota; essas cores não estavam no color scheme e foram definidas aqui.

| | base | fundo suave | texto sobre fundo suave |
|---|---|---|---|
| Sucesso | `#12B76A` | `#ECFDF3` | `#027A48` |
| Atenção | `#F79009` | `#FFFAEB` | `#B54708` |
| Erro | `#F04438` | `#FEF3F2` | `#B42318` |
| Informação | `purple-500` | `purple-50` | `purple-700` |

### 2.2 Cor — semânticos

Esta é a camada que o código usa.

| token | valor | uso |
|---|---|---|
| `bg-app` | `gray-20` | fundo da área de conteúdo |
| `bg-surface` | `gray-0` | card, modal, tabela |
| `bg-surface-alt` | `gray-25` | hover de linha, zebra |
| `bg-sidebar` | `gray-90` | sidebar |
| `bg-sidebar-active` | `gray-70` | item de nav selecionado |
| `text-primary` | `gray-80` | títulos, valores, nome em tabela |
| `text-secondary` | `gray-50` | apoio |
| `text-muted` | `gray-40` | cabeçalho de tabela, metadados, breadcrumb |
| `text-disabled` | `gray-35` | placeholder, desabilitado |
| `text-on-dark` | `gray-0` | texto sobre sidebar |
| `text-on-dark-muted` | `#A79FB5` | item inativo da sidebar |
| `text-brand` | `purple-600` | link, texto de ação |
| `border-default` | `gray-30` | input, card, divisor |
| `border-strong` | `gray-35` | separador com ênfase |
| `border-focus` | `purple-500` | anel de foco |
| `accent-primary` | `purple-500` | botão primário, seleção |
| `accent-primary-hover` | `purple-600` | — |
| `accent-secondary` | `orange-500` | destaque, página ativa da paginação |

### 2.3 Tipografia

**Fonte única: Lato.** Não use outra família. Fallback:
`'Lato', system-ui, -apple-system, sans-serif`.

Carregue via `@fontsource/lato` (subset latin) — self-hosted, sem dependência de
CDN na apresentação.

> **O Lato distribuído não tem peso 500.** A família servida pelo Google Fonts
> e pelo Fontsource traz 100 / 300 / 400 / 700 / 900. O papel **Medium** da
> imagem de tipografia resolve para **700**, fixado uma única vez no token
> `--font-weight-medium`. Sem essa amarração, `font-medium` cairia
> silenciosamente para 400, ficando idêntico ao corpo e apagando a hierarquia
> de nome de aluno, valor em destaque e rótulo de campo.
>
> Ênfase e título passam a dividir o 700 e se separam por **tamanho e cor**,
> que é como o sistema já opera. Carregue apenas 400 e 700: os outros três
> pesos não têm papel definido e não devem entrar no bundle.

| token | tamanho / entrelinha | peso | uso |
|---|---|---|---|
| `display` | 28 / 36 | 700 | título de página ("Notas") |
| `h2` | 20 / 28 | 700 | título de seção |
| `h3` | 16 / 24 | 700 | título de card |
| `body` | 14 / 20 | 400 | texto corrente, célula de tabela |
| `body-strong` | 14 / 20 | 500 | nome do aluno, valor em destaque |
| `label` | 13 / 18 | 500 | rótulo de campo, cabeçalho de tabela |
| `caption` | 12 / 16 | 400 | metadado, "Exibindo 13–25 de 120" |

Cabeçalho de tabela: `label` + `text-muted`, **sem** caixa alta forçada e sem
letter-spacing — é o que o mockup faz e mantém a leitura rápida.

Números tabulares (`font-variant-numeric: tabular-nums`) em toda coluna
numérica: nota, matrícula, faltas, datas. Sem isso as colunas dançam.

### 2.4 Espaçamento

Base **4px**. Escala: `1`=4 · `2`=8 · `3`=12 · `4`=16 · `5`=20 · `6`=24 · `8`=32 · `10`=40 · `12`=48 · `16`=64.

Valores fora da escala não entram. Padding interno de card: `24`. Gap entre
seções: `24`. Gap entre campos de formulário: `20`.

### 2.5 Raio de borda

| token | px | uso |
|---|---|---|
| `sm` | 6 | badge, chip |
| `md` | 8 | input, select, botão |
| `lg` | 12 | card interno, modal |
| `xl` | 16 | card principal de conteúdo |
| `2xl` | 20 | shell da aplicação |
| `full` | 9999 | avatar, barra de progresso, pílula de paginação |

### 2.6 Sombra

Sombras suaves e **tingidas de roxo** — sombra preta neutra destoa da paleta.

| token | valor |
|---|---|
| `xs` | `0 1px 2px rgba(54, 46, 70, .05)` |
| `sm` | `0 1px 3px rgba(54, 46, 70, .08), 0 1px 2px rgba(54, 46, 70, .04)` |
| `md` | `0 4px 8px -2px rgba(54, 46, 70, .08), 0 2px 4px -2px rgba(54, 46, 70, .04)` |
| `lg` | `0 12px 16px -4px rgba(54, 46, 70, .08), 0 4px 6px -2px rgba(54, 46, 70, .03)` |

Card usa `sm`. Dropdown e popover usam `lg`. Modal usa `lg` + overlay
`rgba(37, 31, 50, .5)`.

### 2.7 Implementação dos tokens

O projeto usa **Tailwind v4**, cuja configuração é CSS-first: não existe
`tailwind.config.ts`. `src/styles/tokens.css` declara as duas camadas dentro de
um único bloco `@theme`, e cada token gera a utilitária correspondente.

```css
/* src/styles/tokens.css — recorte */
@theme {
  --color-purple-500: #7a5af8;   /* primitivo */
  --color-gray-20: #f2eef8;

  --color-accent: var(--color-purple-500);  /* semântico */
  --color-app: var(--color-gray-20);
  --color-surface: var(--color-gray-0);
  --color-muted: var(--color-gray-40);
}
```

A camada semântica referenciar a primitiva por `var()` é o que mantém o
contrato: trocar a marca é reescrever dez linhas de semântica, sem tocar em
componente.

Uso em componente: `className="bg-surface text-primary border-default"`.
**Nunca** `className="bg-[#FFFFFF]"`.

---

## 3. Escala de desempenho

O mockup codifica nota por cor na barra de progresso. Isso vira **uma regra
única**, aplicada a barras, badges, gráficos e qualquer indicador de nota.

Notas no sistema são **0–10**. A tabela abaixo traz a equivalência percentual
porque a barra de progresso é percentual.

| Faixa (0–10) | Percentual | Cor | Rótulo |
|---|---|---|---|
| 8,5 – 10,0 | ≥ 85% | Sucesso `#12B76A` | Excelente |
| 5,0 – 8,4 | 50–84% | Roxo `#7A5AF8` | Aprovado |
| 4,0 – 4,9 | 40–49% | Atenção `#F79009` | Recuperável |
| 0,0 – 3,9 | < 40% | Erro `#F04438` | Crítico |

Os cortes saem da **regra institucional do CIL**, não do gosto: 5,0 é a média
de aprovação, e 4,0 marca quem está abaixo mas ao alcance de recuperar. Abaixo
disso o problema deixou de ser de nota.

> Esses números já mudaram uma vez, quando o produto passou de escola regular
> (aprovação 6,0) para CIL (aprovação 5,0). Eles vivem em `PASSING_GRADE` e
> `gradeLevel()`, num arquivo só. Se a regra do CIL for outra, é lá que se
> muda — e em lugar nenhum mais.

**Regra obrigatória:** a cor nunca aparece sozinha. Toda barra vem acompanhada
do número, e toda legenda de cor traz o rótulo textual.

A função vive em `src/lib/grade.ts` e é a única fonte dessa lógica:

```ts
export type GradeLevel = 'excellent' | 'adequate' | 'attention' | 'critical'
export const PASSING_GRADE = 5
export const MIN_ATTENDANCE = 75
export function gradeLevel(score: number): GradeLevel
export function attendanceLevel(percent: number): GradeLevel
export function levelStyle(level: GradeLevel): LevelStyle
export function gradeLabel(level: GradeLevel): string
```

**A nota de inglês é composta.** A média de um aluno é sempre derivada das cinco
habilidades — Listening, Speaking, Reading, Writing e Use of English — e nunca
digitada diretamente. Onde couber mostrar uma das duas, mostre a decomposição:
a média esconde o aluno que passa raspando em Speaking.

Frequência usa a mesma ideia sobre % de presença, com corte de aprovação em
75%: ≥90% sucesso · 75–89% roxo · 60–74% atenção · <60% erro.

---

## 4. Layout e shell

Toda tela autenticada usa o mesmo esqueleto. Não há exceção além do Login.

```
┌──────────────┬───────────────────────────────────────────────┐
│              │  Breadcrumb                                   │
│   SIDEBAR    │  Título da página                    [ações]  │
│   256px      │  ┌─────────────────────────────────────────┐  │
│   bg-sidebar │  │  CARD  bg-surface  radius-xl  shadow-sm │  │
│              │  │  header do card: contexto + filtros     │  │
│   [logo]     │  │  ─────────────────────────────────────  │  │
│   [perfil]   │  │  conteúdo (tabela, formulário, lista)   │  │
│   [nav]      │  │  ─────────────────────────────────────  │  │
│              │  │  footer: contagem · paginação · por pág │  │
│   [rodapé]   │  └─────────────────────────────────────────┘  │
└──────────────┴───────────────────────────────────────────────┘
        bg-app  ·  padding 32px  ·  conteúdo max-width 1280px
```

**Regras de layout**

- Sidebar: largura fixa 256px, altura total da viewport, não rola com o conteúdo.
- Breadcrumb e título ficam **fora** do card. O card contém apenas dados.
- Área de conteúdo: `padding: 32px`, `max-width: 1280px`, centralizada.
- Só o conteúdo rola. A sidebar e o header do card permanecem fixos.
- Um card principal por tela. Se a tela precisa de dois blocos, empilhe cards
  com `gap: 24px` — não crie um card dentro de outro.

**Responsividade.** A apresentação é em desktop; ainda assim:
`< 1024px` a sidebar vira drawer sobreposto acionado por botão hambúrguer no
header. `< 768px` a tabela vira lista de cards (um card por registro, rótulo
acima do valor). Sem scroll horizontal de página em nenhuma largura.

---

## 5. Componentes

Inventário fechado derivado do mockup. Cada componente vive em
`src/components/<Nome>/`, com um arquivo por componente.

### Sidebar

Anatomia, de cima para baixo: logo (ícone + wordmark, `text-on-dark`) ·
cartão de perfil (avatar 40px, nome em `body-strong`, papel em `caption`
`text-on-dark-muted`, chevron à direita) · divisor · lista de navegação ·
bloco inferior fixo (Configurações, Ajuda, Contato).

Item de nav: altura 40px, padding horizontal 12px, `radius-md`, ícone 20px +
rótulo `body`. Inativo: `text-on-dark-muted`, ícone na mesma cor. Hover:
`bg-sidebar-active` a 50% de opacidade. Ativo: `bg-sidebar-active`,
`text-on-dark`, ícone em `purple-400`. Item com filhos exibe chevron e expande
inline.

O conjunto de itens depende do perfil (§8). O componente recebe a lista pronta;
ele não conhece regra de perfil.

### Breadcrumb

`caption` em `text-muted`, separador `/`. Último segmento em `text-primary`.
Níveis anteriores são links.

### PageHeader

Título `display` + slot opcional de ações à direita (botões). Subtítulo
opcional em `body` `text-secondary`.

### Card

`bg-surface`, `radius-xl`, `shadow-sm`, `border-default` de 1px.
Header opcional: título `h3` à esquerda, controles à direita, padding 20px 24px,
borda inferior `border-default`. Corpo com padding 24px — **exceto** quando
contém DataTable, que encosta nas bordas.

### DataTable

O componente central do sistema. Anatomia conforme o mockup:

- **Cabeçalho:** `label` em `text-muted`, `bg-surface`, borda inferior
  `border-default`, altura 44px. Coluna ordenável mostra ícone de seta ao
  passar o mouse e fixo quando ativa.
- **Linha:** altura 56px, borda inferior `border-default`. Zebra: linhas pares
  em `bg-app`. Hover: `bg-surface-alt` com transição de 120ms.
- **Célula de identidade:** avatar circular 32px + nome em `body-strong`
  `text-primary`. Sempre a primeira coluna quando a linha representa uma pessoa.
- **Células numéricas:** `tabular-nums`, alinhadas à direita quando são só
  números; à esquerda quando acompanhadas de barra ou badge.
- **Rodapé:** contagem à esquerda (`caption` `text-muted`, formato
  "Exibindo 13–25 de 120"), paginação ao centro, seletor de itens por página
  à direita.
- **Seleção** (quando aplicável): checkbox na primeira coluna, barra de ações
  em massa substitui o header do card quando há seleção ativa.

Estados obrigatórios: normal, carregando (skeleton de 8 linhas), vazio
(EmptyState), erro. Nenhuma tabela entra sem os quatro.

### Select (FilterBar)

Fica no header do card, alinhada à direita. Select de altura 40px,
`radius-md`, `border-default`, `body`, chevron 16px em `text-muted`.
Hover: `border-strong`. Foco: `border-focus` + anel `purple-100` de 4px.
Padrão do mockup: três selects — escopo ("Todas as turmas"), objeto
("Todas as avaliações"), ordenação ("Ordenar: A a Z").

Filtro aplicado aparece como chip removível abaixo da barra, `radius-sm`,
`purple-50` / `purple-700`, com `×`.

### GradeBar

Barra horizontal, altura 8px, `radius-full`, trilho `gray-30`, preenchimento na
cor da faixa (§3), transição de largura 200ms. Sempre precedida ou seguida do
valor numérico em `body-strong`, largura fixa para não desalinhar a coluna.
`role="progressbar"` com `aria-valuenow`, `aria-valuemin`, `aria-valuemax` e
`aria-label` descrevendo aluno e avaliação.

### GradeCell

A célula de nota da tela de Notas. Em repouso: o valor em `body-strong` mais a
barra da faixa, tudo dentro de um botão que cobre a célula. Ao clicar, vira um
campo de 64px com borda `border-focus`, texto selecionado, que aceita vírgula ou
ponto e valida de 0 a 10. `Enter` confirma, `Esc` cancela, sair do campo
confirma. Valor inválido marca a borda em erro e mantém o foco, com a mensagem
abaixo. O salvamento é otimista e confirma por toast.

Variante `compact`: só o número, sem barra, para quando as cinco habilidades
aparecem lado a lado.

### StatusBadge

Pílula: padding 2px 10px, `radius-full`, `caption` peso 500, fundo suave +
texto da mesma família (§2.1). Variantes: `success`, `warning`, `error`,
`info`, `neutral` (`gray-20` / `gray-50`).

Usos: situação de matrícula (Ativa/Trancada/Transferida), gravidade de
ocorrência (Leve/Média/Grave), estado de tarefa (Pendente/Entregue/Atrasada/
Avaliada), tipo de falta (Justificada/Não justificada).

### Pagination

Setas `‹` `›` em `text-muted`, desabilitadas nos extremos. Páginas como pílulas
de 32px, `radius-md`. Página ativa: `orange-50` de fundo, `orange-600` de texto
— é o destaque laranja do mockup. Reticências para faixas longas.

### PerPageSelect

"Resultados por página" em `caption` `text-muted` + select compacto (12, 24, 48).

### EmptyState

Centralizado no corpo do card, padding vertical 64px: ícone 40px em `gray-35`,
título `h3` `text-primary`, descrição `body` `text-secondary` com no máximo
duas linhas, e um botão primário quando existe ação óbvia.
Texto específico por tela — "Nenhum resultado" genérico é proibido.

### Button

| variante | fundo | texto | borda |
|---|---|---|---|
| primary | `accent-primary` → hover `accent-primary-hover` | branco | — |
| secondary | `bg-surface` | `text-primary` | `border-default` → hover `border-strong` |
| ghost | transparente → hover `gray-20` | `text-secondary` | — |
| danger | `#F04438` → hover `#B42318` | branco | — |

Alturas: `sm` 32px · `md` 40px (padrão) · `lg` 44px. `radius-md`, `body-strong`,
ícone opcional de 16px. Desabilitado: opacidade 50%, `cursor-not-allowed`.
Carregando: spinner substitui o ícone, rótulo permanece.

### FormField

Rótulo `label` `text-primary` acima · controle · texto de ajuda ou erro em
`caption` abaixo. Erro muda borda para `#F04438` e a mensagem para `#B42318`,
com `aria-describedby` e `aria-invalid`. Campo obrigatório marca `*` em
`#F04438` após o rótulo.

Controles: `TextInput`, `TextArea`, `NativeSelect`, `Checkbox`, `Radio`,
`Toggle` — todos altura 40px (exceto TextArea), `radius-md`, mesmo padrão de
foco do Select.

`ReadOnlyField` é o par somente-leitura: rótulo `label` `text-muted` acima,
valor em `body-strong` `text-primary`, **sem moldura**. Campo desabilitado para
exibir dado parece defeito — não use.

### Modal

Overlay `rgba(37, 31, 50, .5)` com blur de 2px. Painel `bg-surface`,
`radius-lg`, `shadow-lg`, largura `sm` 400 / `md` 560 / `lg` 720.
Header com título `h3` e `×`; footer com ações à direita (secundária, depois
primária). Fecha com `Esc` e clique no overlay; foco fica preso dentro do painel
e retorna ao gatilho ao fechar.

### Toast

Canto superior direito, `bg-surface`, `shadow-lg`, `radius-lg`, barra colorida
de 4px à esquerda na cor do estado. Some sozinho em 4s; erro exige fechar.
Toda ação de escrita mockada confirma por toast — é o que dá sensação de sistema
real na apresentação.

### Avatar

Circular, tamanhos 24/32/40/48px. Sem foto: iniciais sobre fundo derivado do
hash do nome, escolhido entre `purple-100`, `orange-100`, `gray-30`, com texto
na variante 700 correspondente. `AvatarGroup` sobrepõe com -8px e borda branca
de 2px, mostrando "+N" após o terceiro.

### Tabs

Usado em páginas de detalhe (aluno, turma). Aba ativa: `text-primary` com
sublinhado de 2px em `accent-primary`. Inativa: `text-muted`, hover
`text-secondary`. Navegável por setas do teclado.

### StatCard

Cartão de indicador para os dashboards: rótulo `label` `text-muted`, valor
`display` `text-primary`, variação opcional em `caption` com seta e cor de
estado. Ícone 20px em círculo `purple-50` no canto superior direito.
Grid de 4 colunas em desktop, 2 em tablet, 1 em mobile.

---

## 6. Padrões de interação

**Formulários.** Rótulo sempre visível acima do campo (nunca só placeholder).
Validação ao sair do campo, não a cada tecla. Ao submeter com erro, foca o
primeiro campo inválido e mostra resumo no topo. Botão primário à direita,
"Cancelar" como ghost à esquerda dele.

**Ações destrutivas.** Sempre confirmam em modal, com o nome do registro no
texto ("Excluir a ocorrência de Ana Beatriz Lima?") e botão `danger`.

**Feedback.** Ação síncrona mockada → toast imediato. Ação com latência
simulada → botão em estado de carregamento. Carregamento de página →
skeleton com a forma do conteúdo, nunca spinner centralizado.

**Latência simulada.** Toda operação mockada passa por um atraso de 300–600ms
em `src/mocks/delay.ts`. Resposta instantânea denuncia o mock na apresentação.

**Somente leitura (perfil aluno).** Campos sem borda e sem fundo, valor em
`body-strong` `text-primary` com rótulo `label` `text-muted` acima. Não use
input desabilitado para exibir dado — parece defeito.

**Ordenação e filtro** não recarregam a tela: só o corpo da tabela troca,
mantendo header, filtros e paginação estáveis.

---

## 7. Acessibilidade

Não é opcional, mesmo em demo.

- **Contraste:** `text-primary` sobre `bg-surface` ≈ 11,8:1. `text-muted` sobre
  `bg-surface` ≈ 4,6:1 — aprovado para texto normal, mas não use `text-muted`
  abaixo de 13px. Branco sobre `accent-primary` ≈ 4,9:1, válido para texto de
  botão. Nunca coloque texto sobre `orange-500`: use `orange-700` sobre
  `orange-50`.
- **Foco visível** em todo elemento interativo: anel de 2px `border-focus` com
  offset de 2px. Remover outline sem substituir é bug bloqueante.
- **Teclado:** toda ação alcançável por Tab. Modal prende o foco. Dropdown
  navega por setas e fecha com `Esc`. Tabela ordenável responde a `Enter`.
- **Semântica:** `<table>` real com `<th scope="col">`. Ícone sem rótulo visível
  leva `aria-label`. Barra de progresso usa `role="progressbar"`.
- **Movimento:** respeite `prefers-reduced-motion` — sob ele, transições vão a
  0ms e o skeleton perde o brilho animado.
- **Zoom:** layout íntegro a 200%.

---

## 8. Mapa de telas

Cada tela declara os componentes que usa. Tela nova só entra neste mapa depois
de listar seus componentes — e eles devem existir na §5.

### Navegação por perfil

| `teacher` | `student` |
|---|---|
| Dashboard | Meu painel |
| Turmas | — |
| Alunos | — |
| Notas | Minhas notas |
| Faltas | Minhas faltas |
| Ocorrências | Minhas ocorrências |
| Tarefas | Minhas tarefas |
| Avisos | Avisos |
| Matrículas | Minha ficha |

Rodapé da sidebar, ambos os perfis: Configurações · Ajuda · Contato.

### Telas comuns

**Login** — única tela sem o shell. Painel centralizado de 400px sobre `bg-app`,
com bloco decorativo em gradiente `purple-500` → `purple-700` à direita em telas
largas. Logo, título `display`, campos e-mail e senha, "Lembrar-me", botão
primário de largura total. **Qualquer credencial entra.** Um seletor discreto
"Entrar como: Professor / Aluno" abaixo do formulário define o perfil da sessão —
é o que permite alternar as visões durante a apresentação.
· `Card`, `FormField`, `Button`

**Avisos** — lista cronológica de comunicados. Cada item: título `h3`, autor e
data em `caption`, trecho do corpo, `StatusBadge` de prioridade. Não lidos com
um ponto `accent-primary` de 8px antes do título. (Era uma barra de 4px à
esquerda; virou ponto porque borda lateral colorida acima de 1px é um clichê de
callout que o piso de qualidade recusa, e o ponto lê melhor em lista densa.) `teacher` vê botão "Novo aviso"
que abre Modal com formulário; `student` apenas lê.
· `PageHeader`, `Card`, `StatusBadge`, `Button`, `Modal`, `FormField`, `EmptyState`

### Perfil `teacher`

**Dashboard** — quatro `StatCard` (alunos ativos, média geral, frequência do mês,
ocorrências abertas), gráfico de média por turma, lista de avisos recentes e
tabela de tarefas com entregas pendentes.
· `PageHeader`, `StatCard`, `Card`, `DataTable`, `GradeBar`

**Turmas** — grade de cards, um por turma: nome, série, turno, contagem de
alunos, média com `GradeBar`. Clique abre o detalhe da turma em `Tabs`
(Alunos · Notas · Frequência · Tarefas).
· `PageHeader`, `Card`, `GradeBar`, `Tabs`, `DataTable`, `Avatar`

**Alunos** — `DataTable` com avatar+nome, matrícula, turma, média, frequência,
situação. Filtros por turma e situação; busca por nome. Clique abre a ficha.
· `PageHeader`, `Card`, `FilterBar`, `DataTable`, `Avatar`, `GradeBar`, `StatusBadge`, `Pagination`

**Notas** — a tela do mockup, traduzida para o CIL. Header do card com o nome da
turma e três filtros: turma, habilidade, ordenação. **Dois modos, resolvidos
pelo filtro de habilidade:**

- *Uma habilidade* → Nome (avatar+nome) · Matrícula · Turma · Nota editável com
  barra · Média. É o mockup de referência, praticamente 1:1.
- *Todas as habilidades* → as cinco em colunas compactas, mais a média com
  barra. Densa de propósito: é onde o perfil do aluno aparece.

A célula de nota edita no lugar, aceita vírgula ou ponto, valida de 0 a 10,
salva de forma otimista e confirma por toast. A média nunca é editável.
· `Breadcrumb`, `PageHeader`, `Card`, `Select`, `DataTable`, `Avatar`, `GradeCell`, `Pagination`, `EmptyState`

**Faltas** — duas modalidades em `Tabs`. *Chamada*: lista da turma no dia, com
`Toggle` presente/ausente por aluno e ação em massa "Marcar todos presentes".
*Histórico*: `DataTable` com aluno, total de faltas, % de frequência
(`GradeBar` na escala de frequência) e badge de justificada.
· `PageHeader`, `Tabs`, `Card`, `FilterBar`, `DataTable`, `Toggle`, `GradeBar`, `StatusBadge`

**Ocorrências** — `DataTable` com data, aluno, tipo, gravidade (`StatusBadge`),
registrado por, situação. Botão "Nova ocorrência" abre Modal. Clique na linha
expande a descrição completa e as providências.
· `PageHeader`, `Card`, `FilterBar`, `DataTable`, `StatusBadge`, `Button`, `Modal`, `FormField`

**Tarefas** — cards de tarefa com título, turma, prazo, e barra de progresso de
entregas ("18 de 24 entregues"). Detalhe traz `DataTable` de entregas por aluno
com estado e campo de nota.
· `PageHeader`, `Card`, `GradeBar`, `DataTable`, `StatusBadge`, `Modal`, `FormField`

**Matrículas** — `DataTable` de fichas com matrícula, nome, turma, responsável,
situação, data. Abrir uma ficha leva ao formulário completo em seções: dados do
aluno, filiação, endereço, contato, dados escolares, documentos. "Nova
matrícula" usa o mesmo formulário em branco.
· `PageHeader`, `Card`, `FilterBar`, `DataTable`, `StatusBadge`, `FormField`, `Button`, `Tabs`

### Perfil `student`

O shell é idêntico; muda o conteúdo e o modo somente leitura.

**Meu painel** — `StatCard` com média geral, frequência, tarefas pendentes e
ocorrências. Abaixo: próximas entregas e avisos recentes.
· `PageHeader`, `StatCard`, `Card`, `GradeBar`

**Minhas notas** — `DataTable` por disciplina: disciplina, avaliações do
bimestre, média (`GradeBar`), situação. Filtro por bimestre. Sem edição.
· `PageHeader`, `Card`, `FilterBar`, `DataTable`, `GradeBar`, `StatusBadge`

**Minhas faltas** — resumo de frequência com `GradeBar` no topo e `DataTable`
de faltas por data e disciplina, com badge de justificativa.
· `PageHeader`, `Card`, `DataTable`, `GradeBar`, `StatusBadge`

**Minhas tarefas** — cards agrupados em `Tabs` (Pendentes · Entregues ·
Avaliadas). Tarefa avaliada mostra a nota com `GradeBar` e o comentário do
professor. Botão "Entregar" abre Modal — a única escrita permitida ao aluno.
· `PageHeader`, `Tabs`, `Card`, `StatusBadge`, `GradeBar`, `Modal`, `Button`

**Minhas ocorrências** — lista cronológica somente leitura, com data, tipo,
gravidade e descrição. `EmptyState` positivo quando não há nenhuma.
· `PageHeader`, `Card`, `StatusBadge`, `EmptyState`

**Minha ficha** — mesma estrutura da ficha de matrícula, em modo leitura
conforme §6.
· `PageHeader`, `Card`, `Tabs`

---

## 9. Estrutura de arquivos

```
src/
  components/        # componentes da §5, um diretório por componente
  features/          # uma pasta por área: grades, attendance, incidents,
                     # assignments, announcements, enrollment, classes
  layouts/           # AppShell, AuthLayout
  pages/             # uma página por rota, compondo features
  mocks/             # dados fake + delay.ts
  lib/               # grade.ts, format.ts, hash.ts
  styles/            # tokens.css, globals.css
  routes.tsx
```

Regras: um componente por arquivo; arquivo acima de ~200 linhas é sinal de que
faz coisa demais. `features/` não importa de `pages/`. `components/` não importa
de `features/` — componentes são genéricos e não conhecem o domínio.

---

## 10. Checklist de implementação

Antes de considerar qualquer tela pronta:

- [ ] Nenhum valor hex, px de cor ou fonte literal no JSX — só tokens.
- [ ] Nenhum espaçamento fora da escala de 4px.
- [ ] Lato carregada, pesos 400/500/700, nenhuma outra família.
- [ ] Colunas numéricas com `tabular-nums`.
- [ ] Cor de desempenho vinda de `gradeLevel()`, nunca calculada no componente.
- [ ] Toda cor semântica acompanhada de número, rótulo ou ícone.
- [ ] Tabela com os quatro estados: normal, carregando, vazio, erro.
- [ ] `EmptyState` com texto específico da tela.
- [ ] Toda ação de escrita confirma por toast; destrutiva confirma por modal.
- [ ] Operações mockadas com atraso de 300–600ms.
- [ ] Navegação completa por teclado; foco visível em tudo.
- [ ] Modal prende o foco, fecha com `Esc`, devolve o foco ao gatilho.
- [ ] Contraste verificado; `text-muted` nunca abaixo de 13px.
- [ ] Sem scroll horizontal de página em 1280, 1024 e 375px.
- [ ] Layout íntegro a 200% de zoom.
- [ ] Dado mock plausível: nomes brasileiros, notas 0–10, volume suficiente
      para a paginação existir.
- [ ] Componentes usados constam da §5; qualquer componente novo foi adicionado
      a este documento no mesmo PR.
- [ ] `npm run smoke` verde: toda rota renderiza de verdade nos dois perfis.
      Build e typecheck só provam que compila.

---

## 11. Decisões registradas

| Decisão | Motivo |
|---|---|
| Escalas 50–900 derivadas das 3 cores de marca | Um tom só não cobre hover, borda, fundo suave e estado pressionado. |
| Cinza com matiz roxo, não neutro | As três cinzas fornecidas já têm matiz ~260°; cinza neutro ao lado sujaria a paleta. |
| Verde/amarelo/vermelho adicionados | O mockup os usa nas barras de nota e o color scheme não os trazia. |
| Sidebar em `gray-90`, não `gray-80` | No mockup a sidebar é mais escura que o item ativo; `gray-80` vira o item ativo. |
| Cortes de nota em 8,5 / 6,0 / 5,0 | 6,0 é a média de aprovação e 5,0 separa recuperação de reprovação; os limites batem com todos os valores do mockup. |
| Notas 0–10, não percentuais | Contexto brasileiro. O percentual fica só na barra. |
| Duas camadas de token | Rebrand ou dark mode vira a troca de um arquivo. |
| Latência mockada de 300–600ms | Resposta instantânea denuncia o mock na apresentação. |
| Seletor de perfil no login | Permite alternar entre professor e aluno ao vivo sem tela de administração. |
