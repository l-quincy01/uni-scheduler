import ContentGrid from "@/components/Exam/ContentGrid";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router";

import { useCourseCalendar } from "@/_app/Context/CourseCalendarContext";
import { CalendarSkeleton } from "@/components/Calendar/modules/components/calendar/skeletons/calendar-skeleton";
import { Calendar } from "@/components/Calendar/modules/components/calendar/calendar";
import ExamContentPanel from "./ExamContentPanel";
import { getAllExams } from "@/_api/exams.api";
import type { ExamSummary } from "@/types/exam.types";

export default function ExamContent() {
  const { scheduleId, groupKey } = useParams();

  const { isCourseCalendarOpen } = useCourseCalendar();

  const [examObject, setExamObject] = useState<ExamSummary[]>();

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const examData = await getAllExams({
          scheduleId: scheduleId ?? undefined,
          groupKey: groupKey ?? undefined,
          signal: ac.signal,
        });

        setExamObject(examData);
      } catch (e: any) {
        console.log("Error getting exam object:", e);
      }
    })();
    return () => ac.abort();
  }, [scheduleId, groupKey]);

  return (
    <div className="flex py-4 ">
      <div className=" w-full min-h-screen">
        {" "}
        {isCourseCalendarOpen ? (
          <Suspense fallback={<CalendarSkeleton />}>
            <Calendar />
          </Suspense>
        ) : (
          <>
            {examObject ? (
              <div className="flex flex-col items-center">
                <span className="text-xl font-semibold">No Exams Created.</span>
                <span className="text-md text-muted-foreground">
                  Click Add Exam Button To Start
                </span>
              </div>
            ) : (
              <ContentGrid variant="Thumbnail" items={examObject!} />
            )}
          </>
        )}
      </div>
      <ExamContentPanel />
    </div>
  );
}
