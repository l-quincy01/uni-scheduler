import React, { useEffect, useState } from "react";
import { FileUpload } from "../ui/file-upload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { generateExam, getModuleSchedule } from "@/_api/Auth/requests";
import { toast } from "sonner";

type EventOption = { id: string; title: string; when?: string };

export default function AddExamModal() {
  const { id: scheduleId, groupKey } = useParams<{
    id: string;
    groupKey?: string;
  }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState("");
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!scheduleId) return;
      setLoadingEvents(true);
      try {
        const arr = await getModuleSchedule(scheduleId);
        const schedule = arr[0];
        if (!schedule) return;
        const toOpt = (e: any): EventOption => ({
          id: String(e._id || e.id || ""),
          title: String(e.title || "Untitled"),
          when: e.startDate
            ? new Date(e.startDate).toLocaleString()
            : undefined,
        });
        const opts: EventOption[] = [
          ...(schedule.events || []).map(toOpt),
          ...(schedule.exams || []).map(toOpt),
        ];
        if (mounted) setEventOptions(opts);

        // Auto-select event by matching groupKey to slug(subject(title))
        const subjectFromEventTitle = (t: string) => {
          const m = String(t).match(
            /^(?:\s*(?:Study|Exam):\s*)?(.+?)(?:\s*\(Session\s*\d+\)\s*)?$/i
          );
          if (m) return m[1].trim();
          return String(t)
            .replace(/^(?:Study|Exam):\s*/i, "")
            .replace(/\s*\(Session\s*\d+\)\s*$/i, "")
            .trim();
        };
        const slugify = (s: string) =>
          s
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        let autoId: string | null = null;
        if (groupKey) {
          const match = opts.find(
            (o) => slugify(subjectFromEventTitle(o.title)) === groupKey
          );
          if (match) autoId = match.id;
        }
        if (!autoId && opts.length > 0) {
          autoId = opts[0].id;
        }
        if (mounted) setSelectedEventId(autoId);
      } catch {
      } finally {
        if (mounted) setLoadingEvents(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [scheduleId, groupKey]);

  const handleFileUpload = (uploaded: File[]) => {
    // accumulate incoming files but cap at 5
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
    if (!selectedEventId) {
      setValidationError("No matching event found for this group.");
      return;
    }
    if (files.length === 0) {
      setValidationError("Please upload at least 1 file.");
      return;
    }

    setValidationError("");
    setSubmitting(true);

    const examGenerationPromise = generateExam({
      scheduleId,
      eventId: selectedEventId,
      files,
      title: title.trim() || undefined,
      groupKey: groupKey || undefined,
    });

    toast.promise(examGenerationPromise, {
      loading: "Generating exam...",
      success: (res) => (
        <div className="flex items-center gap-2">
          <span>Exam generated successfully</span>
          <Button
            onClick={() =>
              navigate(
                res?.groupKey
                  ? `/exam/${res?.scheduleId}/content/${res.groupKey}`
                  : `/exam/${res?.scheduleId}/content`
              )
            }
            className="ml-2 underline text-blue-500 hover:text-blue-600"
          >
            View
          </Button>
        </div>
      ),
      error: (err) =>
        err?.message || "Failed to generate exam. Please try again.",
    });

    try {
      await examGenerationPromise;

      // const res = await generateExam({
      //   scheduleId,
      //   eventId: selectedEventId,
      //   files,
      //   title: title.trim() || undefined,
      //   groupKey: groupKey || undefined,
      // });
      // console.log("Exam generated:", res);
      // toast.success("Exam generated successfully", {
      //   action: {
      //     label: "View",
      //     onClick: () =>
      //       navigate(
      //         res?.groupKey
      //           ? `/exam/${res?.scheduleId}/content/${res.groupKey}`
      //           : `/exam/${res?.scheduleId}/content`
      //       ),
      //   },
      // });
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

      {/* Event selection removed; eventId is auto-selected by groupKey */}
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
