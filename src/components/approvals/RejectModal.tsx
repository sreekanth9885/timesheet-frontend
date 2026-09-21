import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRejectRequestMutation } from "../../services/approvalsApi";
import type { ApprovalEntityType } from "../../types/approvalTypes";

interface Props {
  open: boolean;
  entity_type: ApprovalEntityType | null;
  entity_id: number | null;
  onClose: () => void;
}

export function RejectModal({ open, entity_type, entity_id, onClose }: Props) {
  const [reason, setReason] = useState("");
  const [rejectRequest, { isLoading }] = useRejectRequestMutation();

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  if (!open || !entity_type || entity_id === null) return null;

  const handleConfirm = async () => {
    const comments = reason.trim();
    if (!comments) {
      toast.error("Please specify a rejection reason");
      return;
    }
    try {
      await rejectRequest({ entity_type, entity_id, comments }).unwrap();
      toast.success("Request rejected.");
      onClose();
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Rejection failed";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[450px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Reject Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Explain why this request is rejected..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              Confirm Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
