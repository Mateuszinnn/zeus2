# Zeus

Sistema de gestão escolar **front-end apenas, 100% mockado**, para demonstração
comercial a escolas. React + Vite + TypeScript + Tailwind CSS.
Sem backend, sem persistência. Dois perfis: `teacher` e `student`.

## Os três documentos, e quem manda em quê

Leia os três antes de criar ou alterar qualquer tela, componente ou estilo.
Cada um é autoridade sobre um assunto; quando o código divergir deles, eles
estão certos.

| Documento | Autoridade sobre |
|---|---|
| [PRODUCT.md](PRODUCT.md) | Verdade de produto: usuários, propósito, contexto de uso, restrições, marca, princípios. |
| [DESIGN.md](DESIGN.md) | O mundo visual e seus invariantes. É o que o Impeccable lê. |
| [docs/superpowers/specs/2026-09-28-design-system-design.md](docs/superpowers/specs/2026-09-28-design-system-design.md) | O contrato de implementação: valores exatos dos tokens, anatomia de cada componente, mapa de telas, estrutura de arquivos, checklist. |

Regra de conflito: `DESIGN.md` decide **o que** o sistema parece e por quê; o
design system decide **com quais valores** isso vira código. Se um valor
aparecer nos dois e divergir, o design system está certo — corrija o `DESIGN.md`.

`DESIGN.md` está em modo **seed** (frontmatter mínimo, sem seção Components).
Quando houver código real, rode `/impeccable document` para a passada de
extração, que preenche os tokens machine-readable e gera o sidecar.

## Impeccable

Instalado para guiar o desenvolvimento de frontend: skill com 24 comandos,
61 regras determinísticas de detecção e hook automático.

- O hook roda em `PostToolUse` (Edit/Write) e `Stop`, configurado no
  `.claude/settings.json` versionado. Ele se auto-desativa quando o skill não
  está presente, então o repo funciona sem ele.
- O payload do skill é **gitignored** (15MB de binário). Depois de um clone,
  reinstale com:
  ```
  npx impeccable install --providers=claude --scope=project
  ```
- Comandos úteis: `/impeccable shape <tela>` antes de construir,
  `/impeccable critique` e `/impeccable audit` para revisar,
  `/impeccable polish` antes de fechar. Varredura manual:
  `npx impeccable detect`.

## Regras que mais se violam sem perceber

- Nada de hex, px de cor ou família de fonte literal no JSX — só tokens semânticos.
- Espaçamento só na escala de 4px.
- Cor de desempenho sempre vinda de `gradeLevel()` em `src/lib/grade.ts`.
- Cor nunca sozinha: sempre com número, rótulo ou ícone.
- Numerais tabulares em toda coluna numérica.
- Toda tabela precisa dos quatro estados: normal, carregando, vazio, erro.
- Operação mockada passa por `src/mocks/delay.ts` (300–600ms).
- A marca é **Zeus**. "Edu.Link" é marca de terceiro do mockup de referência e
  não aparece em lugar nenhum.

O §10 do design system é o checklist a rodar antes de dar qualquer tela por pronta.
