import type { ReactNode } from "react";
import type {
  DepartmentReportRow,
  EmployeeReportRow,
  OvertimeReportRow,
  ProjectReportRow,
  ReportType,
  TaskReportRow,
} from "../types/reportTypes";

export interface ReportColumn {
  key: string;
  label: string;
  render: (row: any) => ReactNode;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface ReportConfig {
  label: string;
  columns: ReportColumn[];
  barChartTitle: string;
  pieChartTitle: string;
  barSeriesName: string;
  getBarData: (rows: any[]) => ChartData;
  getPieData: (rows: any[]) => ChartData;
}

const utilizationBadge = (pct: number) => {
  const p = Math.round(pct || 0);
  const cls =
    p > 100
      ? "bg-red-100 text-red-700"
      : p > 80
        ? "bg-amber-100 text-amber-700"
        : "bg-green-100 text-green-700";
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${cls}`}>
      {p}%
    </span>
  );
};

export const REPORT_CONFIGS: Record<ReportType, ReportConfig> = {
  employee: {
    label: "Employee Hours Summary",
    barChartTitle: "Visual Breakdown",
    pieChartTitle: "Proportion & Distribution",
    barSeriesName: "Hours / Quantity",
    columns: [
      {
        key: "employee",
        label: "Employee",
        render: (r: EmployeeReportRow) => (
          <div className="font-semibold text-gray-800">
            {r.first_name} {r.last_name ?? ""}
          </div>
        ),
      },
      {
        key: "total_hours",
        label: "Total Logged Hours",
        render: (r: EmployeeReportRow) => (
          <span className="font-semibold text-gray-800">
            {Number(r.total_hours ?? 0).toFixed(1)} hrs
          </span>
        ),
      },
      {
        key: "entries_count",
        label: "Logged Days / Entries",
        render: (r: EmployeeReportRow) => `${r.entries_count ?? 0} entries`,
      },
    ],
    getBarData: (rows: EmployeeReportRow[]) => ({
      labels: rows.map((r) => r.first_name),
      values: rows.map((r) => Number(r.total_hours ?? 0)),
    }),
    getPieData: (rows: EmployeeReportRow[]) => ({
      labels: rows.map((r) => r.first_name),
      values: rows.map((r) => Number(r.total_hours ?? 0)),
    }),
  },

  project: {
    label: "Project Budget vs Actual",
    barChartTitle: "Visual Breakdown",
    pieChartTitle: "Proportion & Distribution",
    barSeriesName: "Hours / Quantity",
    columns: [
      {
        key: "name",
        label: "Project Name",
        render: (r: ProjectReportRow) => (
          <div className="font-semibold text-gray-800">{r.name}</div>
        ),
      },
      {
        key: "budget_hours",
        label: "Budget Hours",
        render: (r: ProjectReportRow) => `${r.budget_hours ?? 0}h`,
      },
      {
        key: "actual_hours",
        label: "Actual Hours",
        render: (r: ProjectReportRow) =>
          `${Number(r.actual_hours ?? 0).toFixed(1)}h`,
      },
      {
        key: "budget_utilization_percent",
        label: "Budget Utilization",
        render: (r: ProjectReportRow) =>
          utilizationBadge(r.budget_utilization_percent),
      },
    ],
    getBarData: (rows: ProjectReportRow[]) => ({
      labels: rows.map((r) => r.name),
      values: rows.map((r) => Number(r.actual_hours ?? 0)),
    }),
    getPieData: (rows: ProjectReportRow[]) => ({
      labels: rows.map((r) => r.name),
      values: rows.map((r) => Number(r.budget_hours ?? 10)),
    }),
  },

  task: {
    label: "Task Completion Breakdown",
    barChartTitle: "Visual Breakdown",
    pieChartTitle: "Proportion & Distribution",
    barSeriesName: "Hours / Quantity",
    columns: [
      {
        key: "status",
        label: "Task Status",
        render: (r: TaskReportRow) => (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
            {(r.status ?? "").toUpperCase()}
          </span>
        ),
      },
      {
        key: "task_count",
        label: "Count of Tasks",
        render: (r: TaskReportRow) => r.task_count,
      },
      {
        key: "total_estimated",
        label: "Total Est. Hours",
        render: (r: TaskReportRow) => `${r.total_estimated ?? 0}h`,
      },
      {
        key: "total_actual",
        label: "Total Actual Hours",
        render: (r: TaskReportRow) => `${r.total_actual ?? 0}h`,
      },
    ],
    getBarData: (rows: TaskReportRow[]) => ({
      labels: rows.map((r) => (r.status ?? "").toUpperCase()),
      values: rows.map((r) => Number(r.task_count ?? 0)),
    }),
    getPieData: (rows: TaskReportRow[]) => ({
      labels: rows.map((r) => (r.status ?? "").toUpperCase()),
      values: rows.map((r) => Number(r.task_count ?? 0)),
    }),
  },

  overtime: {
    label: "Overtime Cost Analysis",
    barChartTitle: "Visual Breakdown",
    pieChartTitle: "Proportion & Distribution",
    barSeriesName: "Hours / Quantity",
    columns: [
      {
        key: "employee",
        label: "Employee",
        render: (r: OvertimeReportRow) => (
          <div className="font-semibold text-gray-800">
            {r.first_name} {r.last_name ?? ""}
          </div>
        ),
      },
      {
        key: "total_overtime",
        label: "Approved OT Hours",
        render: (r: OvertimeReportRow) => (
          <span className="font-bold text-amber-600">
            +{Number(r.total_overtime ?? 0).toFixed(1)} hrs
          </span>
        ),
      },
      {
        key: "request_count",
        label: "Approved Claims",
        render: (r: OvertimeReportRow) => r.request_count,
      },
    ],
    getBarData: (rows: OvertimeReportRow[]) => ({
      labels: rows.map((r) => r.first_name),
      values: rows.map((r) => Number(r.total_overtime ?? 0)),
    }),
    getPieData: (rows: OvertimeReportRow[]) => ({
      labels: rows.map((r) => r.first_name),
      values: rows.map((r) => Number(r.total_overtime ?? 0)),
    }),
  },

  department: {
    label: "Department Headcount & Hours",
    barChartTitle: "Visual Breakdown",
    pieChartTitle: "Proportion & Distribution",
    barSeriesName: "Hours / Quantity",
    columns: [
      {
        key: "name",
        label: "Department",
        render: (r: DepartmentReportRow) => (
          <div className="font-semibold text-gray-800">{r.name}</div>
        ),
      },
      {
        key: "employee_count",
        label: "Personnel Count",
        render: (r: DepartmentReportRow) =>
          `${r.employee_count ?? 0} employees`,
      },
      {
        key: "total_hours",
        label: "Total Team Hours",
        render: (r: DepartmentReportRow) =>
          `${Number(r.total_hours ?? 0).toFixed(1)} hrs`,
      },
    ],
    getBarData: (rows: DepartmentReportRow[]) => ({
      labels: rows.map((r) => r.name),
      values: rows.map((r) => Number(r.total_hours ?? 0)),
    }),
    getPieData: (rows: DepartmentReportRow[]) => ({
      labels: rows.map((r) => r.name),
      values: rows.map((r) => Number(r.employee_count ?? 0)),
    }),
  },
};

export const REPORT_TYPE_ORDER: ReportType[] = [
  "employee",
  "project",
  "task",
  "overtime",
  "department",
];
