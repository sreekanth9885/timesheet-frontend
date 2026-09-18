// src/services/timesheetApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import type {
  TimesheetEntry,
  CreateTimesheetDto,
  Project,
  Task,
  ApiResponse,
} from "../types/timesheet";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const timesheetApi = createApi({
  reducerPath: "timesheetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Inject token from Redux state
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Timesheets", "Projects", "Tasks"],
  endpoints: (builder) => ({
    // ---- Metadata ----
    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      transformResponse: (res: ApiResponse<Project[]>) => res.data || [],
      providesTags: ["Projects"],
    }),
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      transformResponse: (res: ApiResponse<Task[]>) => res.data || [],
      providesTags: ["Tasks"],
    }),

    // ---- Timesheet Queries ----
    getMyTodayTimesheets: builder.query<TimesheetEntry[], void>({
      query: () => "/timesheets/my/today",
      transformResponse: (res: ApiResponse<TimesheetEntry[]>) => res.data || [],
      providesTags: ["Timesheets"],
    }),
    getMyWeekTimesheets: builder.query<TimesheetEntry[], void>({
      query: () => "/timesheets/my/week",
      transformResponse: (res: ApiResponse<TimesheetEntry[]>) => res.data || [],
      providesTags: ["Timesheets"],
    }),

    // ---- Timesheet Mutations ----
    createTimesheet: builder.mutation<TimesheetEntry, CreateTimesheetDto>({
      query: (body) => ({
        url: "/timesheets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Timesheets"],
    }),
    updateTimesheet: builder.mutation<
      TimesheetEntry,
      { id: number; data: Partial<CreateTimesheetDto> }
    >({
      query: ({ id, data }) => ({
        url: `/timesheets/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Timesheets"],
    }),
    deleteTimesheet: builder.mutation<void, number>({
      query: (id) => ({
        url: `/timesheets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Timesheets"],
    }),
    submitTimesheet: builder.mutation<void, number>({
      query: (id) => ({
        url: `/timesheets/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: ["Timesheets"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetTasksQuery,
  useGetMyTodayTimesheetsQuery,
  useGetMyWeekTimesheetsQuery,
  useCreateTimesheetMutation,
  useUpdateTimesheetMutation,
  useDeleteTimesheetMutation,
  useSubmitTimesheetMutation,
} = timesheetApi;
