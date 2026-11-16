// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { RootState } from "../store";
import {
  LayoutDashboard,
  Clock,
  ListTodo,
  Briefcase,
  Users,
  Building2,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  X,
  Shield, // ← NEW icon for Organization Approvals
} from "lucide-react";

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: ReactNode;
  roles: string[];
}

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

const Sidebar = ({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  const links: NavItem[] = [
    // ─── Super Admin only ──────────────────────────────────────
    {
      id: "organizationApprovals",
      path: "/super-admin/organizations",
      label: "Organization Approvals",
      roles: ["super_admin"],
      icon: <Shield className="w-5 h-5 shrink-0" />,
    },

    // ─── Shared items — super_admin added to each roles array ──
    {
      id: "dashboard",
      path: "/dashboard",
      label: "Dashboard",
      roles: ["super_admin", "admin", "employee"],
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      id: "timesheets",
      path: "/timesheets",
      label: "Timesheets",
      roles: ["super_admin", "admin", "employee"],
      icon: <Clock className="w-5 h-5 shrink-0" />,
    },
    {
      id: "tasks",
      path: "/tasks",
      label: "Tasks",
      roles: ["super_admin", "admin", "employee"],
      icon: <ListTodo className="w-5 h-5 shrink-0" />,
    },
    {
      id: "projects",
      path: "/projects",
      label: "Projects",
      roles: ["super_admin", "admin"],
      icon: <Briefcase className="w-5 h-5 shrink-0" />,
    },
    {
      id: "employees",
      path: "/employees",
      label: "Employees",
      roles: ["super_admin", "admin"],
      icon: <Users className="w-5 h-5 shrink-0" />,
    },
    {
      id: "departments",
      path: "/departments",
      label: "Departments",
      roles: ["super_admin", "admin"],
      icon: <Building2 className="w-5 h-5 shrink-0" />,
    },
    {
      id: "approvals",
      path: "/approvals",
      label: "Approvals",
      roles: ["super_admin", "admin"],
      icon: <CheckCircle className="w-5 h-5 shrink-0" />,
    },
    {
      id: "overtime",
      path: "/overtime",
      label: "Overtime",
      roles: ["super_admin", "admin", "employee"],
      icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
    },
    {
      id: "reports",
      path: "/reports",
      label: "Reports",
      roles: ["super_admin", "admin"],
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
    },
    {
      id: "settings",
      path: "/settings",
      label: "Settings",
      roles: ["super_admin", "admin"],
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
    {
      id: "auditLogs",
      path: "/auditLogs",
      label: "Audit Logs",
      roles: ["super_admin", "admin"],
      icon: <ClipboardList className="w-5 h-5 shrink-0" />,
    },
  ];

  const visibleLinks = links.filter((link) => link.roles.includes(user.role));

  return (
    <>
      {/* ================================
          MOBILE OVERLAY
          ================================ */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* ================================
          SIDEBAR
          ================================ */}
      <aside
        className={`
          fixed lg:relative
          inset-y-0 left-0
          z-50 lg:z-auto
          h-screen
          flex flex-col
          bg-white
          border-r border-gray-200
          shadow-sm

          w-64
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}

          transition-all
          duration-300
          ease-in-out

          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* ================================
            SIDEBAR TOP / LOGO AREA
            ================================ */}
        <div className="h-16 shrink-0 border-b border-gray-100">
          {/* DESKTOP HEADER */}
          <div className="hidden lg:flex h-full w-full items-center">
            {isCollapsed ? (
              <div className="w-full h-full flex items-center justify-center">
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  aria-label="Expand sidebar"
                  title="Expand sidebar"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-between px-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">
                    TimePro
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* MOBILE HEADER */}
          <div className="flex lg:hidden h-full w-full items-center justify-between px-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">
                TimePro
              </span>
            </div>
            <button
              type="button"
              onClick={onCloseMobile}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Close navigation menu"
              title="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================
            NAVIGATION
            ================================ */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              onClick={onCloseMobile}
              title={isCollapsed ? link.label : undefined}
              className={({ isActive }) =>
                `
                  flex
                  items-center
                  min-h-[42px]
                  rounded-lg
                  text-sm
                  font-medium
                  transition-colors

                  ${isCollapsed ? "lg:justify-center lg:px-0" : "gap-3 px-3"}

                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `
              }
            >
              {link.icon}
              <span
                className={`
                  whitespace-nowrap
                  transition-all
                  duration-200
                  ${isCollapsed ? "lg:hidden" : ""}
                `}
              >
                {link.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
