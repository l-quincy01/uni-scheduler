import type { TEventColor } from "@/modules/components/calendar/types";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  school?: string | null;
  avatarUrl?: string | null;
}

export interface IEvent {
  id: string;
  scheduleId: string;
  title: string;
  description: string;
  color: string;
  startDate: string; // ISO
  endDate: string; // ISO
  user: IUser | null;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
