export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
  user: { id: number; email: string };
  accessToken: string;
  refreshToken: string;
};

const BASE = import.meta.env.VITE_AUTH_API_BASE as string;

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg =
      data?.error?.[0]?.message ||
      data?.error?.message ||
      data?.error ||
      "Login failed";
    throw new Error(msg);
  }
  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Refresh failed");
  return data as { accessToken: string };
}

export async function logoutUser(refreshToken: string, all: boolean = false) {
  await fetch(`${BASE}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken, all }),
  }).catch(() => {});
}
