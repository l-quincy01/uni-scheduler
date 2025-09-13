const COLOR_DOT_MAP: Record<string, string> = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  red: "bg-red-600",
  yellow: "bg-yellow-600",
  orange: "bg-orange-600",
  purple: "bg-purple-600",
};

function subjectFromEventTitle(title: string): string {
  const m = title.match(
    /^(?:\s*Study:\s*)?(.+?)(?:\s*\(Session\s*\d+\)\s*)?$/i
  );
  if (m) return m[1].trim();
  return title
    .replace(/^Study:\s*/i, "")
    .replace(/\s*\(Session\s*\d+\)\s*$/i, "")
    .trim();
}

function toYMD(iso: string): string {
  return iso.slice(0, 10);
}

function sessionFromEventTitle(title: string): string {
  // Prefer "(Session N)" form
  const m = title.match(/\(Session\s*(\d+)\s*\)/i);
  if (m) return `Session ${m[1]}`;
  // Fallback: any "Session N" text
  const m2 = title.match(/Session\s*\d+/i);
  if (m2) return m2[0].replace(/\s+/g, " ").trim();
  return "Session";
}

/** Types (adjust or remove if using JS) */
type ScheduleEvent = {
  title: string;
  description: string;
  color: string;
  startDate: string;
  endDate: string;
};

type ScheduleBlock = {
  title: string;
  timezone: string;
  events: ScheduleEvent[];
  exams?: ScheduleEvent[];
};

export type ScheduleInput = {
  schedules: ScheduleBlock[];
};

type KanbanItem = {
  id: number; // index within items[]
  title: string;
  description: string;
  type: "Study";
  date: string; // YYYY-MM-DD
};

type KanbanGroup = {
  id: string; // index within data[] as string for accessibility ids
  title: string; // "Study: <Subject>"
  colorDot: string; // Tailwind class
  items: KanbanItem[];
};

type KanbanBoard = {
  title: string;
  data: KanbanGroup[];
};

/**
 * Convert schedule -> KanbanData with index-based IDs.
 */
export function scheduleToKanbanData(schedule: ScheduleInput): KanbanBoard[] {
  if (!schedule?.schedules?.length) return [];

  return schedule.schedules.map((sch) => {
    const groupsMap = new Map<
      string,
      { colorDot: string; items: Omit<KanbanItem, "id">[] }
    >();

    for (const ev of sch.events ?? []) {
      const subject = subjectFromEventTitle(ev.title);
      const colorDot = COLOR_DOT_MAP[ev.color] ?? "bg-gray-600";

      const item: Omit<KanbanItem, "id"> = {
        title: sessionFromEventTitle(ev.title),
        description: ev.description,
        type: "Study",
        date: toYMD(ev.startDate),
      };

      if (!groupsMap.has(subject)) {
        groupsMap.set(subject, { colorDot, items: [item] });
      } else {
        groupsMap.get(subject)!.items.push(item);
      }
    }

    // Build groups array, sort items by date
    const groupsArr = Array.from(groupsMap.entries()).map(([title, g]) => ({
      title,
      colorDot: g.colorDot,
      items: g.items.sort((a, b) => a.date.localeCompare(b.date)),
    }));

    // Assign index-based IDs
    const data: KanbanGroup[] = groupsArr.map((g, groupIdx) => ({
      id: String(groupIdx),
      title: g.title,
      colorDot: g.colorDot,
      items: g.items.map((it, itemIdx) => ({
        id: itemIdx,
        ...it,
      })),
    }));

    return { title: sch.title, data };
  });
}

/* Example:
const kanban = scheduleToKanbanData(schedule);
// kanban[0].data[0].id === 0
// kanban[0].data[0].items[0].id === 0
*/
