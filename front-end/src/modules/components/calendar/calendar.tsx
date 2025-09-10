// import React from "react";
// import { CalendarBody } from "@/modules/components/calendar/calendar-body";
// import { CalendarProvider } from "@/modules/components/calendar/contexts/calendar-context";
// import { DndProvider } from "@/modules/components/calendar/contexts/dnd-context";
// import { CalendarHeader } from "@/modules/components/calendar/header/calendar-header";
// import { getEvents, getUsers } from "@/modules/components/calendar/requests";

// async function getCalendarData() {
// 	return {
// 		events: await getEvents(),
// 		users: await getUsers(),
// 	};
// }

// export async function Calendar() {
// 	const { events, users } = await getCalendarData();

// 	return (
// 		<CalendarProvider events={events} users={users} view="month">
// 			<DndProvider showConfirmation={false}>
// 				<div className="w-full border rounded-xl">
// 					<CalendarHeader />
// 					<CalendarBody />
// 				</div>
// 			</DndProvider>
// 		</CalendarProvider>
// 	);
// }
import React, { useEffect, useState } from "react";
import { CalendarBody } from "@/modules/components/calendar/calendar-body";
import { CalendarProvider } from "@/modules/components/calendar/contexts/calendar-context";
import { DndProvider } from "@/modules/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/modules/components/calendar/header/calendar-header";
import { getEvents, getUsers } from "@/modules/components/calendar/requests";
import type { CalendarEvent, CalendarUser } from "@/_api/requests";

export function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [users, setUsers] = useState<CalendarUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [ev, us] = await Promise.all([getEvents(), getUsers()]);
      if (alive) {
        setEvents(ev);
        setUsers(us);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading)
    return <div className="p-4 text-sm text-muted-foreground">Loading…</div>;

  return (
    <CalendarProvider events={events} users={users} view="month">
      <DndProvider showConfirmation={false}>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
