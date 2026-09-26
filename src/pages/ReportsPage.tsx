import { useState } from "react";
import toast from "react-hot-toast";

import { useGetReportQuery } from "../services/reportsApi";
import type {
  ReportQueryParams,
  ReportRow,
  ReportType,
} from "../types/reportTypes";
import { REPORT_CONFIGS } from "../config/reportConfigs";
import { exportRowsToCsv } from "../utils/csvExport";
import { ReportCriteria } from "../components/reports/ReportCriteria";
import { SimpleBarChart } from "../components/reports/SimpleBarChart";
import { SimplePieChart } from "../components/reports/SimplePieChart";
import { ReportTable } from "../components/reports/ReportTable";

const todayISO = () => new Date().toISOString().split("T")[0];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("employee");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applied, setApplied] = useState<ReportQueryParams>({
    reportType: "employee",
    start_date: "",
    end_date: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: rows = [], isFetching, isError } = useGetReportQuery(applied);

  const config = REPORT_CONFIGS[applied.reportType];
  const bar = config.getBarData(rows as ReportRow[]);
  const pie = config.getPieData(rows as ReportRow[]);

  // If no data, show the same placeholder behaviour as the original
  const barLabels = bar.labels.length ? bar.labels : ["No Data"];
  const barValues = bar.values.length ? bar.values : [0];
  const pieLabels = pie.labels.length ? pie.labels : ["None"];
  const pieValues = pie.values.length ? pie.values : [1];

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleTypeChange = (t: ReportType) => {
    setReportType(t);
    setApplied({ reportType: t, start_date: startDate, end_date: endDate });
    setPage(1);
  };

  const handleRun = () => {
    setApplied({
      reportType,
      start_date: startDate,
      end_date: endDate,
    });
    setPage(1);
  };

  const handleExport = () => {
    if (!rows.length) {
      toast.error("No report data available to export");
      return;
    }
    const filename = `timesheet-report-${applied.reportType}-${todayISO()}.csv`;
    const ok = exportRowsToCsv(
      rows as Array<Record<string, unknown>>,
      filename,
    );
    if (ok) toast.success("CSV Report downloaded successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics &amp; Company Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate executive summaries on workforce productivity, project
            budgets, and overtime costs.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={!rows.length}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-50 disabled:opacity-40"
        >
          <svg
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Main layout: sidebar + content */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <ReportCriteria
          reportType={reportType}
          startDate={startDate}
          endDate={endDate}
          isFetching={isFetching}
          onReportTypeChange={handleTypeChange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onRun={handleRun}
        />

        <div className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                {config.barChartTitle}
              </h3>
              <SimpleBarChart
                labels={barLabels}
                data={barValues}
                seriesName={config.barSeriesName}
                height={250}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                {config.pieChartTitle}
              </h3>
              <SimplePieChart
                labels={pieLabels}
                values={pieValues}
                height={250}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">
                Tabular Report Data
              </h3>
            </div>

            {isError ? (
              <div className="text-center py-12 text-red-500">
                Failed to generate report from server.
              </div>
            ) : isFetching && rows.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Loading report data...
              </div>
            ) : (
              <ReportTable
                rows={rows as Array<{ id?: number; [key: string]: unknown }>}
                columns={config.columns}
                page={page}
                pageSize={pageSize}
                total={rows.length}
                onPageChange={setPage}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setPage(1);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
