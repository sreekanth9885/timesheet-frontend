import { api } from "../services/api";
import type {
  ApiResponse,
  DashboardStats,
  RecentTimesheet,
} from "../types/dashboardTypes";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard",
      transformResponse: (res: ApiResponse<DashboardStats>) =>
        res?.success && res.data ? res.data : {},
      providesTags: ["Dashboard"],
    }),

    /**
     * `scope: "all"` → admin sees everyone; `scope: "mine"` → employee sees
     * their own current week. Two URLs, one cache key namespace.
     */
    getRecentTimesheets: builder.query<
      RecentTimesheet[],
      { scope: "all" | "mine" }
    >({
      query: ({ scope }) => ({
        url: scope === "all" ? "/timesheets" : "/timesheets/my/week",
      }),
      transformResponse: (res: ApiResponse<RecentTimesheet[]>) =>
        res?.success && res.data ? res.data : [],
      providesTags: ["Timesheets"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetRecentTimesheetsQuery } =
  dashboardApi;
