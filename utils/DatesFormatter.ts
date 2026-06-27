export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const addDays = (
  date: string | Date,
  days: number,
  returnIso = true,
): Date | string => {
  const d =
    typeof date === "string" ? new Date(`${date}T00:00:00Z`) : new Date(date);

  d.setUTCDate(d.getUTCDate() + days);

  return returnIso ? d.toISOString().slice(0, 10) : d;
};

export function formatDayLabel(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${Number(d)}`;
}

export const enumerateDays = (start: string, end: string): string[] => {
  const dates: string[] = [];

  const current = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);

  while (current <= last) {
    dates.push(current.toISOString().split("T")[0]);
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
};
