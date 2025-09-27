import MockExam from "@/components/Exam/ExamView/MockExam";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import type { Questions } from "@/models/Exam/ExamQuestionsModel";
import { getExamById, type ExamDetail } from "@/_api/Auth/requests";

export default function ExamContentView() {
  const { id } = useParams<{ id: string }>();
  const [examData, setExamData] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const downloadableContent = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    const ac = new AbortController();
    setLoading(true);
    setError(null);
    setExamData(null);
    (async () => {
      try {
        const data = await getExamById(id, { signal: ac.signal });
        if (!ignore) setExamData(data);
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Failed to load exam");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
      ac.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-8 text-muted-foreground">
        Loading exam…
      </div>
    );
  }
  if (error || !examData) {
    return (
      <div className="flex justify-center py-8 text-red-500">
        {error || "Exam not found"}
      </div>
    );
  }

  const questions = (examData.questions ?? []) as Questions[];

  return (
    <div className="flex py-6" ref={downloadableContent}>
      <MockExam questions={questions} />
    </div>
  );
}
