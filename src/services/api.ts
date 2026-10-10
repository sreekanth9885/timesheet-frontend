import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";

import type { RootState } from "../store";
import type { LoginRequest, LoginResponse, User } from "../types";

import {
  getClientPublicKey,
  decryptProjectData,
} from "../utils/projectEncryption";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Standard RTK Query base query.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

/**
 * Check whether the request targets:
 * GET /projects
 * GET /projects/:id
 */
function isProjectGetRequest(request: FetchArgs): boolean {
  const method = (request.method || "GET").toUpperCase();

  if (method !== "GET") {
    return false;
  }

  const pathname = request.url.split("?")[0].replace(/\/+$/, "");

  return /(?:^|\/)projects(?:\/[^/]+)?$/.test(pathname);
}

/**
 * Normalize all supported header formats safely.
 */
function createHeaders(initialHeaders: FetchArgs["headers"]): Headers {
  const headers = new Headers();

  if (!initialHeaders) {
    return headers;
  }

  if (initialHeaders instanceof Headers) {
    initialHeaders.forEach((value, key) => {
      headers.set(key, value);
    });

    return headers;
  }

  if (Array.isArray(initialHeaders)) {
    for (const entry of initialHeaders) {
      const [key, value] = entry;

      if (typeof key === "string" && typeof value === "string") {
        headers.set(key, value);
      }
    }

    return headers;
  }

  for (const [key, value] of Object.entries(initialHeaders)) {
    if (typeof value === "string") {
      headers.set(key, value);
    }
  }

  return headers;
}

/**
 * Custom base query with project response decryption.
 */
const baseQueryWithProjectDecryption: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, apiContext, extraOptions) => {
  const request: FetchArgs =
    typeof args === "string" ? { url: args } : { ...args };

  const shouldDecrypt = isProjectGetRequest(request);

  if (shouldDecrypt) {
    try {
      const publicKey = await getClientPublicKey();
      const headers = createHeaders(request.headers);

      headers.set("x-client-public-key", publicKey);
      headers.set("Cache-Control", "no-store");

      request.headers = headers;
      request.responseHandler = "text";
    } catch (error: unknown) {
      return {
        error: {
          status: "CUSTOM_ERROR",
          error:
            error instanceof Error
              ? error.message
              : "Unable to generate the project encryption key",
        },
      };
    }
  }

  const result = await rawBaseQuery(request, apiContext, extraOptions);

  if ("error" in result) {
    return { error: result.error, meta: result.meta };
  }

  if (!shouldDecrypt) {
    return {
      data: result.data,
      meta: result.meta,
    };
  }

  let parsedResponse: unknown;

  try {
    parsedResponse =
      typeof result.data === "string" ? JSON.parse(result.data) : result.data;
  } catch (error: unknown) {
    const responseText =
      typeof result.data === "string" ? result.data : String(result.data ?? "");

    return {
      error: {
        status: "PARSING_ERROR",
        originalStatus: result.meta?.response?.status ?? 200,
        data: responseText,
        error:
          error instanceof Error
            ? error.message
            : "Failed to parse the project API response",
      },
      meta: result.meta,
    };
  }

  try {
    if (
      parsedResponse !== null &&
      typeof parsedResponse === "object" &&
      "success" in parsedResponse &&
      "data" in parsedResponse &&
      parsedResponse.success === true
    ) {
      const response = parsedResponse as {
        success: boolean;
        data: unknown;
        [key: string]: unknown;
      };

      const decryptedData = await decryptProjectData(response.data);

      return {
        data: {
          ...response,
          data: decryptedData,
        },
        meta: result.meta,
      };
    }

    return {
      data: parsedResponse,
      meta: result.meta,
    };
  } catch (error: unknown) {
    return {
      error: {
        status: "CUSTOM_ERROR",
        error:
          error instanceof Error
            ? error.message
            : "Unable to decrypt the project API response",
      },
      meta: result.meta,
    };
  }
};

/**
 * Main API service.
 */
export const api = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithProjectDecryption,

  tagTypes: [
    "Auth",
    "Project",
    "Projects",
    "Approvals",
    "AuditLogs",
    "Dashboard",
    "Timesheets",
    "Departments",
    "Employees",
    "Overtime",
    "Reports",
    "Settings",
    "Tasks",
  ],

  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<unknown, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    getMe: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = api;
