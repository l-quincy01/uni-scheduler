const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
/* -----------------------------------------------


CHANGES TO BE MADE LATER


-----------------------------------------------
*/
export type CalendarUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  school?: string | null;
  avatarUrl?: string | null;
};

export type CalendarEvent = {
  id: string;
  scheduleId: string;
  title: string;
  description: string;
  color: string;
  startDate: string; // ISO
  endDate: string; // ISO
  user: CalendarUser | null;
};

export async function getEvents(): Promise<CalendarEvent[]> {
  const res = await fetch(`${API_BASE}/api/calendar/events`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) return [];
  return res.json();
}

// Schedules for CalendarProvider (title, timezone, events, exams)
import type { IScheduleInput } from "@/components/Calendar/modules/components/calendar/interfaces";

export async function getAllSchedules(): Promise<IScheduleInput[]> {
  const res = await fetch(`${API_BASE}/api/schedules`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const schedules = (data?.schedules || []) as IScheduleInput[];
  return schedules;
}
export async function getModuleSchedule(
  moduleID: string
): Promise<IScheduleInput[]> {
  if (!moduleID) return [];
  const res = await fetch(`${API_BASE}/api/schedules/${moduleID}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const schedule = data?.schedule as IScheduleInput | undefined;
  return schedule ? [schedule] : [];
}

// Sidebar-friendly schedules
export type NavSchedule = {
  id: string;
  title: string;
  url: "/exam";
  isActive: boolean;
};

export async function getNavSchedules(): Promise<NavSchedule[]> {
  const res = await fetch(`${API_BASE}/api/schedules`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const schedules = (data?.schedules || []) as Array<{
    id?: string;
    _id?: string;
    title?: string;
  }>;
  const items = schedules
    .filter((s) => (s.id || s._id) && s.title)
    .map((s) => ({
      id: String(s.id || s._id),
      title: String(s.title),
      url: "/exam" as const,
      isActive: false,
    }));
  if (items.length > 0) items[0].isActive = true;
  return items;
}

export async function getUsers(): Promise<CalendarUser[]> {
  const res = await fetch(`${API_BASE}/profile/me`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const u = data?.profile ?? data?.user ?? null;
  if (!u) return [];
  return [
    {
      _id: String(u._id ?? u.id ?? ""),
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      email: u.email ?? "",
      phone: u.phone ?? null,
      school: u.school ?? null,
      avatarUrl: u.avatarUrl ?? null,
    },
  ];
}

export async function generateExam(params: {
  scheduleId: string;
  eventId: string;
  files: File[];
  title?: string;
}): Promise<{ examId: string; scheduleId: string; eventId: string } | null> {
  const fd = new FormData();
  fd.append("scheduleId", params.scheduleId);
  fd.append("eventId", params.eventId);
  if (params.title) fd.append("title", params.title);
  for (const f of params.files) fd.append("files", f);

  const res = await fetch(`${API_BASE}/api/generate-exam`, {
    method: "POST",
    headers: { ...authHeader() },
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to generate exam");
  return data as { examId: string; scheduleId: string; eventId: string };
}
