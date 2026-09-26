import type { AuditLog } from "../../types/auditLogTypes";
import { formatTimestamp, getActionBadge } from "../../utils/auditLogHelpers";
import { JsonDiffPanel } from "./JsonDiffPanel";

interface Props {
  log: AuditLog | null;
  onClose: () => void;
}

export function AuditLogDetailsModal({ log, onClose }: Props) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">
            Audit Entry #{log.id} Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <span className="font-semibold text-gray-700">Timestamp:</span>{" "}
              <span className="text-gray-600">
                {formatTimestamp(log.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Action:</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${getActionBadge(
                  log.action,
                )}`}
              >
                {log.action}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Target Table:</span>{" "}
              <span className="text-gray-600">{log.table_name ?? "—"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Record ID:</span>{" "}
              <span className="text-gray-600">#{log.record_id ?? "N/A"}</span>
            </div>
            <div className="col-span-2">
              <span className="font-semibold text-gray-700">User Agent:</span>{" "}
              <span className="text-[11px] text-gray-500 font-mono break-all">
                {log.user_agent ?? "Mozilla/5.0 REST API Client"}
              </span>
            </div>
          </div>

          {/* JSON diff */}
          <JsonDiffPanel
            oldValues={log.old_values}
            newValues={log.new_values}
          />
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
