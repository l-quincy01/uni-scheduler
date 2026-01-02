import React, { createContext, useContext, useState, ReactNode } from "react";

interface CourseCalendarContextType {
  isCourseCalendarOpen: boolean;
  setCourseCalendarOpen: (open: boolean) => void;
}

const CourseCalendarContext = createContext<
  CourseCalendarContextType | undefined
>(undefined);

export function CourseCalendarProvider({ children }: { children: ReactNode }) {
  const [isCourseCalendarOpen, setCourseCalendarOpen] = useState(false);

  return (
    <CourseCalendarContext.Provider
      value={{ isCourseCalendarOpen, setCourseCalendarOpen }}
    >
      {children}
    </CourseCalendarContext.Provider>
  );
}

export function useCourseCalendar() {
  const context = useContext(CourseCalendarContext);
  if (!context) {
    throw new Error(
      "useCourseCalendar must be used within a CourseCalendarProvider"
    );
  }
  return context;
}
