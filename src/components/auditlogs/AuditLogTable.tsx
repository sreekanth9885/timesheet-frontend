import type { AuditLog } from "../../types/auditLogTypes";
import {
  formatTimestamp,
  getActionBadge,
  getActorLabel,
} from "../../utils/auditLogHelpers";
import { Pagination } from "../tasks/Pagination";

interface Props {
  logs: AuditLog[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onInspect: (log: AuditLog) => void;
}

export function AuditLogTable({
  logs,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onInspect,
}: Props) {
  if (total === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No audit log entries found.
      </div>
    );
  }

  const start = (page - 1) * pageSize;
  const pageRows = logs.slice(start, start + pageSize);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Timestamp</th>
              <th className="text-left px-4 py-3 font-medium">User / Actor</th>
              <th className="text-left px-4 py-3 font-medium">Action</th>
              <th className="text-left px-4 py-3 font-medium">Entity Target</th>
              <th className="text-left px-4 py-3 font-medium">Client IP</th>
              <th className="text-left px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="font-mono text-[12px] text-gray-500">
                    {formatTimestamp(log.created_at)}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {getActorLabel(log)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${getActionBadge(
                      log.action,
                    )}`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-gray-800">
                    {log.table_name ?? "System"}
                  </span>
                  {log.record_id && (
                    <span className="text-[11px] font-mono text-gray-500 ml-1">
                      #{log.record_id}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-[12px] text-gray-500">
                    {log.ip_address ?? "127.0.0.1"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onInspect(log)}
                    className="px-2 py-1 text-xs font-medium rounded-md border border-gray-200 hover:bg-gray-100"
                  >
                    Inspect Diff
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </>
  );
}
