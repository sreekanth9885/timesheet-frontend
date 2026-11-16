import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  RefreshCw,
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  AlertCircle,
} from "lucide-react";
import {
  useListAllOrganizationsQuery,
  useApproveOrganizationMutation,
  useRejectOrganizationMutation,
} from "../../services/api";
import type { PendingOrganization, OrganizationStatus } from "../../types";

/* ── Config ─────────────────────────────────────────────────── */

type TabKey = OrganizationStatus | "all";

const TABS: { key: TabKey; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "rejected", label: "Rejected" },
  { key: "suspended", label: "Suspended" },
  { key: "all", label: "All" },
];

const BADGE: Record<OrganizationStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  suspended: "bg-gray-100 text-gray-700 ring-gray-200",
  inactive: "bg-gray-100 text-gray-500 ring-gray-200",
};

const DOT: Record<OrganizationStatus, string> = {
  pending: "bg-amber-500",
  active: "bg-emerald-500",
  rejected: "bg-rose-500",
  suspended: "bg-gray-500",
  inactive: "bg-gray-400",
};

/* ── Sub-components ─────────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "amber" | "emerald" | "rose" | "blue";
}) {
  const tones = {
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    blue: "bg-blue-50 text-blue-600",
  } as const;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${tones[tone]}`}>{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-800 tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrganizationStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${BADGE[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${DOT[status]}`} />
      <span className="capitalize">{status}</span>
    </span>
  );
}

function EmptyState({ tab }: { tab: TabKey }) {
  const label = tab === "all" ? "organizations" : `${tab} organizations`;
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-3 rounded-full bg-gray-100 text-gray-400 mb-3">
        <Building2 className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-gray-700">No {label} yet</p>
      <p className="text-xs text-gray-500 mt-1">
        New registrations will appear here for review.
      </p>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="w-9 h-9 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-1/3 bg-gray-200 rounded" />
            <div className="h-2 w-1/4 bg-gray-100 rounded" />
          </div>
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-7 w-32 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function OrganizationApprovals() {
  const [tab, setTab] = useState<TabKey>("pending");
  const [query, setQuery] = useState("");

  // ✅ Your existing endpoint. `undefined` = no status param = fetch everything.
  const {
    data: orgs = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useListAllOrganizationsQuery(undefined);

  const [approve, { isLoading: approving }] = useApproveOrganizationMutation();
  const [reject, { isLoading: rejecting }] = useRejectOrganizationMutation();

  /* Counts per status */
  const counts = useMemo(() => {
    const c: Record<TabKey, number> = {
      all: orgs.length,
      pending: 0,
      active: 0,
      rejected: 0,
      suspended: 0,
      inactive: 0,
    };
    for (const o of orgs) c[o.status]++;
    return c;
  }, [orgs]);

  /* Tab + search filter */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orgs.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (!q) return true;
      return (
        o.name.toLowerCase().includes(q) ||
        (o.email ?? "").toLowerCase().includes(q) ||
        (o.contact_person ?? "").toLowerCase().includes(q) ||
        (o.code ?? "").toLowerCase().includes(q)
      );
    });
  }, [orgs, tab, query]);

  /* Reject modal */
  const [rejectTarget, setRejectTarget] = useState<PendingOrganization | null>(
    null,
  );
  const [reason, setReason] = useState("");

  const handleApprove = async (org: PendingOrganization) => {
    try {
      const res = await approve(org.id).unwrap();
      toast.success(
        `"${org.name}" approved — code: ${res.data.organization_code}`,
      );
    } catch (e: any) {
      toast.error(e?.data?.message || "Approval failed");
    }
  };

  const openReject = (org: PendingOrganization) => {
    setRejectTarget(org);
    setReason("");
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    try {
      await reject({
        id: rejectTarget.id,
        reason: reason.trim() || undefined,
      }).unwrap();
      toast.success(`"${rejectTarget.name}" rejected`);
      setRejectTarget(null);
      setReason("");
    } catch (e: any) {
      toast.error(e?.data?.message || "Rejection failed");
    }
  };

  const busy = approving || rejecting;

  /* ── Render ────────────────────────────────────────────── */
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review registrations and manage tenant accounts.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Pending"
          value={counts.pending}
          tone="amber"
          icon={<Clock3 className="w-5 h-5" />}
        />
        <StatCard
          label="Active"
          value={counts.active}
          tone="emerald"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          label="Rejected"
          value={counts.rejected}
          tone="rose"
          icon={<XCircle className="w-5 h-5" />}
        />
        <StatCard
          label="Total"
          value={counts.all}
          tone="blue"
          icon={<Building2 className="w-5 h-5" />}
        />
      </div>

      {/* Tabs + search */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 px-4 pt-4 border-b border-gray-200">
          <nav className="-mb-px flex gap-6 overflow-x-auto">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors inline-flex items-center gap-1.5 ${
                    active
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs font-semibold tabular-nums ${
                      active
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {counts[t.key]}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="relative mb-3 lg:mb-0 lg:mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, code…"
              className="pl-9 pr-3 py-2 w-full lg:w-72 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable />
        ) : isError ? (
          <div className="flex items-center gap-2 p-8 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" /> Failed to load organizations.
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Requested</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
                          {org.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {org.name}
                          </p>
                          <p className="text-xs text-gray-500 font-mono truncate">
                            {org.code || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-800">
                        {org.contact_person || "—"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {org.email}
                        {org.phone ? ` · ${org.phone}` : ""}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={org.status} />
                      {org.status === "rejected" && org.rejection_reason && (
                        <p
                          className="text-xs text-gray-500 mt-1 truncate max-w-[180px]"
                          title={org.rejection_reason}
                        >
                          {org.rejection_reason}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(org.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {org.status === "pending" ? (
                        <div className="inline-flex gap-2">
                          <button
                            disabled={busy}
                            onClick={() => handleApprove(org)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => openReject(org)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !rejecting && setRejectTarget(null)}
          />
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Reject organization
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              You're about to reject{" "}
              <span className="font-medium text-gray-800">
                {rejectTarget.name}
              </span>
              . This can't be undone from the UI.
            </p>

            <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="e.g. Duplicate registration, incomplete KYC…"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />

            <div className="mt-6 flex justify-end gap-2">
              <button
                disabled={rejecting}
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={rejecting}
                onClick={confirmReject}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {rejecting ? "Rejecting…" : "Reject organization"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
