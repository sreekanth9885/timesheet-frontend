import type {
  Project,
  ProjectEmployee,
  ProjectFormData,
} from "../types/projectTypes";
import type { ApiResponse } from "../types/taskTypes";
import { api } from "./api";

export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      transformResponse: (res: ApiResponse<Project[]>) =>
        res?.success && res.data ? res.data : [],
      providesTags: ["Projects"],
    }),

    createProject: builder.mutation<Project, ProjectFormData>({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: ["Projects"],
    }),

    updateProject: builder.mutation<
      Project,
      { id: number; body: ProjectFormData }
    >({
      query: ({ id, body }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    deleteProject: builder.mutation<void, number>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Projects"],
    }),

    getProjectEmployees: builder.query<ProjectEmployee[], number>({
      query: (projectId) => `/projects/${projectId}/employees`,
      transformResponse: (res: ApiResponse<ProjectEmployee[]>) =>
        res?.success && res.data ? res.data : [],
      providesTags: (_r, _e, id) => [{ type: "Projects", id }],
    }),

    allocateEmployee: builder.mutation<
      void,
      { projectId: number; employee_id: number; allocation_percentage: number }
    >({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/employees`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    deallocateEmployee: builder.mutation<
      void,
      { projectId: number; empId: number }
    >({
      query: ({ projectId, empId }) => ({
        url: `/projects/${projectId}/employees/${empId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectEmployeesQuery,
  useAllocateEmployeeMutation,
  useDeallocateEmployeeMutation,
} = projectsApi;
