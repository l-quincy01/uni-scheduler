const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Shapes your CalendarProvider already expects
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

// GET /api/calendar/events -> [] (already flattened by your server)
export async function getEvents(): Promise<CalendarEvent[]> {
  const res = await fetch(`${API_BASE}/api/calendar/events`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) return [];
  return res.json();
}

// GET /profile/me -> { profile } or { user }; normalize to [user]
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
