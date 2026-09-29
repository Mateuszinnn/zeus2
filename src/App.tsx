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
  if (!role) return <Navigate to="/sign-in" replace />;
  return (
    <Navigate to={role === "student" ? "/my-dashboard" : "/dashboard"} replace />
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<Login />} />

      <Route element={<AppShell />}>
        {/* Professor */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classes" element={<Turmas />} />
        <Route path="/students" element={<Alunos />} />
        <Route path="/grades" element={<Notas />} />
        <Route path="/attendance" element={<Faltas />} />
        <Route path="/incidents" element={<Ocorrencias />} />
        <Route path="/assignments" element={<Tarefas />} />
        <Route path="/enrollments" element={<Matriculas />} />

        {/* Aluno */}
        <Route path="/my-dashboard" element={<MeuPainel />} />
        <Route path="/my-grades" element={<MinhasNotas />} />
        <Route path="/my-attendance" element={<MinhasFaltas />} />
        <Route path="/my-assignments" element={<MinhasTarefas />} />
        <Route path="/my-incidents" element={<MinhasOcorrencias />} />
        <Route path="/my-record" element={<MinhaFicha />} />

        {/* Compartilhadas */}
        <Route path="/announcements" element={<Avisos />} />
        <Route path="/settings" element={<Configuracoes />} />
        <Route path="/help" element={<Ajuda />} />
        <Route path="/contact" element={<Contato />} />
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
