import { api } from "../services/api";
import type {
  ApiResponse,
  ReportQueryParams,
  ReportRow,
  ReportType,
} from "../types/reportTypes";

/** One place maps report type → URL suffix. */
const ENDPOINT_MAP: Record<ReportType, string> = {
  employee: "employees",
  project: "projects",
  task: "tasks",
  overtime: "overtime",
  department: "departments",
};

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReport: builder.query<ReportRow[], ReportQueryParams>({
      query: ({ reportType, start_date, end_date }) => ({
        url: `/reports/${ENDPOINT_MAP[reportType]}`,
        params: {
          start_date: start_date || undefined,
          end_date: end_date || undefined,
        },
      }),
      transformResponse: (res: ApiResponse<ReportRow[]>) =>
        res?.success && res.data ? res.data : [],
      providesTags: (_r, _e, arg) => [{ type: "Reports", id: arg.reportType }],
    }),
  }),
});

export const { useGetReportQuery } = reportsApi;
