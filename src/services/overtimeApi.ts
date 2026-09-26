import type { ApiResponse, OvertimeRecord } from "../types/overtimeTypes";
import { api } from "./api";

export const overtimeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOvertime: builder.query<OvertimeRecord[], void>({
      query: () => "/overtime",
      transformResponse: (res: ApiResponse<OvertimeRecord[]>) =>
        res?.success && res.data ? res.data : [],
      providesTags: ["Overtime"],
    }),

    /** Multipart upload — prepareHeaders must skip Content-Type (see api.ts fix). */
    createOvertime: builder.mutation<OvertimeRecord, FormData>({
      query: (body) => ({ url: "/overtime", method: "POST", body }),
      invalidatesTags: ["Overtime"],
    }),

    approveOvertime: builder.mutation<void, { id: number; remarks?: string }>({
      query: ({ id, remarks = "Approved by admin" }) => ({
        url: `/overtime/${id}/approve`,
        method: "POST",
        body: { remarks },
      }),
      invalidatesTags: ["Overtime"],
    }),

    rejectOvertime: builder.mutation<void, { id: number; remarks: string }>({
      query: ({ id, remarks }) => ({
        url: `/overtime/${id}/reject`,
        method: "POST",
        body: { remarks },
      }),
      invalidatesTags: ["Overtime"],
    }),

    deleteOvertime: builder.mutation<void, number>({
      query: (id) => ({ url: `/overtime/${id}`, method: "DELETE" }),
      invalidatesTags: ["Overtime"],
    }),
  }),
});

export const {
  useGetOvertimeQuery,
  useCreateOvertimeMutation,
  useApproveOvertimeMutation,
  useRejectOvertimeMutation,
  useDeleteOvertimeMutation,
} = overtimeApi;
