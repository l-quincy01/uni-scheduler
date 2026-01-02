import React, { useEffect, useState } from "react";
import { FileUpload } from "../ui/file-upload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { toast } from "sonner";
import { getModuleSchedule } from "@/api/schedules.api/schedules.api";
import { generateExam } from "@/api/exam.api/exams.api";

export default function AddExamModal() {
  const { scheduleId, examForeignKey } = useParams<{
    scheduleId: string;
    examForeignKey: string;
  }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  console.log("Schedule:", scheduleId, "Exam ID", examForeignKey);

  const handleFileUpload = (uploaded: File[]) => {
    setFiles((prev) => {
      const merged = [...prev, ...uploaded].slice(0, 5);
      if (merged.length > 5) {
        setValidationError("You can only upload up to 5 files.");
      } else {
        setValidationError("");
      }
      return merged;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scheduleId) {
      setValidationError("Missing schedule context.");
      return;
    }

    if (files.length === 0) {
      setValidationError("Please upload at least 1 file.");
      return;
    }

    setValidationError("");
    setSubmitting(true);

    const examGenerationPromise = generateExam({
      scheduleId: scheduleId!,
      examForeignKey: examForeignKey!,
      files,
      title: title.trim() || undefined,
    });

    toast.promise(examGenerationPromise, {
      loading: "Generating exam...",
      success: (res) => (
        <div className="flex items-center gap-2">
          <span>Exam generated successfully</span>
        </div>
      ),
      error: (err) =>
        err?.message || "Failed to generate exam. Please try again.",
    });

    try {
      await examGenerationPromise;
    } catch (err: any) {
      setValidationError(err?.message || "Failed to generate exam.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-4"
    >
      <div className="font-semibold text-lg">Add an exam</div>

      <Input
        type="text"
        placeholder="Name of exam"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {loadingEvents ? (
        <div className="text-sm text-muted-foreground inline-flex items-center gap-1">
          <LoaderIcon className="animate-spin" size={14} /> Loading events…
        </div>
      ) : null}

      <div className="border rounded-xl">
        <FileUpload onChange={handleFileUpload} />
      </div>

      {validationError && (
        <p className="text-red-500 text-sm">{validationError}</p>
      )}

      <div className="flex flex-row justify-between">
        <Button type="button" variant="secondary">
          Close
        </Button>
        <Button type="submit" variant="secondary" disabled={submitting}>
          {submitting ? "Generating…" : "Generate Exam"}
        </Button>
      </div>
    </form>
  );
}
