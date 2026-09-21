import type { ApprovalEntityType } from "../../types/approvalTypes";
import type { ColumnDef } from "../../config/approvalTabs";
import { Pagination } from "../tasks/Pagination";

interface Props {
  data: Array<{ id: number }>;
  columns: ColumnDef[];
  entity_type: ApprovalEntityType;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export function ApprovalTable({
  data,
  columns,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onApprove,
  onReject,
}: Props) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No pending items in this tab. 🎉
      </div>
    );
  }

  const start = (page - 1) * pageSize;
  const pageRows = data.slice(start, start + pageSize);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 font-medium whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-middle">
                    {col.render(row)}
                  </td>
                ))}
                <td className="px-4 py-3 align-middle">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(row.id)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(row.id)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={data.length}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </>
  );
}
