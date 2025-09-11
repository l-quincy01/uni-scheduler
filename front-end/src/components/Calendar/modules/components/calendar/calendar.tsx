import React from "react";
import { CalendarBody } from "@/components/Calendar/modules/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/Calendar/modules/components/calendar/contexts/calendar-context";
import { DndProvider } from "@/components/Calendar/modules/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/components/Calendar/modules/components/calendar/header/calendar-header";

// No external data fetch; using provided schedules constant

// const schedule = {
//   schedules: [
//     {
//       title: "Final Exams Study Schedule",
//       timezone: "Africa/Johannesburg",
//       events: [
//         {
//           title:
//             "Study: Alternative - Psychology Honours - Creative Therapies & Therapeutic Intervention (Session 1)",
//           description:
//             "Preparation for Creative Therapies & Therapeutic Intervention exam",
//           color: "red",
//           startDate: "2025-09-12T09:00:00+02:00",
//           endDate: "2025-09-12T11:00:00+02:00",
//         },
//         {
//           title:
//             "Study: Alternative - Psychology Honours - Creative Therapies & Therapeutic Intervention (Session 2)",
//           description: "Deep dive into key therapeutic intervention topics",
//           color: "red",
//           startDate: "2025-09-19T09:00:00+02:00",
//           endDate: "2025-09-19T11:00:00+02:00",
//         },
//         {
//           title:
//             "Study: Alternative - Psychology Honours - Development Psychology (Session 1)",
//           description: "Preparation for Development Psychology exam",
//           color: "blue",
//           startDate: "2025-09-13T14:00:00+02:00",
//           endDate: "2025-09-13T16:00:00+02:00",
//         },
//         {
//           title: "Study: Psychology 102 Paper 2 (Session 1)",
//           description: "Preparation for Psychology 102 Paper 2 exam",
//           color: "green",
//           startDate: "2025-09-14T10:00:00+02:00",
//           endDate: "2025-09-14T12:00:00+02:00",
//         },
//       ],
//       exams: [
//         {
//           title:
//             "Alternative: Psychology Honours - Creative Therapies & Therapeutic Intervention",
//           description: "Exam",
//           color: "red",
//           startDate: "2025-10-17T08:30:00+02:00",
//           endDate: "2025-10-17T08:30:00+02:00",
//         },
//         {
//           title: "Alternative: Psychology Honours - Development Psychology",
//           description: "Exam",
//           color: "blue",
//           startDate: "2025-10-17T08:30:00+02:00",
//           endDate: "2025-10-17T08:30:00+02:00",
//         },
//         {
//           title: "Psychology 102 Paper 2",
//           description: "Exam",
//           color: "green",
//           startDate: "2025-10-17T08:30:00+02:00",
//           endDate: "2025-10-17T08:30:00+02:00",
//         },
//       ],
//     },
//   ],
// };

const schedule = {
  schedules: [
    {
      title: "3rd year Final Exams",
      timezone: "Africa/Johannesburg",
      events: [
        {
          title: "Study: MAM 202 P2 - Linear Algebra (Session 1)",
          description: "Preparation for MAM 202 P2 - Linear Algebra",
          color: "blue",
          startDate: "2025-10-20T09:00:00+02:00",
          endDate: "2025-10-20T11:00:00+02:00",
        },
        {
          title: "Study: MAM 202 P2 - Linear Algebra (Session 2)",
          description: "Preparation for MAM 202 P2 - Linear Algebra",
          color: "blue",
          startDate: "2025-10-23T14:00:00+02:00",
          endDate: "2025-10-23T16:00:00+02:00",
        },
        {
          title: "Study: MAM 202 P1 - Algebra & Analysis (Session 1)",
          description: "Preparation for MAM 202 P1 - Algebra & Analysis",
          color: "green",
          startDate: "2025-10-25T09:00:00+02:00",
          endDate: "2025-10-25T11:00:00+02:00",
        },
        {
          title: "Study: MAM 202 P1 - Algebra & Analysis (Session 2)",
          description: "Preparation for MAM 202 P1 - Algebra & Analysis",
          color: "green",
          startDate: "2025-11-01T14:00:00+02:00",
          endDate: "2025-11-01T16:00:00+02:00",
        },
        {
          title: "Study: Computer Science 301 - WebTech (Session 1)",
          description: "Preparation for Computer Science 301 - WebTech",
          color: "red",
          startDate: "2025-10-28T09:00:00+02:00",
          endDate: "2025-10-28T11:00:00+02:00",
        },
        {
          title: "Study: Computer Science 301 - WebTech (Session 2)",
          description: "Preparation for Computer Science 301 - WebTech",
          color: "red",
          startDate: "2025-11-02T14:00:00+02:00",
          endDate: "2025-11-02T16:00:00+02:00",
        },
        {
          title: "Study: Computer Science 301 - PLT (Session 1)",
          description: "Preparation for Computer Science 301 - PLT",
          color: "yellow",
          startDate: "2025-11-03T09:00:00+02:00",
          endDate: "2025-11-03T11:00:00+02:00",
        },
        {
          title: "Study: Computer Science 301 - PLT (Session 2)",
          description: "Preparation for Computer Science 301 - PLT",
          color: "yellow",
          startDate: "2025-11-07T14:00:00+02:00",
          endDate: "2025-11-07T16:00:00+02:00",
        },
        {
          title: "Study: Information Systems 302 Paper 2 (Session 1)",
          description: "Preparation for Information Systems 302 Paper 2",
          color: "purple",
          startDate: "2025-11-01T09:00:00+02:00",
          endDate: "2025-11-01T11:00:00+02:00",
        },
        {
          title: "Study: Information Systems 302 Paper 2 (Session 2)",
          description: "Preparation for Information Systems 302 Paper 2",
          color: "purple",
          startDate: "2025-11-04T14:00:00+02:00",
          endDate: "2025-11-04T16:00:00+02:00",
        },
        {
          title: "Study: Information Systems 302 Paper 1 (Session 1)",
          description: "Preparation for Information Systems 302 Paper 1",
          color: "orange",
          startDate: "2025-11-06T09:00:00+02:00",
          endDate: "2025-11-06T11:00:00+02:00",
        },
        {
          title: "Study: Information Systems 302 Paper 1 (Session 2)",
          description: "Preparation for Information Systems 302 Paper 1",
          color: "orange",
          startDate: "2025-11-09T14:00:00+02:00",
          endDate: "2025-11-09T16:00:00+02:00",
        },
      ],
      exams: [
        {
          title: "MAM 202 P2 - Linear Algebra",
          description: "Exam",
          color: "blue",
          startDate: "2025-10-28T08:30:00+02:00",
          endDate: "2025-10-28T10:30:00+02:00",
        },
        {
          title: "MAM 202 P1 - Algebra & Analysis",
          description: "Exam",
          color: "green",
          startDate: "2025-11-04T08:30:00+02:00",
          endDate: "2025-11-04T10:30:00+02:00",
        },
        {
          title: "Computer Science 301 - PLT",
          description: "Exam",
          color: "yellow",
          startDate: "2025-11-10T08:30:00+02:00",
          endDate: "2025-11-10T10:30:00+02:00",
        },
        {
          title: "Computer Science 301 - WebTech",
          description: "Exam",
          color: "red",
          startDate: "2025-11-05T08:30:00+02:00",
          endDate: "2025-11-05T10:30:00+02:00",
        },
        {
          title: "Information Systems 302 Paper 1",
          description: "Exam",
          color: "orange",
          startDate: "2025-11-13T08:30:00+02:00",
          endDate: "2025-11-13T10:30:00+02:00",
        },
        {
          title: "Information Systems 302 Paper 2",
          description: "Exam",
          color: "purple",
          startDate: "2025-11-07T08:30:00+02:00",
          endDate: "2025-11-07T10:30:00+02:00",
        },
      ],
    },
  ],
};

export async function Calendar() {
  return (
    <CalendarProvider schedules={schedule.schedules} view="month">
      <DndProvider showConfirmation={false}>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
