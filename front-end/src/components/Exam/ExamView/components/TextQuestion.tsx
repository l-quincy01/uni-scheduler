import MarkdownViewer from "@/components/Exam/ExamView/components/MarkdownViewer/MarkdownViewer";
import { Textarea } from "@/components/ui/textarea";

export default function TextQuestion({
  index,
  question,
  mark_allocation,
}: {
  index: number;
  question: string;
  mark_allocation: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <div className="text-lg font-semibold">{index}.</div>
        <MarkdownViewer markdown_source={question} />
      </div>
      <Textarea
        className="h-[100px] resize-none"
        placeholder="Type your answer here..."
      />
      <div className="flex w-full justify-end">
        {mark_allocation + " " + "Marks"}
      </div>
    </div>
  );
}
