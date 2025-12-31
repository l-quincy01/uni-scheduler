import Kanban from "@/components/Dashboard/Kanban/Kanban";
import { scheduleToKanbanData } from "@/utils/scheduleToKanban";

import { useEffect, useMemo, useState } from "react";
import type { IScheduleInput } from "@/components/Calendar/modules/components/calendar/interfaces";
import { useParams } from "react-router";
import { getModuleSchedule } from "@/_api/schedules.api";

export default function ContentPage() {
  const [schedules, setSchedules] = useState<IScheduleInput[] | null>(null);
  // const [examID, setExamID] = useState<string[]>() ;
  const [loading, setLoading] = useState(true);

  const { scheduleId } = useParams<{ scheduleId: string }>();
  const safeId = scheduleId ?? "";

  useEffect(() => {
    if (!safeId) return;

    setLoading(true);
    setSchedules(null);

    (async () => {
      try {
        const scheduleData = await getModuleSchedule(safeId);
        setSchedules(scheduleData ?? []);
      } catch {
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [safeId]);

  const boards = useMemo(
    () => scheduleToKanbanData({ schedules: schedules ?? [] }),
    [schedules]
  );

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-8 text-muted-foreground">
          Loading schedule…
        </div>
      ) : boards.length > 0 ? (
        <Kanban key={safeId} boards={boards} schedules={schedules} />
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-xl font-semibold">No Schedule Found.</span>
          <span className="text-md text-muted-foreground">
            Please create a schedule first.
          </span>
        </div>
      )}
    </div>
  );
}
