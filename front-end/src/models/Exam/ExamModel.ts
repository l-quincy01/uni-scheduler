import type { Questions } from "./ExamQuestionsModel";

export interface examData {
  id: string;
  title: string;
  examQuestions: Questions[];
}
