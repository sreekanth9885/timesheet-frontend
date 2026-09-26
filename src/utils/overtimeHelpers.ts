export const STATUS_BADGE: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export const getStatusBadge = (status?: string): string =>
  STATUS_BADGE[(status ?? "pending").toLowerCase()] ?? STATUS_BADGE.pending;

export const formatDate = (val?: string): string =>
  val ? val.split("T")[0] : "N/A";

export const formatExtraHours = (val: number): string =>
  `+${Number(val ?? 0).toFixed(1)} hrs`;

/** Centralised uploads URL — override via VITE_UPLOADS_URL in .env. */
export const getUploadUrl = (filename: string): string => {
  const base =
    import.meta.env.VITE_UPLOADS_URL ?? "http://localhost:3000/uploads";
  return `${base}/${filename}`;
};

export const todayISO = (): string => new Date().toISOString().split("T")[0];
