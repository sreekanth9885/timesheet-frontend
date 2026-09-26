import { useMemo, useState } from "react";

import { useGetAuditLogsQuery } from "../services/auditLogsApi";
import type { AuditLog, AuditLogFilters } from "../types/auditLogTypes";
import { AuditLogTable } from "../components/auditlogs/AuditLogTable";
import { AuditLogDetailsModal } from "../components/auditlogs/AuditLogDetailsModal";
import { AuditLogFilters as Filters } from "../components/auditlogs/AuditLogFilters";
const INITIAL_FILTERS: AuditLogFilters = { search: "", action: "" };

export default function AuditLogsPage() {
  const [filters, setFilters] = useState<AuditLogFilters>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<AuditLog | null>(null);

  const { data: logs = [], isLoading, isError } = useGetAuditLogsQuery();

  // Client-side filtering — matches original behaviour
  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return logs.filter((l) => {
      const matchesSearch =
        !q ||
        l.action?.toLowerCase().includes(q) ||
        l.table_name?.toLowerCase().includes(q) ||
        l.first_name?.toLowerCase().includes(q);
      const matchesAction = !filters.action || l.action === filters.action;
      return matchesSearch && matchesAction;
    });
  }, [logs, filters.search, filters.action]);

  const updateFilters = (patch: Partial<AuditLogFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1); // reset pagination on any filter change
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Security &amp; Audit Logs
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Immutable system audit trail tracking authentication, approvals, and
          mutations.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Filters filters={filters} onChange={updateFilters} />

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading audit trail...
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Failed to load audit logs from server.
          </div>
        ) : (
          <AuditLogTable
            logs={filtered}
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
            onInspect={setSelected}
          />
        )}
      </div>

      <AuditLogDetailsModal log={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
