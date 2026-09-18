// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Timesheets from "./pages/Timesheets";
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
            <Route
              path="/employees"
              element={<div>Employees Placeholder</div>}
            />
            <Route
              path="/departments"
              element={<div>Departments Placeholder</div>}
            />
            <Route path="/projects" element={<div>Projects Placeholder</div>} />
            <Route path="/tasks" element={<div>Tasks Placeholder</div>} />
            <Route path="/timesheets" element={<Timesheets />} />
            <Route
              path="/approvals"
              element={<div>Approvals Placeholder</div>}
            />
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
