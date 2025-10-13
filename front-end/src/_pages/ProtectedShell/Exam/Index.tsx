"use client";

import { Link, Outlet, useLocation } from "react-router";
import {
  Archive,
  CalendarFold,
  Download,
  Kanban,
  Plus,
  SlashIcon,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import AddExamModal from "@/components/Modals/AddExamModal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContentPanel } from "@/_app/Context/ContentPanelContext";
import { useCourseCalendar } from "@/_app/Context/CourseCalendarContext";
import { handleDownloadPDF } from "@/utils/pdfExport";
import { useEffect, useMemo, useState } from "react";
import { getExamById } from "@/_api/exams.api";

function isObjectId(segment: string) {
  return /^[0-9a-fA-F]{24}$/.test(segment);
}

export default function Index() {
  const { isContentPanelOpen, setIsContentPanelOpen } = useContentPanel();

  const { isCourseCalendarOpen, setCourseCalendarOpen } = useCourseCalendar();

  const location = useLocation();

  const segments = useMemo(
    () => location.pathname.split("/").filter(Boolean),
    [location.pathname]
  );

  const scheduleId =
    segments[1] && isObjectId(segments[1]) ? segments[1] : undefined;
  const hasContent = segments[2] === "content";
  const groupKey = hasContent ? segments[3] : undefined;
  const examId =
    hasContent && segments.length >= 5 && isObjectId(segments[4])
      ? segments[4]
      : undefined;

  const [examTitle, setExamTitle] = useState<string | null>(null);
  useEffect(() => {
    let ignore = false;
    if (!examId) {
      setExamTitle(null);
      return;
    }
    (async () => {
      try {
        const data = await getExamById(examId);
        if (!ignore) setExamTitle(data?.title || null);
      } catch {
        if (!ignore) setExamTitle(null);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [examId]);

  function renderNav() {
    if (hasContent) {
      return (
        <div className="flex flex-row gap-1">
          {scheduleId && hasContent && examId && (
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
          )}
          <Tooltip>
            <TooltipTrigger>
              <div
                className={`hover:bg-muted p-2 rounded-full ${
                  isCourseCalendarOpen ? "bg-muted" : ""
                }`}
                onClick={() => setCourseCalendarOpen((p) => !p)}
              >
                {isCourseCalendarOpen ? (
                  <Kanban size={18} />
                ) : (
                  <CalendarFold size={18} />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isCourseCalendarOpen ? (
                <span>View Kanban</span>
              ) : (
                <span>View Calendar</span>
              )}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              {" "}
              <div
                className={`hover:bg-muted p-2 rounded-full ${
                  isContentPanelOpen ? "bg-muted" : ""
                }`}
                onClick={() => setIsContentPanelOpen((p) => !p)}
              >
                <Archive size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Content for this exam</TooltipContent>
          </Tooltip>

          <Dialog>
            <DialogTrigger>
              <Button variant="secondary">
                Exam
                <Plus size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="scale-90">
              <AddExamModal />
            </DialogContent>
          </Dialog>
        </div>
      );
    }
    return <></>;
  }

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            {scheduleId && (
              <BreadcrumbItem>
                {hasContent || examId ? (
                  <BreadcrumbLink asChild>
                    <Link to={`/exam/${scheduleId}`}>Exam</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>Exam</BreadcrumbPage>
                )}
                {(hasContent || examId) && (
                  <BreadcrumbSeparator>
                    <SlashIcon className="w-3 h-3" />
                  </BreadcrumbSeparator>
                )}
              </BreadcrumbItem>
            )}

            {scheduleId && hasContent && (
              <BreadcrumbItem>
                {examId ? (
                  <BreadcrumbLink asChild>
                    <Link to={`/exam/${scheduleId}/content/${groupKey}`}>
                      Practice Exams
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>Practice Exams</BreadcrumbPage>
                )}
                {examId && (
                  <BreadcrumbSeparator>
                    <SlashIcon className="w-3 h-3" />
                  </BreadcrumbSeparator>
                )}
              </BreadcrumbItem>
            )}

            {scheduleId && hasContent && examId && (
              <BreadcrumbItem>
                <BreadcrumbPage>{examTitle || "Exam"}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {renderNav()}
      </div>

      <Outlet />
    </div>
  );
}
