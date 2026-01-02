const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

import type { moduleItem } from "@/components/Modals/ExamSchedule/AddSchedule";

export async function fetchModules(): Promise<moduleItem[]> {
  const res = await fetch(`${API_BASE}/api/modules`, {
    method: "GET",
    headers: { ...authHeader() },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }

  return data as moduleItem[];
}
