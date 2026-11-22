import { api } from "../services/api";
import type {
  ApiResponse,
  Employee,
  EmployeeFormData,
  EmployeeQueryParams,
} from "../types/employeeTypes";

export const employeesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeDirectory: builder.query<Employee[], EmployeeQueryParams | void>(
      {
        query: (params) => ({
          url: "/employees",
          params: { limit: 1000, ...(params ?? {}) },
        }),
        transformResponse: (res: ApiResponse<Employee[]>) =>
          res?.success && res.data ? res.data : [],
        providesTags: ["Employees", "Dashboard"],
      },
    ),

    // getDepartments: builder.query<Department[], void>({
    //   query: () => "/departments",
    //   transformResponse: (res: ApiResponse<Department[]>) =>
    //     res?.success && res.data ? res.data : [],
    //   providesTags: ["Departments"],
    // }),

    createEmployee: builder.mutation<Employee, EmployeeFormData>({
      query: (body) => ({ url: "/employees", method: "POST", body }),
      invalidatesTags: ["Employees", "Dashboard"],
    }),

    updateEmployee: builder.mutation<
      Employee,
      { id: number; body: Partial<EmployeeFormData> }
    >({
      query: ({ id, body }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Employees", "Dashboard"],
    }),

    terminateEmployee: builder.mutation<void, number>({
      query: (id) => ({ url: `/employees/${id}`, method: "DELETE" }),
      invalidatesTags: ["Employees", "Dashboard"],
    }),
  }),
});

export const {
  useGetEmployeeDirectoryQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useTerminateEmployeeMutation,
} = employeesApi;
