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
