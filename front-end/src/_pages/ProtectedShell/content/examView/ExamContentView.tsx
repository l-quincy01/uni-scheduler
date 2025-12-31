import MockExam from "@/components/Exam/ExamView/MockExam";
import React, { useRef, useState, useEffect } from "react";

import type { Questions } from "@/models/Exam/ExamQuestionsModel";
import type { ExamDetail } from "@/types/exam.types";

import { useNavigate, useParams } from "react-router";
import { getExamById } from "@/_api/exams.api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, Download } from "lucide-react";
import { handleDownloadPDF } from "@/utils/pdfExport";

export default function ExamContentView() {
  const navigate = useNavigate();
  const { contentID } = useParams<{ contentID: string }>();

  const [examData, setExamData] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const downloadableContent = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!contentID) return;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const exam = await getExamById(contentID);
        setExamData(exam);
      } catch (err: any) {
        setError(err?.message || "Failed to load exam");
      } finally {
        setLoading(false);
      }
    })();
  }, [contentID]);

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
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between items-center w-full gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={() => navigate(-1)}
              className="py-1 pr-4 pl-0 m-0 rounded-2xl inline-flex  text-xs hover:bg-accent"
            >
              <ChevronLeft size={16} strokeWidth={2} />
              Back
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go Back</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={handleDownloadPDF}
              className="hover:bg-muted p-2 rounded-full"
            >
              <Download size={18} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div
        className="flex flex-col items-center justify-center py-6"
        ref={downloadableContent}
      >
        <MockExam questions={questions} />
      </div>
    </div>
  );
}
