import type { ReportType } from "../../types/reportTypes";
import { REPORT_CONFIGS, REPORT_TYPE_ORDER } from "../../config/reportConfigs";

interface Props {
  reportType: ReportType;
  startDate: string;
  endDate: string;
  isFetching: boolean;
  onReportTypeChange: (t: ReportType) => void;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onRun: () => void;
}

export function ReportCriteria({
  reportType,
  startDate,
  endDate,
  isFetching,
  onReportTypeChange,
  onStartDateChange,
  onEndDateChange,
  onRun,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-fit">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Report Criteria
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value as ReportType)}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          >
            {REPORT_TYPE_ORDER.map((t) => (
              <option key={t} value={t}>
                {REPORT_CONFIGS[t].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={onRun}
          disabled={isFetching}
          className="w-full justify-center inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isFetching ? "Running…" : "Run Report"}
        </button>
      </div>
    </div>
  );
}
