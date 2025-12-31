import { Badge } from "@/components/ui/badge";
import { KanbanColumn } from "@/components/Dashboard/Kanban/KanbanColumn";

import { SquareArrowOutUpRight } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { KanbanItem } from "@/utils/scheduleToKanban";
import type { IScheduleInput } from "@/components/Calendar/modules/components/calendar/interfaces";

export interface KanbanColumnData {
  id: string;
  title: string;
  colorDot?: string;
  items: KanbanItem[];
}

export interface KanbanBoardProps {
  columns: KanbanColumnData[];
  scheduleExams?: any;
}

export default function KanbanBoard({
  columns,
  scheduleExams,
}: KanbanBoardProps) {
  return (
    <div className="flex flex-row gap-6 overflow-x-auto ">
      {columns.map((column, index) => (
        <KanbanColumn
          key={index}
          id={column.id}
          title={column.title}
          colorDot={column.colorDot}
          count={column.items.length}
          examForeignKey={scheduleExams?.[index].id}
        >
          {column.items.map((item) => (
            <li
              key={item.id}
              className="bg-neutral-50 dark:bg-neutral-900 w-full rounded-xl p-2 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-semibold line-clamp-2">
                  {item.title}
                </h4>

                {item.type && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-medium px-2 py-0.5"
                  >
                    {item.type}
                  </Badge>
                )}
              </div>

              {item.description && (
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </p>
              )}

              <Tooltip>
                <TooltipTrigger className="flex flex-row  text-xs  items-center gap-2 p-0">
                  Date:{" "}
                  <span className="flex flex-row items-center hover:underline cursor-alias gap-1">
                    {item.date}
                    <SquareArrowOutUpRight size={14} />
                  </span>{" "}
                </TooltipTrigger>
                <TooltipContent className="">
                  <p>View Agenda</p>
                </TooltipContent>
              </Tooltip>

              <div className="flex flex-row justify-between items-center mt-2"></div>
            </li>
          ))}
        </KanbanColumn>
      ))}
    </div>
  );
}
