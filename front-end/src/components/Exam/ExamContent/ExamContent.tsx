import ContentGrid from "@/components/Exam/ContentGrid";

import { Suspense } from "react";

import { useCourseCalendar } from "@/_app/Context/CourseCalendarContext";
import { CalendarSkeleton } from "@/components/Calendar/modules/components/calendar/skeletons/calendar-skeleton";
import { Calendar } from "@/components/Calendar/modules/components/calendar/calendar";
import ExamContentPanel from "./ExamContentPanel";

export default function ExamContent() {
  const { isCourseCalendarOpen } = useCourseCalendar();

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
            {contentGridData.practiceExams.length === 0 ? (
              <div className="flex flex-col items-center">
                <span className="text-xl font-semibold">No Exams Created.</span>
                <span className="text-md text-muted-foreground">
                  Click Add Exam Button To Start
                </span>
              </div>
            ) : (
              <ContentGrid
                variant="Thumbnail"
                items={contentGridData.practiceExams}
              />
            )}
          </>
        )}
      </div>
      <ExamContentPanel />
    </div>
  );
}

const contentGridData = {
  practiceExams: [
    {
      id: "a4",
      title: "Limits and series of functions",
      url: "history101",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
    {
      id: "a4",
      title: "Limits and series of functions",
      url: "history101",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
    {
      id: "a4",
      title: "Limits and series of functions",
      url: "history101",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
    {
      id: "a4",
      title: "Limits and series of functions",
      url: "history101",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
    {
      id: "a4",
      title: "Limits and series of functions",
      url: "history101",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
    {
      id: "a4",
      title: "Limits and series of functions",
      url: "history101",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
    {
      id: "a4",
      title: "Limits and series of functions",
      url: "history101",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
    {
      id: "a4",
      title: "Limits and series of functions",
      url: "history101",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
    {
      id: "a4",
      title: "Limits and series of functions",
      url: "history101",
      description: "Intro to study of limits and series of functions",
      date: "Date: 28 Apr 2025",
      author: "Quincy",
    },
  ],
};
