import { User } from "@/services/api/types";

export type WeekMeta = {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  dateLabel: string;
};

export interface MockUser extends User {
  password: string;
}
