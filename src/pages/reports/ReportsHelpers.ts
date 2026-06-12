export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const VEHICLE_COLORS: Record<string, string> = {
  bike: "#E8490F",
  auto: "#0D1B3E",
  mini_truck: "#43a047",
  truck: "#7c4dff",
};

export const getVehicleColor = (type: string) =>
  VEHICLE_COLORS[type.toLowerCase()] ?? "#888";

export const toYMD = (d: Date) => d.toISOString().split("T")[0];

// YYYY-MM-DD → DD/MM/YY
export const toDMY = (ymd: string): string => {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y.slice(2)}`;
};

// DD/MM/YY → YYYY-MM-DD (returns '' if incomplete, out-of-range, or calendar-invalid)
export const fromDMY = (dmy: string): string => {
  const parts = dmy.split("/");
  if (parts.length !== 3 || parts[2].length < 2) return "";
  const [d, m, y] = parts;
  const day = Number(d);
  const month = Number(m);
  if (!day || !month || day < 1 || day > 31 || month < 1 || month > 12) return "";
  const fullYear = 2000 + Number(y);
  if (Number.isNaN(fullYear)) return "";
  // Use Date to catch invalid calendar dates (e.g. Feb 30, Apr 31)
  const date = new Date(fullYear, month - 1, day);
  if (date.getFullYear() !== fullYear || date.getMonth() !== month - 1 || date.getDate() !== day) return "";
  return `${fullYear}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

// Strip digits and rebuild DD/MM/YY with auto-slashes
export const formatDateInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  if (!digits) return "";
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export type FilterType =
  | "today"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "custom";

export type GroupBy = "day" | "week" | "month" | "year" | "error";

export interface ResolvedRange {
  startDate: string;
  endDate: string;
  label: string;
  groupBy: GroupBy;
  labels: string[];
  message?: string;
}

export const PRESET_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This week" },
  { value: "this_month", label: "This month" },
  { value: "this_year", label: "This year" },
  { value: "last_year", label: "Last year" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "last_30_days", label: "Last 30 days" },
  { value: "last_90_days", label: "Last 90 days" },
];

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const startOfWeekMon = (d: Date): Date => {
  const day = d.getDay();
  const diff = (day + 6) % 7;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff);
};

export const ymdToDate = (ymd: string): Date => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const dateToYMD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dy = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dy}`;
};

export const resolveFilterToRange = (
  filter: FilterType,
  today: Date,
  customStart?: string,
  customEnd?: string,
): { start: Date; end: Date } => {
  switch (filter) {
    case "today": {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return { start: d, end: d };
    }
    case "this_week": {
      const start = startOfWeekMon(today);
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      return { start, end };
    }
    case "last_week": {
      const startThis = startOfWeekMon(today);
      const start = new Date(startThis.getFullYear(), startThis.getMonth(), startThis.getDate() - 7);
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      return { start, end };
    }
    case "this_month": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start, end };
    }
    case "last_month": {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return { start, end };
    }
    case "this_year":
      return {
        start: new Date(today.getFullYear(), 0, 1),
        end: new Date(today.getFullYear(), 11, 31),
      };
    case "last_year":
      return {
        start: new Date(today.getFullYear() - 1, 0, 1),
        end: new Date(today.getFullYear() - 1, 11, 31),
      };
    case "last_7_days":
      return {
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      };
    case "last_30_days":
      return {
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      };
    case "last_90_days":
      return {
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 89),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      };
    case "custom":
      return {
        start: customStart ? ymdToDate(customStart) : today,
        end: customEnd ? ymdToDate(customEnd) : today,
      };
  }
};

const groupByForDays = (days: number): GroupBy => {
  if (days > 3650) return "error";
  if (days > 365) return "year";
  if (days > 30) return "month";
  if (days > 7) return "week";
  return "day";
};

const buildLabels = (start: Date, end: Date, groupBy: GroupBy): string[] => {
  if (groupBy === "error") return [];
  const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;

  if (groupBy === "day") {
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return WEEKDAY_LABELS[d.getDay()];
    });
  }
  if (groupBy === "week") {
    const weeks = Math.min(5, Math.ceil(days / 7));
    return Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);
  }
  if (groupBy === "month") {
    const out: string[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cursor <= end) {
      out.push(MONTH_LABELS[cursor.getMonth()]);
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return out;
  }
  const fy = start.getFullYear();
  const ty = end.getFullYear();
  return Array.from({ length: ty - fy + 1 }, (_, i) => String(fy + i));
};

const buildHumanLabel = (start: Date, end: Date, groupBy: GroupBy): string => {
  if (groupBy === "error") {
    return `${start.getFullYear()} – ${end.getFullYear()}`;
  }
  if (groupBy === "year" || groupBy === "month") {
    return `${MONTH_LABELS[start.getMonth()]} ${start.getFullYear()} – ${MONTH_LABELS[end.getMonth()]} ${end.getFullYear()}`;
  }
  const sameYear = start.getFullYear() === end.getFullYear();
  if (sameYear) {
    return `${MONTH_LABELS[start.getMonth()]} ${start.getDate()} – ${MONTH_LABELS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${MONTH_LABELS[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()} – ${MONTH_LABELS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
};

export const resolveDateRange = (
  filter: FilterType,
  today: Date,
  customStart?: string,
  customEnd?: string,
): ResolvedRange => {
  const { start, end } = resolveFilterToRange(filter, today, customStart, customEnd);
  const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
  const groupBy = groupByForDays(days);
  const labels = buildLabels(start, end, groupBy);
  const label = buildHumanLabel(start, end, groupBy);
  const out: ResolvedRange = {
    startDate: dateToYMD(start),
    endDate: dateToYMD(end),
    label,
    groupBy,
    labels,
  };
  if (groupBy === "error") {
    out.message = "Date range too large. Please select a range of 10 years or less.";
  }
  return out;
};

// Deterministic pseudo-random so bars are stable per label/seed
export const stubDeliveries = (seed: string): number => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return 40 + (Math.abs(h) % 160);
};
