# Zeus2

Sistema escolar **front-end apenas, 100% mockado**, para apresentação.
React + Vite + TypeScript + Tailwind CSS. Sem backend, sem persistência.

## Design system — leitura obrigatória

Antes de criar ou alterar qualquer tela, componente ou estilo, leia
[docs/superpowers/specs/2026-09-28-design-system-design.md](docs/superpowers/specs/2026-09-28-design-system-design.md).

É documento normativo. Quando o código divergir dele, o documento está certo.
Componente novo que não esteja na §5 exige atualizar o documento no mesmo commit.

Regras que mais se violam sem perceber:

- Nada de hex, px de cor ou família de fonte literal no JSX — só tokens semânticos.
- Espaçamento só na escala de 4px.
- Cor de desempenho sempre vinda de `gradeLevel()` em `src/lib/grade.ts`.
- Cor nunca sozinha: sempre com número, rótulo ou ícone.
- Toda tabela precisa dos quatro estados: normal, carregando, vazio, erro.
- Operação mockada passa por `src/mocks/delay.ts` (300–600ms).

O §10 do documento é o checklist a rodar antes de dar qualquer tela por pronta.
