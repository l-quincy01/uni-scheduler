import type { IScheduleInput } from "@/components/Calendar/modules/components/calendar/interfaces";
import Kanban from "@/components/Dashboard/Kanban/Kanban";
import { scheduleToKanbanData } from "@/utils/scheduleToKanban";
import { useEffect, useState } from "react";
import { getAllSchedules } from "@/_api/Auth/requests";

export default function DashboardPage() {
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

  const KanbanData = scheduleToKanbanData({ schedules: schedules ?? [] });

  return (
    <div>
      {KanbanData.length > 0 ? (
        <Kanban boards={KanbanData} />
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-xl font-semibold">No Schedule Added.</span>
          <span className="text-md text-muted-foreground">
            Click Add Schedule Button To Start
          </span>
        </div>
      )}
    </div>
  );
}

// export const KanbanData = [
//   {
//     title: "3rd year Final Exams", // unite with schedule title
//     data: [
//       {
//         id: "001",
//         title: "Study: MAM 202 P2 - Linear Algebra", //combine events of the same subject
//         colorDot: "bg-blue-600", // unite with event object color
//         items: [
//           {
//             id: 101,
//             title: "Study: MAM 202 P2 - Linear Algebra (Session 1)", //unite with event object title
//             description: "Preparation for MAM 202 P2 - Linear Algebra", //unite with event object description
//             type: "Study", //leave as study
//             date: "2025-10-20", //unite with event object startDate
//           },
//           {
//             id: 101,
//             title: "Study: MAM 202 P2 - Linear Algebra (Session 2)", //unite with event object title
//             description: "Preparation for MAM 202 P2 - Linear Algebra", //unite with event object description
//             type: "Study", //leave as study
//             date: "2025-10-23", //unite with event object startDate
//           },
//         ],
//       },
//     ],
//   },
// ];
