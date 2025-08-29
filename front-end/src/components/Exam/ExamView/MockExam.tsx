import type { Questions } from "@/models/Exam/ExamQuestionsModel";
import CompoundGroupedQuestions from "./components/CompoundGroupedQuestions";
import CompoundQuestion from "./components/CompoundQuestions";
import GroupedQuestions from "./components/GroupedQuestions";
import MCQQuestion from "./components/MCQQuestions";
import TextQuestion from "./components/TextQuestion";

interface MockExamProps {
  questions: Questions[];
}

export default function MockExam({ questions }: MockExamProps) {
  return (
    <div className="flex flex-col gap-16">
      {questions.map((q, i) => {
        switch (q.type) {
          case "mcq":
            return (
              <div className="pdf-block">
                <MCQQuestion
                  key={i}
                  index={i + 1}
                  question={q.details.question!}
                  choices={q.details.choices!}
                  answerIndex={q.details.answerIndex}
                  mark_allocation={q.details.mark_allocation}
                />{" "}
              </div>
            );

          case "question":
            return (
              <div className="pdf-block">
                <TextQuestion
                  key={i}
                  index={i + 1}
                  question={q.details.question!}
                  mark_allocation={q.details.mark_allocation}
                />
              </div>
            );

          case "compoundQuestion":
            return (
              <div className="pdf-block">
                <CompoundQuestion
                  key={i}
                  index={i + 1}
                  main_question={q.details.main_question!}
                  sub_questions={q.details.sub_questions!}
                  mark_allocation={q.details.mark_allocation}
                />
              </div>
            );

          case "compoundGroupedQuestions":
            return (
              <div className="pdf-block">
                <CompoundGroupedQuestions
                  key={i}
                  index={i + 1}
                  main_question={q.details.main_question}
                  topic={q.details.topic}
                  groupedQuestions={q.details.groupedQuestions!}
                />
              </div>
            );

          case "GroupedQuestions":
            return (
              <div className="pdf-block">
                <GroupedQuestions
                  key={i}
                  index={i + 1}
                  topic={q.details.topic!}
                  groupedQuestions={q.details.groupedQuestions!}
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

/*

 toast("Event has been created", {
          description: "PDF Export failed.",
    
        })

 toast("Event has been created", {
          description: "Exporting to PDF",
    
        })
 toast("Event has been created", {
          description: "Successfully Downloaded",
    
        })


*/
