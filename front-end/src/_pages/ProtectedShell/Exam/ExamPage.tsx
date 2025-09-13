import Kanban from "@/components/Dashboard/Kanban/Kanban";
import { scheduleToKanbanData } from "@/utils/scheduleToKanban";
import { getModuleSchedule } from "@/_api/Auth/requests";
import { useEffect, useMemo, useState } from "react";
import type { IScheduleInput } from "@/components/Calendar/modules/components/calendar/interfaces";
import { useParams } from "react-router";

export default function ExamPage() {
  const [schedules, setSchedules] = useState<IScheduleInput[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();
  const safeId = id ?? "";

  useEffect(() => {
    if (!safeId) return;

    //force remount when id changes
    let ignore = false;
    const ac = new AbortController();

    //  id change trigger a fresh load state
    setLoading(true);
    setSchedules(null);

    (async () => {
      try {
        const s = await getModuleSchedule(safeId, { signal: ac.signal } as any);
        if (!ignore) setSchedules(s ?? []);
      } catch {
        if (!ignore) setSchedules([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
      ac.abort();
    };
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
        <Kanban key={safeId} boards={boards} />
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
