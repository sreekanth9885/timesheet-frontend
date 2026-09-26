import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  useApproveOvertimeMutation,
  useDeleteOvertimeMutation,
  useGetOvertimeQuery,
} from "../services/overtimeApi";
import type { OvertimeRecord } from "../types/overtimeTypes";
import { useAppSelector } from "../store/hooks";
import { OvertimeTable } from "../components/overtime/OvertimeTable";
import { OvertimeClaimModal } from "../components/overtime/OvertimeClaimModal";
import { RejectOvertimeModal } from "../components/overtime/RejectOvertimeModal";
import { selectIsAdmin } from "../features/auth/authSlice";

export default function OvertimePage() {
  const isAdmin = useAppSelector(selectIsAdmin);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [claimOpen, setClaimOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);

  const { data: records = [], isLoading, isError } = useGetOvertimeQuery();
  const [approveOvertime] = useApproveOvertimeMutation();
  const [deleteOvertime] = useDeleteOvertimeMutation();

  // Client-side filtering — matches original behaviour
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      const matchesSearch = !q || r.reason?.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const resetToPage1 = () => setPage(1);

  const handleSearch = (v: string) => {
    setSearch(v);
    resetToPage1();
  };

  const handleStatus = (v: string) => {
    setStatusFilter(v);
    resetToPage1();
  };

  const handleApprove = async (r: OvertimeRecord) => {
    try {
      await approveOvertime({
        id: r.id,
        remarks: "Approved by admin",
      }).unwrap();
      toast.success("Overtime approved successfully!");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Approval failed";
      toast.error(msg);
    }
  };

  const handleDelete = async (r: OvertimeRecord) => {
    if (!confirm("Cancel this overtime request?")) return;
    try {
      await deleteOvertime(r.id).unwrap();
      toast.success("Overtime claim cancelled");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Cancellation failed";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Overtime Tracking &amp; Claims
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track extra hours, submit proof attachments, and process overtime
            approvals.
          </p>
        </div>
        <button
          onClick={() => setClaimOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          <svg
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M12 4v16m8-8H4" />
          </svg>
          Claim Overtime
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative w-[280px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search overtime reasons..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleStatus(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm w-[180px]"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            Loading overtime claims...
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Failed to fetch overtime records.
          </div>
        ) : (
          <OvertimeTable
            records={filtered}
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            isAdmin={isAdmin}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              resetToPage1();
            }}
            onApprove={handleApprove}
            onReject={(r) => setRejectTarget(r.id)}
            onDelete={handleDelete}
          />
        )}
      </div>

      <OvertimeClaimModal
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
      />

      <RejectOvertimeModal
        open={rejectTarget !== null}
        overtimeId={rejectTarget}
        onClose={() => setRejectTarget(null)}
      />
    </div>
  );
}
