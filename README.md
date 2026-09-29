# Zeus

Sistema de gestão para **Centro Interescolar de Línguas**, curso de inglês.
Notas por habilidade, frequência, tarefas, ocorrências, avisos e matrícula, nas
visões do professor e do aluno.

> **Protótipo de demonstração.** Front-end apenas, sem backend e sem banco.
> Todos os dados são fictícios e vivem em memória — nenhum nome corresponde a
> pessoa real e nenhum número descreve um CIL existente. O login aceita
> qualquer credencial.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Na tela de entrada, o seletor **"Entrar como"**
alterna entre a visão da professora e a do aluno — é o que permite mostrar os
dois lados ao vivo.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento. |
| `npm run build` | Checagem de tipos e bundle de produção em `dist/`. |
| `npm run preview` | Serve o bundle de produção localmente. |
| `npm run typecheck` | Só a checagem de tipos. |
| `npm run smoke` | Renderiza as 20 rotas nos dois perfis e falha se alguma quebrar. |
| `npm run shots` | Captura todas as telas em 1440 e 390px, e reporta erro de console e rolagem horizontal. Exige o `dev` no ar e o Edge instalado. |

`build` e `smoke` provam que a tela **abre**, nunca que ela está certa.
`shots` existe porque foi ele que revelou que a tabela de notas não exibia nota
nenhuma no telefone, com todas as outras verificações verdes.

## Publicar no Vercel

O repositório já traz `vercel.json` com o **rewrite de SPA** — sem ele, abrir
`/notas` direto ou dar refresh resulta em 404, porque o servidor procura um
arquivo que não existe.

1. Em [vercel.com/new](https://vercel.com/new), importe este repositório.
2. O Vercel detecta Vite sozinho. Não é preciso mudar nada nem definir variável
   de ambiente: não há backend.
3. Clique em **Deploy**.

Cada `git push` na `main` publica em produção; qualquer outra branch vira um
preview com URL própria.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · React Router · Lato.

## Documentação do projeto

| Arquivo | Autoridade sobre |
|---|---|
| [PRODUCT.md](PRODUCT.md) | Verdade de produto: usuários, propósito, contexto, restrições. |
| [DESIGN.md](DESIGN.md) | O mundo visual e seus invariantes. |
| [docs/superpowers/specs/2026-09-28-design-system-design.md](docs/superpowers/specs/2026-09-28-design-system-design.md) | Contrato de implementação: tokens, componentes, mapa de telas, checklist. |
| [CLAUDE.md](CLAUDE.md) | Instruções para agentes que trabalharem no repo. |
