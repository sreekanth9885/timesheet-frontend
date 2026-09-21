import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  useApproveRequestMutation,
  useGetPendingApprovalsQuery,
} from "../services/approvalsApi";
import type {
  ApprovalEntityType,
  ApprovalTab,
  PendingApprovals,
} from "../types/approvalTypes";
import { TABS } from "../config/approvalTabs";
import { ApprovalTabs } from "../components/approvals/ApprovalTabs";
import { ApprovalTable } from "../components/approvals/ApprovalTable";
import { RejectModal } from "../components/approvals/RejectModal";

const EMPTY: PendingApprovals = { timesheets: [], tasks: [], overtime: [] };

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<ApprovalTab>("timesheets");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bulkApproving, setBulkApproving] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<{
    entity_type: ApprovalEntityType;
    entity_id: number;
  } | null>(null);

  const {
    data: pending = EMPTY,
    isLoading,
    isError,
  } = useGetPendingApprovalsQuery();
  const [approveRequest] = useApproveRequestMutation();

  const currentTab = TABS[activeTab];
  const currentData = pending[activeTab] ?? [];
  const hasPending = currentData.length > 0;

  // Reset to page 1 whenever the tab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleSingleApprove = async (id: number) => {
    try {
      await approveRequest({
        entity_type: currentTab.entity_type,
        entity_id: id,
        comments: "Approved by manager",
      }).unwrap();
      toast.success("Request approved successfully!");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Approval failed";
      toast.error(msg);
    }
  };

  const handleBulkApprove = async () => {
    if (!hasPending || bulkApproving) return;
    setBulkApproving(true);
    try {
      // RTK Query dedupes the invalidations from the same tag within one tick,
      // so this fires one refetch for the whole batch.
      await Promise.all(
        currentData.map((item) =>
          approveRequest({
            entity_type: currentTab.entity_type,
            entity_id: item.id,
            comments: "Bulk approved",
          }).unwrap(),
        ),
      );
      toast.success(`Bulk approved all pending ${activeTab}!`);
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Bulk approval failed";
      toast.error(msg);
    } finally {
      setBulkApproving(false);
    }
  };

  const handleRejectClick = (id: number) => {
    setRejectTarget({ entity_type: currentTab.entity_type, entity_id: id });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Approvals Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and process submitted employee timesheets, self-created
            tasks, and overtime claims.
          </p>
        </div>

        <button
          onClick={handleBulkApprove}
          disabled={!hasPending || bulkApproving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {bulkApproving ? "Approving…" : "Approve All in Tab"}
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ApprovalTabs
          activeTab={activeTab}
          counts={pending}
          onChange={setActiveTab}
        />

        <div className="pt-4">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading pending approvals...
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              Failed to load pending approvals.
            </div>
          ) : (
            <ApprovalTable
              data={currentData}
              columns={currentTab.columns}
              entity_type={currentTab.entity_type}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(1);
              }}
              onApprove={handleSingleApprove}
              onReject={handleRejectClick}
            />
          )}
        </div>
      </div>

      <RejectModal
        open={rejectTarget !== null}
        entity_type={rejectTarget?.entity_type ?? null}
        entity_id={rejectTarget?.entity_id ?? null}
        onClose={() => setRejectTarget(null)}
      />
    </div>
  );
}
