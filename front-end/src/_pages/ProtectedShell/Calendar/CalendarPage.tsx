import { Calendar } from "@/components/Calendar/modules/components/calendar/calendar";
import { CalendarSkeleton } from "@/components/Calendar/modules/components/calendar/skeletons/calendar-skeleton";
import React, { Suspense } from "react";

export default function CalendarPage() {
  return (
    <div>
      <Suspense fallback={<CalendarSkeleton />}>
        <Calendar />
      </Suspense>
    </div>
  );
}
