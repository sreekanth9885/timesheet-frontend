import { useEffect, useState } from "react";
import type { ProjectFilters } from "../types/projectTypes";

const INITIAL: ProjectFilters = { search: "", status: "" };

export function useProjectFilters(onReset?: () => void) {
  const [filters, setFilters] = useState<ProjectFilters>(INITIAL);

  const update = (patch: Partial<ProjectFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    onReset?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.status]);

  const reset = () => setFilters(INITIAL);
  return { filters, update, reset };
}
