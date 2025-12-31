import React, { useState } from "react";
import type { KanbanColumnData } from "@/components/Dashboard/Kanban/KanbanBoard";
import KanbanBoard from "@/components/Dashboard/Kanban/KanbanBoard";
import type { IScheduleInput } from "@/components/Calendar/modules/components/calendar/interfaces";

export interface KanbanProps {
  boards: {
    title?: string;
    data: KanbanColumnData[];
  }[];
  schedules: IScheduleInput[] | null;
}

export default function Kanban({ boards, schedules }: KanbanProps) {
  if (!boards.length) {
    throw new Error("No boards provided to Kanban component.");
  }

  const [selectedTab, setSelectedTab] = useState(boards[0].title);

  return (
    <div className=" flex flex-col py-2 px-4 rounded-xl gap-4">
      {/* Tabs */}
      {boards.some((board) => board.title) && (
        <div className="w-full flex justify-end">
          <div className="flex rounded-lg border overflow-hidden">
            {boards.map((board, idx) => (
              <button
                key={board.title}
                onClick={() => setSelectedTab(board.title)}
                className={`px-2 py-1 text-sm transition-colors 
                ${
                  selectedTab === board.title
                    ? "bg-neutral-200 dark:bg-accent"
                    : "bg-transparent"
                }
                ${idx !== boards.length - 1 ? "border-r" : ""}
              `}
              >
                {board.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected board */}
      {boards.map(
        (board, index) =>
          board.title === selectedTab && (
            <KanbanBoard
              key={index}
              columns={board.data}
              scheduleExams={schedules?.[index].exams}
            />
          )
      )}
    </div>
  );
}
