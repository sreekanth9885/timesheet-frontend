import type {
  ApprovalEntityType,
  ApprovalTab,
  PendingOvertime,
  PendingTask,
  PendingTimesheet,
} from "../types/approvalTypes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ColumnDef {
  key: string;
  label: string;
  render: (row: any) => React.ReactNode;
}

export interface TabConfig {
  label: string;
  entity_type: ApprovalEntityType;
  columns: ColumnDef[];
}

const formatDate = (val?: string) => (val ? val.split("T")[0] : "—");

export const TABS: Record<ApprovalTab, TabConfig> = {
  timesheets: {
    label: "Timesheets",
    entity_type: "timesheet",
    columns: [
      {
        key: "employee",
        label: "Employee",
        render: (row: PendingTimesheet) => (
          <div className="font-semibold text-gray-800">
            {row.first_name} {row.last_name ?? ""}
          </div>
        ),
      },
      {
        key: "project_name",
        label: "Project",
        render: (row: PendingTimesheet) => row.project_name ?? "—",
      },
      {
        key: "date",
        label: "Date",
        render: (row: PendingTimesheet) => formatDate(row.date),
      },
      {
        key: "total_hours",
        label: "Total Hours",
        render: (row: PendingTimesheet) => {
          const h = Number(row.total_hours ?? 0);
          return (
            <span
              className={`font-semibold text-[15px] ${
                h > 8 ? "text-amber-600" : "text-gray-800"
              }`}
            >
              {h.toFixed(1)}h
            </span>
          );
        },
      },
      {
        key: "description",
        label: "Work Summary",
        render: (row: PendingTimesheet) => (
          <div className="max-w-[250px] text-[13px] text-gray-500 truncate">
            {row.description || "—"}
          </div>
        ),
      },
    ],
  },

  tasks: {
    label: "Tasks",
    entity_type: "task",
    columns: [
      {
        key: "created_by",
        label: "Created By",
        render: (row: PendingTask) => (
          <div className="font-semibold text-gray-800">
            {row.first_name} {row.last_name ?? ""}
          </div>
        ),
      },
      {
        key: "name",
        label: "Task Title",
        render: (row: PendingTask) => row.name,
      },
      {
        key: "project_name",
        label: "Project",
        render: (row: PendingTask) => row.project_name ?? "—",
      },
      {
        key: "estimated_hours",
        label: "Est. Hours",
        render: (row: PendingTask) => `${row.estimated_hours ?? 0}h`,
      },
    ],
  },

  overtime: {
    label: "Overtime",
    entity_type: "overtime",
    columns: [
      {
        key: "employee",
        label: "Employee",
        render: (row: PendingOvertime) => (
          <div className="font-semibold text-gray-800">
            {row.first_name} {row.last_name ?? ""}
          </div>
        ),
      },
      {
        key: "date",
        label: "Date",
        render: (row: PendingOvertime) => formatDate(row.date),
      },
      {
        key: "extra_hours",
        label: "OT Hours",
        render: (row: PendingOvertime) => (
          <span className="font-semibold text-amber-600">
            +{row.extra_hours}h
          </span>
        ),
      },
      {
        key: "reason",
        label: "Reason",
        render: (row: PendingOvertime) => (
          <div className="max-w-[250px] text-[13px] truncate">
            {row.reason || "—"}
          </div>
        ),
      },
    ],
  },
};
