 
export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

 
export function subjectFromEventTitle(title: string): string {
  const raw = String(title || "");
  const m = raw.match(
    /^(?:\s*(?:Study|Exam):\s*)?(.+?)(?:\s*\(Session\s*\d+\)\s*)?$/i
  );
  if (m) return m[1].trim();
  return raw
    .replace(/^(?:Study|Exam):\s*/i, "")
    .replace(/\s*\(Session\s*\d+\)\s*$/i, "")
    .trim();
}


 
export function slugifySubject(subject: string): string {
  return subject
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
