export type NavSchedule = {
  id: string;
  title: string;
  url: "/exam";
  isActive: boolean;
};

export type createSchedule = {
  message: string;
  schedules: {
    id: string;
    title: string;
    timezone: string;
  }[];
};
