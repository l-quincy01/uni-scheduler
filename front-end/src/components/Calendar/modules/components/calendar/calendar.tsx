import React from "react";
import { CalendarBody } from "@/components/Calendar/modules/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/Calendar/modules/components/calendar/contexts/calendar-context";
import { DndProvider } from "@/components/Calendar/modules/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/components/Calendar/modules/components/calendar/header/calendar-header";

import type { IEvent } from "@/components/Calendar/modules/components/calendar/interfaces";
import type { TEventColor } from "@/components/Calendar/modules/components/calendar/types";

const schedule = {
  schedules: [
    {
      title: "Final Exams Study Schedule",
      timezone: "Africa/Johannesburg",
      events: [
        {
          title:
            "Study: Alternative - Psychology Honours - Creative Therapies & Therapeutic Intervention (Session 1)",
          description:
            "Preparation for Creative Therapies & Therapeutic Intervention exam",
          color: "red",
          startDate: "2025-09-12T09:00:00+02:00",
          endDate: "2025-09-12T11:00:00+02:00",
        },
        {
          title:
            "Study: Alternative - Psychology Honours - Creative Therapies & Therapeutic Intervention (Session 2)",
          description: "Deep dive into key therapeutic intervention topics",
          color: "red",
          startDate: "2025-09-19T09:00:00+02:00",
          endDate: "2025-09-19T11:00:00+02:00",
        },
      ],
      exams: [
        {
          title:
            "Study: Alternative - Psychology Honours - Creative Therapies & Therapeutic Intervention (Session 1)",
          description: "Exam",
          color: "red",
          startDate: "2025-10-17T08:30:00+02:00",
          endDate: "2025-10-17T08:30:00+02:00",
        },
      ],
    },
    {
      title: "Final Exams Study Schedule",
      timezone: "Africa/Johannesburg",
      events: [
        {
          title:
            "Study: Alternative - Psychology Honours - Creative Therapies & Therapeutic Intervention (Session 1)",
          description:
            "Preparation for Creative Therapies & Therapeutic Intervention exam",
          color: "red",
          startDate: "2025-09-12T09:00:00+02:00",
          endDate: "2025-09-12T11:00:00+02:00",
        },
        {
          title:
            "Study: Alternative - Psychology Honours - Creative Therapies & Therapeutic Intervention (Session 2)",
          description: "Deep dive into key therapeutic intervention topics",
          color: "red",
          startDate: "2025-09-19T09:00:00+02:00",
          endDate: "2025-09-19T11:00:00+02:00",
        },
      ],
    },
  ],
};

async function getCalendarData() {
  const events: IEvent[] = schedule.events.map((e, idx) => ({
    id: idx + 1,
    title: e.title,
    description: e.description,
    color: e.color as TEventColor,
    startDate: e.startDate,
    endDate: e.endDate,
  }));

  return { events };
}

export async function Calendar() {
  const { events } = await getCalendarData();

  return (
    <CalendarProvider events={events} view="month">
      <DndProvider showConfirmation={false}>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
