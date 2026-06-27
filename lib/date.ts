import { addDays, MONTHS } from "@/utils/DatesFormatter";

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
