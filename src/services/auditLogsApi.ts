import { api } from "../services/api";
import type { ApiResponse, AuditLog } from "../types/auditLogTypes";

export const auditLogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLog[], void>({
      query: () => ({
        url: "/audit-logs",
        params: { limit: 1000 },
      }),
      transformResponse: (res: ApiResponse<AuditLog[]>) =>
        res?.success && res.data ? res.data : [],
      providesTags: ["AuditLogs"],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditLogsApi;
