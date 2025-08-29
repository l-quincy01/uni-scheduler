import MarkdownViewer from "@/components/MarkdownViewer/MarkdownViewer";
import { Textarea } from "@/components/ui/textarea";

export default function CompoundQuestion({
  index,
  main_question,
  sub_questions,
  mark_allocation,
}: {
  index: number;
  main_question: string;
  sub_questions: string[];
  mark_allocation: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <div className="text-lg font-semibold">{index}.</div>

        <div className="flex flex-row w-full justify-between">
          <MarkdownViewer markdown_source={main_question} />
          <div className="flex  justify-end">
            {mark_allocation + " " + "Marks"}
          </div>
        </div>
      </div>
      {sub_questions.map((q, i) => (
        <div key={i} className="pl-8 flex flex-col gap-2">
          <div className="flex gap-2 items-start">
            <div className="text-lg font-semibold">
              ({String.fromCharCode(97 + i)})
            </div>
            <MarkdownViewer markdown_source={q} />
          </div>
          <Textarea
            className="h-[100px] resize-none"
            placeholder="Type your answer here..."
          />
        </div>
      ))}
    </div>
  );
}
