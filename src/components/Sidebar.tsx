// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
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
} from "lucide-react";

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  const links: NavItem[] = [
    {
      id: "dashboard",
      path: "/dashboard",
      label: "Dashboard",
      roles: ["admin", "employee"],
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "timesheets",
      path: "/timesheets",
      label: "Timesheets",
      roles: ["admin", "employee"],
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: "tasks",
      path: "/tasks",
      label: "Tasks",
      roles: ["admin", "employee"],
      icon: <ListTodo className="w-5 h-5" />,
    },
    {
      id: "projects",
      path: "/projects",
      label: "Projects",
      roles: ["admin"],
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      id: "employees",
      path: "/employees",
      label: "Employees",
      roles: ["admin"],
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "departments",
      path: "/departments",
      label: "Departments",
      roles: ["admin"],
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: "approvals",
      path: "/approvals",
      label: "Approvals",
      roles: ["admin"],
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      id: "overtime",
      path: "/overtime",
      label: "Overtime",
      roles: ["admin", "employee"],
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      id: "reports",
      path: "/reports",
      label: "Reports",
      roles: ["admin"],
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "settings",
      path: "/settings",
      label: "Settings",
      roles: ["admin"],
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "auditLogs",
      path: "/auditLogs",
      label: "Audit Logs",
      roles: ["admin"],
      icon: <ClipboardList className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="p-2 bg-blue-600 text-white rounded-lg">
          <Clock width={20} height={20} />
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          TimePro
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links
          .filter((link) => link.roles.includes(user.role))
          .map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
