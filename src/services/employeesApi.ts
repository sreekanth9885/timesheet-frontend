import { api } from "../services/api";
import type { Department } from "../types/departmentTypes";
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
        providesTags: ["Employees"],
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
      invalidatesTags: ["Employees"],
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
      invalidatesTags: ["Employees"],
    }),

    terminateEmployee: builder.mutation<void, number>({
      query: (id) => ({ url: `/employees/${id}`, method: "DELETE" }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const {
  useGetEmployeeDirectoryQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useTerminateEmployeeMutation,
} = employeesApi;
