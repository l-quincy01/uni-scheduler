import React, { useEffect, useState } from "react";
import AddSchedule from "./AddSchedule";
import type { moduleItem } from "./AddSchedule";
import { fetchModules } from "@/api/modules.api/modules.api";
const API_URL = "http://localhost:4000";

export default function AddScheduleLoader() {
  const [modules, setModules] = useState<moduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    fetchModules()
      .then((data) => {
        if (alive) setModules(data);
      })
      .catch((e: any) => {
        if (alive) setErr(e.message || "Failed to load modules");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

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
