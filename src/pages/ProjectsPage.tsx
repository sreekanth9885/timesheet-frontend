import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useProjectFilters } from "../hooks/useProjectFilters";
import type { Project, ProjectViewMode } from "../types/projectTypes";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from "../services/projectsApi";
import { ProjectGrid } from "../components/projects/ProjectGrid";
import { ProjectTable } from "../components/projects/ProjectTable";
import { ProjectFilters } from "../components/projects/ProjectFilters";
import { ProjectModal } from "../components/projects/ProjectModal";
import { TeamModal } from "../components/projects/TeamModal";
import { useAppSelector } from "../store/hooks";

export default function ProjectsPage() {
  const isAdmin = useAppSelector((s) => s.auth.user?.role === "admin");

  const [viewMode, setViewMode] = useState<ProjectViewMode>("grid");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [teamOpen, setTeamOpen] = useState(false);
  const [teamProject, setTeamProject] = useState<Project | null>(null);

  const { filters, update } = useProjectFilters(() => setPage(1));

  const { data: projects = [], isLoading, isError } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const s = filters.status;
    return projects.filter((p) => {
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.project_code?.toLowerCase().includes(q) ||
        p.client_name?.toLowerCase().includes(q);
      const matchesStatus = !s || p.status === s;
      return matchesSearch && matchesStatus;
    });
  }, [projects, filters.search, filters.status]);

  const handleAdd = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setModalOpen(true);
  };

  const handleManageTeam = (p: Project) => {
    setTeamProject(p);
    setTeamOpen(true);
  };

  const handleDelete = async (p: Project) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(p.id).unwrap();
      toast.success("Project deleted successfully");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to delete project";
      toast.error(msg);
    }
  };

  const changePageSize = (s: number) => {
    setPageSize(s);
    setPage(1);
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12 text-gray-500">
          Loading projects...
        </div>
      );
    }
    if (isError) {
      return (
        <div className="text-center py-12 text-red-500">
          Failed to fetch projects from server.
        </div>
      );
    }
    return viewMode === "grid" ? (
      <ProjectGrid
        projects={filtered}
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        isAdmin={isAdmin}
        onPageChange={setPage}
        onPageSizeChange={changePageSize}
        onEdit={handleEdit}
        onManageTeam={handleManageTeam}
      />
    ) : (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ProjectTable
          projects={filtered}
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          isAdmin={isAdmin}
          onPageChange={setPage}
          onPageSizeChange={changePageSize}
          onEdit={handleEdit}
          onManageTeam={handleManageTeam}
          onDelete={handleDelete}
        />
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track project timelines, resource allocation, budget utilization,
            and task progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`px-3 py-2 ${
                viewMode === "grid"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <svg
                width={18}
                height={18}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`px-3 py-2 border-l border-gray-200 ${
                viewMode === "table"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <svg
                width={18}
                height={18}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              <svg
                width={18}
                height={18}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              Add Project
            </button>
          )}
        </div>
      </div>

      {/* Filters card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ProjectFilters filters={filters} onChange={update} />
      </div>

      {/* Content */}
      {renderBody()}

      <ProjectModal
        open={modalOpen}
        project={editingProject}
        onClose={() => {
          setModalOpen(false);
          setEditingProject(null);
        }}
      />

      <TeamModal
        open={teamOpen}
        project={teamProject}
        onClose={() => {
          setTeamOpen(false);
          setTeamProject(null);
        }}
      />
    </div>
  );
}
