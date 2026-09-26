import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRejectOvertimeMutation } from "../../services/overtimeApi";

interface Props {
  open: boolean;
  overtimeId: number | null;
  onClose: () => void;
}

const DEFAULT_REMARKS = "Overtime not authorized";

export function RejectOvertimeModal({ open, overtimeId, onClose }: Props) {
  const [remarks, setRemarks] = useState(DEFAULT_REMARKS);
  const [rejectOvertime, { isLoading }] = useRejectOvertimeMutation();

  useEffect(() => {
    if (open) setRemarks(DEFAULT_REMARKS);
  }, [open]);

  if (!open || overtimeId === null) return null;

  const handleConfirm = async () => {
    const text = remarks.trim() || DEFAULT_REMARKS;
    try {
      await rejectOvertime({ id: overtimeId, remarks: text }).unwrap();
      toast.success("Overtime request rejected");
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[460px]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Reject Overtime Request</h2>
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
              Reason for Rejection
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Explain why this overtime claim is rejected..."
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
