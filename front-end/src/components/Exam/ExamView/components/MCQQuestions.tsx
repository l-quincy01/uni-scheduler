import MarkdownViewer from "@/components/MarkdownViewer/MarkdownViewer";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function MCQQuestion({
  index,
  question,
  choices,

  mark_allocation,
}: {
  index: number;
  question: string;
  choices: string[];
  answerIndex: number;
  mark_allocation: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const alphabet = "ABCD";

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-4 items-start">
        <div className="text-lg font-semibold">{index}.</div>
        <MarkdownViewer markdown_source={question} />
      </div>
      <ol className="pl-8 flex flex-col gap-2 list-none">
        {choices.map((option, i) => (
          <li key={i} className="flex items-center gap-4">
            <Checkbox
              checked={selected === i}
              onCheckedChange={() =>
                setSelected((prev) => (prev === i ? null : i))
              }
            />
            {alphabet[i]}. {option}
          </li>
        ))}
        <li>
          <div className="flex w-full justify-end">
            {mark_allocation + " " + "Marks"}
          </div>
        </li>
      </ol>
    </div>
  );
}
