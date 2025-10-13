import React, { useEffect, useState } from "react";
import AddSchedule from "./AddSchedule";
import type { moduleItem } from "./AddSchedule";
const API_URL = "http://localhost:4011";

export default function AddScheduleLoader() {
  const [modules, setModules] = useState<moduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/modules`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as moduleItem[];
        if (alive) setModules(data);
      } catch (e: any) {
        if (alive) setErr(e.message || "Failed to load modules");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading)
    return (
      <div className="text-sm text-muted-foreground">Loading modules…</div>
    );
  if (err) return <div className="text-sm text-red-500">Error: {err}</div>;

  return <AddSchedule heading="Select Your Exam Modules" modules={modules} />;
}
