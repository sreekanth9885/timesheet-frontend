export type SettingKey =
  | "working_hours_per_day"
  | "max_hours_per_day"
  | "overtime_threshold";

/** Raw row as returned by GET /settings. */
export type SettingRow = {
  setting_key: string;
  setting_value: string;
};

/** Normalized map: key → value, as the page consumes it. */
export type SettingsMap = Record<string, string | undefined>;

/** Local form state — everything is a string (matches DOM input semantics). */
export type SettingsForm = {
  working_hours_per_day: string;
  max_hours_per_day: string;
  overtime_threshold: string;
};

/** Payload for saveSettings — same three keys, sent as strings. */
export type SettingsPayload = Partial<Record<SettingKey, string>>;

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};
