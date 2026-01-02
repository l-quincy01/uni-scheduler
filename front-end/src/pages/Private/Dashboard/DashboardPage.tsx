import { getAllSchedules } from "@/api/schedules.api/schedules.api";
import type { IScheduleInput } from "@/components/Calendar/modules/components/calendar/interfaces";
import Kanban from "@/components/Dashboard/Kanban/Kanban";
import { scheduleToKanbanData } from "@/utils/scheduleToKanban";
import { useEffect, useState } from "react";

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
