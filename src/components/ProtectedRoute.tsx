// src/components/ProtectedRoute.tsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice";

type Role = "super_admin" | "admin" | "employee";

export default function ProtectedRoute({
  requiredRole,
}: {
  requiredRole?: Role | Role[];
}) {
  const user = useSelector(selectUser);

  if (!user) return <Navigate to="/login" replace />;

  const roles = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
      ? [requiredRole]
      : null;

  if (roles && !roles.includes(user.role)) {
    // Send them to the home they *are* allowed to see.
    const fallback =
      user.role === "super_admin" ? "/super-admin/organizations" : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  // Works as a layout route, so nested <Route> children render.
  return <Outlet />;
}
