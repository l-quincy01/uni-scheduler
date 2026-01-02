import { refreshAccessToken } from "./auth";

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const withAuth = (token?: string): RequestInit => ({
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let res = await fetch(input, withAuth(accessToken || undefined));
  if (res.status !== 401 || !refreshToken) return res;

  try {
    const { accessToken: newAccess } = await refreshAccessToken(refreshToken);
    localStorage.setItem("accessToken", newAccess);
    res = await fetch(input, withAuth(newAccess));
    return res;
  } catch {
    return res;
  }
}
