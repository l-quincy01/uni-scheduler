const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  school?: string | null;
  avatarUrl?: string | null;
};

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/auth/profile/me`, {
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
