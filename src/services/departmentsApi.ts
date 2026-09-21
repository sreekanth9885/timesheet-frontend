import { api } from "../services/api";
import type {
  ApiResponse,
  Department,
  DepartmentFormData,
} from "../types/departmentTypes";

export const departmentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** Lightweight list — used for dropdowns (Employee modal, filters, …) */
    getDepartments: builder.query<Department[], void>({
      query: () => "/departments",
      transformResponse: (res: ApiResponse<Department[]>) =>
        res?.success && res.data ? res.data : [],
      providesTags: ["Departments"],
    }),

    /**
     * Rich list used by the Departments page.
     * Same URL — different cache slot is fine because the server shape
     * is the same; we keep it here so future filters can be added.
     */
    getDepartmentDirectory: builder.query<Department[], void>({
      query: () => "/departments",
      transformResponse: (res: ApiResponse<Department[]>) =>
        res?.success && res.data ? res.data : [],
      providesTags: ["Departments"],
    }),

    createDepartment: builder.mutation<Department, DepartmentFormData>({
      query: (body) => ({ url: "/departments", method: "POST", body }),
      invalidatesTags: ["Departments"],
    }),

    updateDepartment: builder.mutation<
      Department,
      { id: number; body: DepartmentFormData }
    >({
      query: ({ id, body }) => ({
        url: `/departments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Departments"],
    }),

    deleteDepartment: builder.mutation<void, number>({
      query: (id) => ({ url: `/departments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Departments"],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentDirectoryQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
