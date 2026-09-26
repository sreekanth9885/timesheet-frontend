import { api } from "../services/api";
import type {
  ApiResponse,
  SettingRow,
  SettingsPayload,
} from "../types/settingsTypes";

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<Record<string, string>, void>({
      query: () => "/settings",
      transformResponse: (res: ApiResponse<SettingRow[]>) => {
        if (!res?.success || !Array.isArray(res.data)) return {};
        return res.data.reduce<Record<string, string>>((acc, row) => {
          acc[row.setting_key] = row.setting_value;
          return acc;
        }, {});
      },
      providesTags: ["Settings"],
    }),

    /**
     * Fan-out: one client mutation → N parallel PUTs.
     * Fails on the first error encountered (matches the original Promise.all).
     * invalidatesTags auto-refetches getSettings after success.
     */
    saveSettings: builder.mutation<void, SettingsPayload>({
      async queryFn(payload, _api, _extraOptions, baseQuery) {
        const entries = Object.entries(payload) as Array<
          [string, string | undefined]
        >;

        const requests = entries
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) =>
            baseQuery({
              url: `/settings/${key}`,
              method: "PUT",
              body: { setting_value: value },
            }),
          );

        const results = await Promise.all(requests);
        const failure = results.find((r) => "error" in r);
        if (failure && "error" in failure) {
          return { error: failure.error };
        }
        return { data: undefined };
      },
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useSaveSettingsMutation } = settingsApi;
