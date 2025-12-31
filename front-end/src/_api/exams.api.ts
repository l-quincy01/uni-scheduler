/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function generateExam(params: {
  scheduleId: string;
  examForeignKey: string;
  files: File[];
  title?: string;
}) {
  const fd = new FormData();

  fd.append("scheduleId", params.scheduleId);
  fd.append("examForeignKey ", params.examForeignKey);

  if (params.title) fd.append("title", params.title);

  for (const f of params.files) {
    fd.append("files", f);
  }

  const res = await fetch(`${API_BASE}/api/exam`, {
    method: "POST",
    headers: {
      ...authHeader(),
    },
    body: fd,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to generate exam");
  }

  return data as {
    examForeignKey: string;
    scheduleId: string;
  };
}

export async function getExamByForeignkey(examForeignKey: string) {
  if (!examForeignKey) throw new Error("Exam Foreign Key is Empty");

  const res = await fetch(`${API_BASE}/api/exam/by-key/${examForeignKey}`, {
    method: "GET",
    headers: { ...authHeader() },
  });

  if (!res.ok) throw new Error("Response failed");

  const data = await res.json();

  return data.exams as Array<{
    id: string;
    scheduleId: string;
    examForeignKey: string;
    title: string;
    createdAt: Date;
    questions: any;
  }>;
}

export async function getExamById(examId: string) {
  if (!examId) throw new Error("Exam id is required");

  const res = await fetch(`${API_BASE}/api/exam/${examId}`, {
    method: "GET",
    headers: {
      ...authHeader(),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Failed to fetch exam");
  }

  const data = await res.json();

  return data.exam as {
    id: string;
    scheduleId: string | null;
    examForeignKey: string | null;
    title: string;
    createdAt: Date;
    questions: any;
  };
}
