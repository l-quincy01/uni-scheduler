export type CalendarUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  school?: string | null;
  avatarUrl?: string | null;
};

export type CalendarEvent = {
  id: string;
  scheduleId: string;
  title: string;
  description: string;
  color: string;
  startDate: string;
  endDate: string;
  user: CalendarUser | null;
};
