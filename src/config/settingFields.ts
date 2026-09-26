import type { SettingKey, SettingsForm } from "../types/settingsTypes";

export interface SettingFieldDef {
  /** Local form-state key. */
  formKey: keyof SettingsForm;
  /** Server-side setting key (used in the PUT URL + payload). */
  settingKey: SettingKey;
  label: string;
  help: string;
  placeholder: string;
  /** Fallback used when the server doesn't return a value. */
  defaultValue: string;
  /** Spans both columns in the 2-column grid. */
  fullWidth?: boolean;
}

export const SETTING_FIELDS: SettingFieldDef[] = [
  {
    formKey: "working_hours_per_day",
    settingKey: "working_hours_per_day",
    label: "Standard Hours Per Day",
    help: "Expected employee baseline hours.",
    placeholder: "8",
    defaultValue: "8",
  },
  {
    formKey: "max_hours_per_day",
    settingKey: "max_hours_per_day",
    label: "Max Allowed Hours Per Day",
    help: "Hard cap to prevent excessive time logging.",
    placeholder: "16",
    defaultValue: "16",
  },
  {
    formKey: "overtime_threshold",
    settingKey: "overtime_threshold",
    label: "Overtime Trigger Threshold (Hours)",
    help: "Daily logged hours exceeding this number automatically generate an overtime request.",
    placeholder: "8",
    defaultValue: "8",
    fullWidth: true,
  },
];

export const DEFAULT_FORM: SettingsForm = SETTING_FIELDS.reduce(
  (acc, f) => ({ ...acc, [f.formKey]: f.defaultValue }),
  {} as SettingsForm,
);
