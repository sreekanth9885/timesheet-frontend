// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Timesheets from "./pages/Timesheets";
import TasksPage from "./pages/TasksPage";
import ProjectsPage from "./pages/ProjectsPage";
import EmployeesPage from "./pages/EmployeesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import DashboardPage from "./pages/DashboardPage";
import OvertimePage from "./pages/OvertimePage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import OrganizationApprovals from "./pages/superadmin/OrganizationApprovals";

import { selectUser } from "./features/auth/authSlice";
import { useDocumentTitle } from "./hooks/useDocumentTitle";

function RootRedirect() {
  const user = useSelector(selectUser);
  return (
    <Navigate
      to={
        user?.role === "super_admin"
          ? "/super-admin/organizations"
          : "/dashboard"
      }
      replace
    />
  );
}

function App() {
  useDocumentTitle();
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Public ─────────────────────────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ─── Authenticated shell (sidebar layout) ───────── */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<RootRedirect />} />

          <Route element={<AppLayout />}>
            {/* Super-admin-only page — nested inside the layout */}
            <Route element={<ProtectedRoute requiredRole="super_admin" />}>
              <Route
                path="/super-admin/organizations"
                element={<OrganizationApprovals />}
              />
            </Route>

            {/* Org admin + employee pages */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/timesheets" element={<Timesheets />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/overtime" element={<OvertimePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/auditLogs" element={<AuditLogsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
