import type { CalendarEvent, CalendarUser } from "@/types/calender.types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getEvents(): Promise<CalendarEvent[]> {
  const res = await fetch(`${API_BASE}/api/calendar/events`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) return [];
  return res.json();
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
