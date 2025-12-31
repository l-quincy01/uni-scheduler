const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type User = {
  _id: string;
  sqlId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  school?: string | null;
  avatarUrl?: string | null;
};

type UpdateUserPayload = {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  school?: string | null;
  avatarUrl?: string | null;
};

export async function getUser(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/auth/users/:id`, {
    headers: { ...authHeader() },
    method: "GET",
  });
  if (!res.ok) return [];
  const data = await res.json();
  const user = data?.profile ?? data?.user ?? null;
  if (!user) return [];
  return [
    {
      _id: String(user._id ?? ""),
      sqlId: user.id,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      phone: user.phone ?? null,
      school: user.school ?? null,
      avatarUrl: user.avatarUrl ?? null,
    },
  ];
}
export async function updateUser(
  id: number,
  payload: UpdateUserPayload
): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to update user");
  }

  const data = await res.json();
  return data.profile;
}

export async function deleteUser(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/users/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to delete user");
  }

  const data = await res.json();
  return data.success === true;
}
