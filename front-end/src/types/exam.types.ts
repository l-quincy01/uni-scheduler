export type ExamSummary = {
  id: string;
  title: string;
  scheduleId: string | null;
  eventId: string | null;
  groupKey: string | null;
  groupTitle: string | null;
  createdAt: string;
};
export type ExamDetail = ExamSummary & { questions: any };
