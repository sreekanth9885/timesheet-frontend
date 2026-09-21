import { useEffect, useState } from "react";
import type { TaskFilters } from "../types/taskTypes";

const INITIAL: TaskFilters = {
  search: "",
  project_id: "",
  status: "",
  priority: "",
};

export function useTaskFilters(onReset?: () => void) {
  const [filters, setFilters] = useState<TaskFilters>(INITIAL);

  const update = (patch: Partial<TaskFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  // Reset pagination whenever remote filters change
  useEffect(() => {
    onReset?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.project_id, filters.status, filters.priority, filters.search]);

  const reset = () => setFilters(INITIAL);

  return { filters, update, reset };
}
