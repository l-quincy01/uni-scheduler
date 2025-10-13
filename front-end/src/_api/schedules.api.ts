const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

import type { IScheduleInput } from "@/components/Calendar/modules/components/calendar/interfaces";

export async function getAllSchedules(): Promise<IScheduleInput[]> {
  const res = await fetch(`${API_BASE}/api/schedules`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.schedules || []) as IScheduleInput[];
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

/** -------------------------------------------------------------------
 * Sidebar-friendly version of schedules for navigation menus
 * ------------------------------------------------------------------*/
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
