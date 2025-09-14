import React, { useEffect, useState } from "react";
import { FileUpload } from "../ui/file-upload";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import pdfIcon from "assets/Icons/ContentPanel/pdf_icon.png";
import { Button } from "../ui/button";
import { ChevronDown, LoaderIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { generateExam, getModuleSchedule } from "@/_api/Auth/requests";
import { toast } from "sonner";

type EventOption = { id: string; title: string; when?: string };

export default function AddExamModal() {
  const { id: scheduleId } = useParams<{ id: string }>();
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
      } catch {
      } finally {
        if (mounted) setLoadingEvents(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [scheduleId]);

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
      setValidationError("Please select an event for this exam.");
      return;
    }
    if (files.length === 0) {
      setValidationError("Please upload at least 1 file.");
      return;
    }

    setValidationError("");
    setSubmitting(true);
    try {
      const res = await generateExam({
        scheduleId,
        eventId: selectedEventId,
        files,
        title: title.trim() || undefined,
      });
      console.log("Exam generated:", res);
      toast.success("Exam generated successfully", {
        action: {
          label: "View",
          onClick: () => navigate(`/exam/${res?.scheduleId}/content`),
        },
      });
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

      {/* Select the schedule event this exam belongs to */}
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost" className="p-0" disabled={loadingEvents}>
            {loadingEvents ? (
              <span className="inline-flex items-center gap-1">
                <LoaderIcon className="animate-spin" size={14} /> Loading
                events…
              </span>
            ) : selectedEventId ? (
              eventOptions.find((o) => o.id === selectedEventId)?.title ||
              "Select Event"
            ) : (
              "Select Event"
            )}
            {!loadingEvents && <ChevronDown size={14} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search Events..." />
            <CommandList className="scrollbar-hide h-sm">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="flex flex-col gap-1">
                {eventOptions.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    className="gap-2 p-2"
                    onSelect={() => setSelectedEventId(opt.id)}
                  >
                    <img src={pdfIcon} className="h-[20px] rounded-sm" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium line-clamp-2">
                        {opt.title}
                      </span>
                      {opt.when && (
                        <span className="text-[10px] text-muted-foreground">
                          {opt.when}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

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
