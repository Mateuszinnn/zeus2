import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { ToastProvider } from "@/components/Toast";
import { SessionProvider, useSession } from "@/mocks/session";

import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Turmas } from "@/pages/Turmas";
import { Alunos } from "@/pages/Alunos";
import { Notas } from "@/pages/Notas";
import { Faltas } from "@/pages/Faltas";
import { Ocorrencias } from "@/pages/Ocorrencias";
import { Tarefas } from "@/pages/Tarefas";
import { Avisos } from "@/pages/Avisos";
import { Matriculas } from "@/pages/Matriculas";
import { Ajuda, Configuracoes, Contato } from "@/pages/Suporte";

import { MeuPainel } from "@/pages/MeuPainel";
import { MinhasNotas } from "@/pages/aluno/MinhasNotas";
import { MinhasFaltas } from "@/pages/aluno/MinhasFaltas";
import { MinhasTarefas } from "@/pages/aluno/MinhasTarefas";
import { MinhasOcorrencias } from "@/pages/aluno/MinhasOcorrencias";
import { MinhaFicha } from "@/pages/aluno/MinhaFicha";

function Home() {
  const { role } = useSession();
  if (!role) return <Navigate to="/entrar" replace />;
  return (
    <Navigate to={role === "student" ? "/meu-painel" : "/painel"} replace />
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/entrar" element={<Login />} />

      <Route element={<AppShell />}>
        {/* Professor */}
        <Route path="/painel" element={<Dashboard />} />
        <Route path="/turmas" element={<Turmas />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/notas" element={<Notas />} />
        <Route path="/faltas" element={<Faltas />} />
        <Route path="/ocorrencias" element={<Ocorrencias />} />
        <Route path="/tarefas" element={<Tarefas />} />
        <Route path="/matriculas" element={<Matriculas />} />

        {/* Aluno */}
        <Route path="/meu-painel" element={<MeuPainel />} />
        <Route path="/minhas-notas" element={<MinhasNotas />} />
        <Route path="/minhas-faltas" element={<MinhasFaltas />} />
        <Route path="/minhas-tarefas" element={<MinhasTarefas />} />
        <Route path="/minhas-ocorrencias" element={<MinhasOcorrencias />} />
        <Route path="/minha-ficha" element={<MinhaFicha />} />

        {/* Compartilhadas */}
        <Route path="/avisos" element={<Avisos />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/ajuda" element={<Ajuda />} />
        <Route path="/contato" element={<Contato />} />
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </SessionProvider>
  );
}
