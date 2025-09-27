import type { TEventColor } from "@/components/Calendar/modules/components/calendar/types";

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface IEvent {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  description: string;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}

export interface IScheduleItemInput {
  id: string;
  title: string;
  description: string;
  color: TEventColor;
  startDate: string;
  endDate: string;
}

export interface IScheduleInput {
  title: string;
  timezone: string;
  events: IScheduleItemInput[];
  exams: IScheduleItemInput[];
}
