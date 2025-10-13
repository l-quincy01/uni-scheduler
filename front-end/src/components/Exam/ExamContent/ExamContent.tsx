import ContentGrid from "@/components/Exam/ContentGrid";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router";

import { useCourseCalendar } from "@/_app/Context/CourseCalendarContext";
import { CalendarSkeleton } from "@/components/Calendar/modules/components/calendar/skeletons/calendar-skeleton";
import { Calendar } from "@/components/Calendar/modules/components/calendar/calendar";
import ExamContentPanel from "./ExamContentPanel";
import { getAllExams } from "@/_api/exams.api";

export default function ExamContent() {
  const { isCourseCalendarOpen } = useCourseCalendar();
  const [practiceExams, setPracticeExams] = useState<
    { id: string; title: string }[]
  >([]);
  const { id: scheduleId, groupKey } = useParams<{
    id: string;
    groupKey: string;
  }>();

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const exams = await getAllExams({
          scheduleId: scheduleId ?? undefined,
          groupKey: groupKey ?? undefined,
          signal: ac.signal,
        });
        const items = (exams || []).map((ex) => ({
          id: ex.id,
          title: ex.title,
        }));
        setPracticeExams(items);
      } catch {
        setPracticeExams([]);
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
            {practiceExams.length === 0 ? (
              <div className="flex flex-col items-center">
                <span className="text-xl font-semibold">No Exams Created.</span>
                <span className="text-md text-muted-foreground">
                  Click Add Exam Button To Start
                </span>
              </div>
            ) : (
              <ContentGrid variant="Thumbnail" items={practiceExams} />
            )}
          </>
        )}
      </div>
      <ExamContentPanel />
    </div>
  );
}
