import { api } from "../services/api";
import type {
  ApiResponse,
  ApprovalDecision,
  PendingApprovals,
} from "../types/approvalTypes";

const EMPTY: PendingApprovals = { timesheets: [], tasks: [], overtime: [] };

export const approvalsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPendingApprovals: builder.query<PendingApprovals, void>({
      query: () => "/approvals",
      transformResponse: (res: ApiResponse<PendingApprovals>) =>
        res?.success && res.data ? res.data : EMPTY,
      providesTags: ["Approvals"],
    }),

    approveRequest: builder.mutation<void, ApprovalDecision>({
      query: (body) => ({
        url: "/approvals/approve",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Approvals"],
    }),

    rejectRequest: builder.mutation<void, ApprovalDecision>({
      query: (body) => ({
        url: "/approvals/reject",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Approvals"],
    }),
  }),
});

export const {
  useGetPendingApprovalsQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
} = approvalsApi;
