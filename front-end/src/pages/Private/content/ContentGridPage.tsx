/* eslint-disable @typescript-eslint/no-explicit-any */
import SectionScaffold from "@/components/content/ContentGrid";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, Plus } from "lucide-react";
import { Link, useNavigate, useNavigation, useParams } from "react-router";
import AddExamModal from "@/components/Modals/AddExamModal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ExamContentView from "./examView/ExamContentView";
import { getExamByForeignkey } from "@/api/exam.api/exams.api";
import type { ContentItem } from "@/components/content/Contentitem";
import ContentGrid from "@/components/content/Contentitem";
import { useTheme } from "next-themes";

export default function ContentGridPage() {
  const navigate = useNavigate();
  const { systemTheme } = useTheme();

  const [exams, setExams] = useState<
    Array<{
      id: string;
      scheduleId: string;
      examForeignKey: string;
      title: string;
      createdAt: Date;
      questions: any;
    }>
  >([]);
  const { examForeignKey } = useParams<{ examForeignKey: string }>();

  useEffect(() => {
    if (!examForeignKey) return;

    let ignore = false;

    (async () => {
      try {
        const res = await getExamByForeignkey(examForeignKey);

        if (!ignore) setExams(res);
      } catch (err: any) {
        console.error("Failed to load exams:", err?.message || err);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [examForeignKey]);

  const contentItems: ContentItem[] = exams.map((exam) => ({
    id: exam.id,
    title: exam.title,
    date: new Date(exam.createdAt).toDateString(),
  }));

  return (
    <div>
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

        <Dialog>
          <DialogTrigger>
            <Button variant="secondary">
              Exam
              <Plus size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl">
            <AddExamModal />
          </DialogContent>
        </Dialog>
      </div>

      {contentItems.length === 0 ? (
        <div className="flex flex-col  items-center gap-2 ">
          <img
            className="max-w-md"
            src={
              systemTheme === "dark"
                ? `/Banner/no-exam.png`
                : `/Banner/no-exam-dark.png`
            }
          />
          <div className="text-muted-foreground text-center">
            No Exams Added Yet. <br />
            Click Exam + To Get Started
          </div>
        </div>
      ) : (
        <ContentGrid items={contentItems} variant="Card" headerText={"Exams"} />
      )}
    </div>
  );
}
