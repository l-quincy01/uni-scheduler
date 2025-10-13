import React, { useEffect, useState } from "react";
import { CalendarBody } from "@/components/Calendar/modules/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/Calendar/modules/components/calendar/contexts/calendar-context";
import { DndProvider } from "@/components/Calendar/modules/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/components/Calendar/modules/components/calendar/header/calendar-header";

import type { IScheduleInput } from "@/components/Calendar/modules/components/calendar/interfaces";
import { getAllSchedules } from "@/_api/schedules.api";

export function Calendar() {
  const [schedules, setSchedules] = useState<IScheduleInput[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await getAllSchedules();
        if (mounted) setSchedules(s);
      } catch {
        if (mounted) setSchedules([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <CalendarProvider schedules={schedules} view="month">
      <DndProvider showConfirmation={false}>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
