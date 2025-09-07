import SiteHeader from "@/components/site-header/site-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { Outlet, useLocation } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddSchedule from "@/components/Modals/ExamSchedule/AddSchedule";
import AddScheduleLoader from "@/components/Modals/ExamSchedule/AddScheduleLoader";

export default function Layout() {
  const { pathname } = useLocation();

  console.log("HELLLLLOOOOOOOO-" + pathname);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 items-center">
        <div className="container gap-y-4  flex flex-col gap-x-4   pl-1 pr-4  ">
          <SiteHeader />

          <div className="px-8">
            {pathname === "/" ? (
              <div className="flex flex-row justify-end">
                <Dialog>
                  <DialogTrigger>
                    <Button variant="secondary">
                      Schedule <Plus size={20} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="scale-90">
                    {/* <AddSchedule
                      heading="Select Your Exam Modules"
                      modules={dummyModules}
                    /> */}
                    <AddScheduleLoader />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <></>
            )}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

const dummyModules = [
  {
    category: "Psychology",
    exams: [
      {
        title: "Masters in Counselling Psychology Paper 1: Assessment",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
      {
        title:
          "Organisational Psychology Honours - Occupational Health & Wellbeing",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
      {
        title: "Psychology 202 Paper 2",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
    ],
  },
  {
    category: "Math",
    exams: [
      {
        title: "Mat314",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
      {
        title: "Mat301",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
      {
        title: "Mat202",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
    ],
  },
];
