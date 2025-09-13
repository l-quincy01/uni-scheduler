import React from "react";
import MarkdownViewer from "@/components/Exam/ExamView/components/MarkdownViewer/MarkdownViewer";
import { Textarea } from "@/components/ui/textarea";

interface GroupedQuestionsProps {
  index: number;
  topic: string;
  groupedQuestions: {
    question: string;
    model_answer?: string;
    mark_allocation: number;
  }[];
}

export default function GroupedQuestions({
  index,
  topic,
  groupedQuestions,
}: GroupedQuestionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 items-start">
        <div className="text-lg font-semibold">
          Question {index}. [
          {groupedQuestions.reduce((sum, q) => sum + q.mark_allocation, 0)}{" "}
          marks]
        </div>
        <div className="italic text-muted-foreground">{topic}</div>
      </div>

      {groupedQuestions.map((q, i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="flex gap-4 items-start">
            <div className="text-lg font-semibold">
              {index}.{i + 1}
            </div>
            <MarkdownViewer markdown_source={q.question} />
          </div>
          <Textarea
            className="h-[100px] resize-none"
            placeholder="Type your answer here..."
          />
          <div className="flex w-full justify-end">
            {q.mark_allocation + " " + "Marks"}
          </div>
        </div>
      ))}
    </div>
  );
}
