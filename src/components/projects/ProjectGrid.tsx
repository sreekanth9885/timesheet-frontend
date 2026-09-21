import type { Project } from "../../types/projectTypes";
import { Pagination } from "../tasks/Pagination";
import { ProjectCard } from "./ProjectCard";

interface Props {
  projects: Project[];
  page: number;
  pageSize: number;
  total: number;
  isAdmin: boolean;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onEdit: (p: Project) => void;
  onManageTeam: (p: Project) => void;
}

export function ProjectGrid({
  projects,
  page,
  pageSize,
  total,
  isAdmin,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onManageTeam,
}: Props) {
  if (total === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 text-center py-12 text-gray-500">
        No projects found matching the criteria.
      </div>
    );
  }

  const start = (page - 1) * pageSize;
  const paged = projects.slice(start, start + pageSize);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {paged.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onManageTeam={onManageTeam}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-6">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </>
  );
}
