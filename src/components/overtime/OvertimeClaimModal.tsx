import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCreateOvertimeMutation } from "../../services/overtimeApi";
import { todayISO } from "../../utils/overtimeHelpers";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OvertimeClaimModal({ open, onClose }: Props) {
  const [date, setDate] = useState(todayISO);
  const [extraHours, setExtraHours] = useState<string>("");
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState<File | null>(null);

  const [createOvertime, { isLoading }] = useCreateOvertimeMutation();

  useEffect(() => {
    if (open) {
      setDate(todayISO());
      setExtraHours("");
      setReason("");
      setProof(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hours = parseFloat(extraHours);
    if (!date || !hours || hours <= 0 || !reason.trim()) {
      toast.error("Please enter date, extra hours, and reason");
      return;
    }

    const fd = new FormData();
    fd.append("date", date);
    fd.append("extra_hours", String(hours));
    fd.append("reason", reason.trim());
    if (proof) fd.append("proof", proof);

    try {
      await createOvertime(fd).unwrap();
      toast.success("Overtime claim submitted with attachment!");
      onClose();
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Submission failed";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Claim Overtime Compensation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Overtime Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Extra Hours Claimed <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="12"
              placeholder="e.g. 2.5"
              value={extraHours}
              onChange={(e) => setExtraHours(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Reason &amp; Justification <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the business need or client escalation that required overtime..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Attach Proof Document (Image or PDF)
            </label>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => setProof(e.target.files?.[0] ?? null)}
              className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <div className="text-xs text-gray-500 mt-1">
              Upload approval email, ticket screenshot, or deployment logs.
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Overtime Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
