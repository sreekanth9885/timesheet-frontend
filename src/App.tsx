// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Timesheets from "./pages/Timesheets";
import TasksPage from "./pages/TasksPage";
import ProjectsPage from "./pages/ProjectsPage";
import EmployeesPage from "./pages/EmployeesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ApprovalsPage from "./pages/ApprovalsPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<div>Dashboard Placeholder</div>}
            />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/timesheets" element={<Timesheets />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/overtime" element={<div>Overtime Placeholder</div>} />
            <Route path="/reports" element={<div>Reports Placeholder</div>} />
            <Route path="/settings" element={<div>Settings Placeholder</div>} />
            <Route
              path="/auditLogs"
              element={<div>Audit Logs Placeholder</div>}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
