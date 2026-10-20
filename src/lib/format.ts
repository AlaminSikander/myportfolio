const monthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const shortDateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function toDate(value: string | Date) {
  if (value instanceof Date) return value;
  return /^\d{4}-\d{2}(-\d{2})?$/.test(value) ? new Date(`${value.slice(0, 7)}-${value.slice(8, 10) || "01"}T00:00:00Z`) : new Date(value);
}

export function formatMonthYear(value: string | Date) {
  return monthYear.format(toDate(value));
}

export function formatPeriod(start: string, end: string | null | undefined, current: boolean) {
  return `${formatMonthYear(start)} – ${current || !end ? "Present" : formatMonthYear(end)}`;
}

export function formatDate(value: string | Date) {
  return longDate.format(toDate(value));
}

export function formatDateTime(value: string | Date) {
  return shortDateTime.format(toDate(value));
}

/** "https://www.example.com/path/" → "example.com/path" */
export function displayUrl(url: string | null | undefined) {
  if (!url) return "";
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

/** Database `date` values ("2026-02-01") ↔ `<input type="month">` values ("2026-02"). */
export function toMonthInput(value: string | null | undefined) {
  return value ? value.slice(0, 7) : "";
}

export function fromMonthInput(value: string | null | undefined) {
  return value ? `${value.slice(0, 7)}-01` : null;
}
