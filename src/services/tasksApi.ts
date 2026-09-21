import type {
  ApiResponse,
  Employee,
  Project,
  Task,
  TaskFormData,
  TaskQueryParams,
  TaskStatus,
} from "../types/taskTypes";
import { api } from "./api";

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], TaskQueryParams | void>({
      query: (params) => ({
        url: "/tasks",
        params: { limit: 1000, ...(params || {}) },
      }),
      transformResponse: (res: ApiResponse<Task[]>) =>
        res?.success && res.data ? res.data : [],
      providesTags: ["Tasks"],
    }),

    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      transformResponse: (res: ApiResponse<Project[]>) =>
        res?.success && res.data ? res.data : [],
    }),

    getEmployees: builder.query<Employee[], void>({
      query: () => "/employees",
      transformResponse: (res: ApiResponse<Employee[]>) =>
        res?.success && res.data ? res.data : [],
    }),

    createTask: builder.mutation<Task, TaskFormData>({
      query: (body) => ({ url: "/tasks", method: "POST", body }),
      invalidatesTags: ["Tasks"],
    }),

    updateTask: builder.mutation<Task, { id: number; body: TaskFormData }>({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTaskStatus: builder.mutation<
      void,
      { id: number; status: TaskStatus }
    >({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteTask: builder.mutation<void, number>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetProjectsQuery,
  useGetEmployeesQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = tasksApi;
