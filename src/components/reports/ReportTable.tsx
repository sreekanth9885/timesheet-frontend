import type { ReportColumn } from "../../config/reportConfigs";
import { Pagination } from "../tasks/Pagination";

interface Props {
  rows: Array<{ id?: number; [key: string]: unknown }>;
  columns: ReportColumn[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

export function ReportTable({
  rows,
  columns,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: Props) {
  if (total === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data available for the selected criteria.
      </div>
    );
  }

  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.map((row, idx) => (
              <tr
                key={(row.id as number | undefined) ?? idx}
                className="hover:bg-gray-50"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render(row)}
                  </td>
                ))}
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
