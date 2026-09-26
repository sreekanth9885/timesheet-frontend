/**
 * Serialise an array of flat objects to a CSV file and trigger a download.
 * Returns false if there is nothing to export.
 */
export function exportRowsToCsv<T extends Record<string, unknown>>(
  rows: T[],
  filename: string,
): boolean {
  if (!rows.length) return false;

  const headers = Object.keys(rows[0]).join(",");
  const body = rows
    .map((row) =>
      Object.values(row)
        .map((v) => `"${v ?? ""}"`)
        .join(","),
    )
    .join("\n");

  const csv = `${headers}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}
