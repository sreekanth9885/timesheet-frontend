import type { OvertimeRecord } from "../../types/overtimeTypes";
import {
  formatDate,
  formatExtraHours,
  getStatusBadge,
  getUploadUrl,
} from "../../utils/overtimeHelpers";
import { Pagination } from "../tasks/Pagination";

interface Props {
  records: OvertimeRecord[];
  page: number;
  pageSize: number;
  total: number;
  isAdmin: boolean;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onApprove: (r: OvertimeRecord) => void;
  onReject: (r: OvertimeRecord) => void;
  onDelete: (r: OvertimeRecord) => void;
}

export function OvertimeTable({
  records,
  page,
  pageSize,
  total,
  isAdmin,
  onPageChange,
  onPageSizeChange,
  onApprove,
  onReject,
  onDelete,
}: Props) {
  if (total === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No overtime claims found.
      </div>
    );
  }

  const start = (page - 1) * pageSize;
  const pageRows = records.slice(start, start + pageSize);

  const renderActions = (row: OvertimeRecord) => {
    if (isAdmin && row.status === "pending") {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(row)}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(row)}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      );
    }

    if (!isAdmin && row.status === "pending") {
      return (
        <button
          onClick={() => onDelete(row)}
          title="Cancel Request"
          className="p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50"
        >
          <svg
            width={15}
            height={15}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      );
    }

    if (row.remarks) {
      return (
        <span className="text-xs text-gray-500 italic">
          &ldquo;{row.remarks}&rdquo;
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Employee</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Extra Hours</th>
              <th className="text-left px-4 py-3 font-medium">Reason for OT</th>
              <th className="text-left px-4 py-3 font-medium">Attachment</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-800">
                    {row.first_name || "Me"} {row.last_name ?? ""}
                  </div>
                  {row.emp_code && (
                    <div className="text-[11px] text-gray-500">
                      {row.emp_code}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {formatDate(row.date)}
                </td>
                <td className="px-4 py-3">
                  <span className="font-bold text-[15px] text-amber-600">
                    {formatExtraHours(row.extra_hours)}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-[250px]">
                  <div className="text-[13px] text-gray-700 truncate">
                    {row.reason || "—"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {row.proof_file ? (
                    <a
                      href={getUploadUrl(row.proof_file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:text-blue-700"
                    >
                      <svg
                        width={14}
                        height={14}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      View Proof
                    </a>
                  ) : (
                    <span className="text-[13px] text-gray-400">None</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getStatusBadge(
                      row.status,
                    )}`}
                  >
                    {(row.status ?? "pending").toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">{renderActions(row)}</td>
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
