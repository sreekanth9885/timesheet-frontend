import { useEffect, useState } from "react";
import type { EmployeeFilters } from "../types/employeeTypes";

const INITIAL: EmployeeFilters = {
  search: "",
  department_id: "",
  status: "",
};

export function useEmployeeFilters(onReset?: () => void) {
  const [filters, setFilters] = useState<EmployeeFilters>(INITIAL);

  const update = (patch: Partial<EmployeeFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    onReset?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.department_id, filters.status]);

  const reset = () => setFilters(INITIAL);
  return { filters, update, reset };
}
