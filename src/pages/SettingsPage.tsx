import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  useGetSettingsQuery,
  useSaveSettingsMutation,
} from "../services/settingsApi";
import type { SettingsForm, SettingsPayload } from "../types/settingsTypes";
import { DEFAULT_FORM, SETTING_FIELDS } from "../config/settingFields";
import { SettingField } from "../components/settings/SettingField";

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(DEFAULT_FORM);
  const [dirty, setDirty] = useState(false);

  const { data: settings, isLoading, isError } = useGetSettingsQuery();
  const [saveSettings, { isLoading: saving }] = useSaveSettingsMutation();

  /**
   * Sync form ← server whenever the server data changes, but only while
   * the user hasn't typed anything (dirty = false). Prevents clobbering
   * edits when RTK Query refetches in the background.
   */
  useEffect(() => {
    if (dirty || !settings) return;
    const next = { ...DEFAULT_FORM };
    for (const field of SETTING_FIELDS) {
      next[field.formKey] = settings[field.settingKey] ?? field.defaultValue;
    }
    setForm(next);
  }, [settings, dirty]);

  const handleFieldChange = (formKey: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [formKey]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    const payload: SettingsPayload = {};
    for (const field of SETTING_FIELDS) {
      payload[field.settingKey] = form[field.formKey];
    }

    try {
      await saveSettings(payload).unwrap();
      setDirty(false); // allow the invalidation-triggered refetch to re-sync
      toast.success("System settings saved successfully!");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to save settings";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            System Settings &amp; Policies
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure daily standard hours, overtime thresholds, and business
            rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <svg
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Layout: sidebar nav + content */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <nav className="flex flex-col gap-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
            Work Hours &amp; OT
          </span>
        </nav>

        {/* Settings card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">
              Working Hours &amp; Overtime Engine
            </h3>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading settings...
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-red-500">
                Failed to load settings.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {SETTING_FIELDS.map((field) => (
                  <SettingField
                    key={field.formKey}
                    label={field.label}
                    help={field.help}
                    placeholder={field.placeholder}
                    value={form[field.formKey]}
                    fullWidth={field.fullWidth}
                    onChange={(v) => handleFieldChange(field.formKey, v)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
