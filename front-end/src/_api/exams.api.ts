const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

import type { ExamDetail, ExamSummary } from "@/types/exam.types";

export async function generateExam(params: {
  scheduleId: string;
  eventId: string;
  files: File[];
  title?: string;
  groupKey?: string;
}): Promise<{
  examId: string;
  scheduleId: string;
  eventId: string;
  groupKey?: string;
  groupTitle?: string;
} | null> {
  const fd = new FormData();
  fd.append("scheduleId", params.scheduleId);
  fd.append("eventId", params.eventId);
  if (params.title) fd.append("title", params.title);
  if (params.groupKey) fd.append("groupKey", params.groupKey);
  for (const f of params.files) fd.append("files", f);

  const res = await fetch(`${API_BASE}/api/generate-exam`, {
    method: "POST",
    headers: { ...authHeader() },
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to generate exam");
  return data as {
    examId: string;
    scheduleId: string;
    eventId: string;
    groupKey?: string;
    groupTitle?: string;
  };
}

export async function getAllExams(opts?: {
  scheduleId?: string;
  groupKey?: string;
  signal?: AbortSignal;
}): Promise<ExamSummary[]> {
  const url = new URL(`${API_BASE}/api/exams`);
  if (opts?.scheduleId) url.searchParams.set("scheduleId", opts.scheduleId);
  if (opts?.groupKey) url.searchParams.set("groupKey", opts.groupKey);
  const res = await fetch(url.toString(), {
    headers: { ...authHeader() },
    signal: opts?.signal,
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.exams || []) as ExamSummary[];
}

export async function getExamsForSchedule(
  scheduleId: string,
  opts?: { groupKey?: string; signal?: AbortSignal }
): Promise<ExamSummary[]> {
  if (!scheduleId) return [];
  const url = new URL(`${API_BASE}/api/schedules/${scheduleId}/exams`);
  if (opts?.groupKey) url.searchParams.set("groupKey", opts.groupKey);
  const res = await fetch(url.toString(), {
    headers: { ...authHeader() },
    signal: opts?.signal,
  });
  if (!res.ok) return [];
  const data = await res.json();
  const exams = (data?.exams || []) as ExamSummary[];
  return exams;
}

export async function getExamById(
  examId: string,
  opts?: { signal?: AbortSignal }
): Promise<ExamDetail | null> {
  if (!examId) return null;
  const res = await fetch(`${API_BASE}/api/exams/${examId}`, {
    headers: { ...authHeader() },
    signal: opts?.signal,
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data?.exam as ExamDetail) ?? null;
}
