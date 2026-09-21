import type { ApprovalTab, PendingApprovals } from "../../types/approvalTypes";
import { TABS } from "../../config/approvalTabs";

interface Props {
  activeTab: ApprovalTab;
  counts: PendingApprovals;
  onChange: (tab: ApprovalTab) => void;
}

const ORDER: ApprovalTab[] = ["timesheets", "tasks", "overtime"];

export function ApprovalTabs({ activeTab, counts, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-100 px-4">
      {ORDER.map((tab) => {
        const config = TABS[tab];
        const count = counts[tab]?.length ?? 0;
        const active = tab === activeTab;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              active ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {config.label}
              <span
                className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                  count > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </span>

            {active && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-600 rounded-t" />
            )}
          </button>
        );
      })}
    </div>
  );
}
