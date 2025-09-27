/**
 * KanbanBoard Component
 *
 * - Renders a Kanban board with multiple columns and items.
 * - Each column displays a title, optional color indicator, and item count.
 * - Items within columns can include type badges, descriptions, due dates, and priorities.
 * - Uses `KanbanColumn` for layout structure and `Badge` for item labeling.
 *
 * @author Quincy Pitsi
 * @version 1.0.0
 * @exports KanbanBoard
 * @constructor
 * @this {React.FC<KanbanBoardProps>}
 * @param {KanbanBoardProps} props - Component props.
 * @returns {JSX.Element} A Kanban board containing columns and items.
 * @throws Will throw if `columns` data is malformed or missing required properties.
 * @see KanbanColumn
 * @see KanbanItem
 * @see KanbanColumnData
 * @todo
 */

import { Badge } from "@/components/ui/badge";
import { KanbanColumn } from "@/components/Dashboard/Kanban/KanbanColumn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router";

/**
 * Represents an item within a Kanban column.
 *
 * @property {string | number} id - Unique identifier for the item.
 * @property {string} title - Title of the task or item.
 * @property {string} [description] - Optional description providing more context.
 * @property {string} [type] - Optional type/category displayed as a badge.
 * @property {string} [date] - Optional due date of the item (ISO string).
 * @property {string} [priority] - Optional priority level displayed with styled badge.
 */
export interface KanbanItem {
  id: string | number;
  title: string;
  description?: string;
  type?: string;
  date?: string;
  priority?: string;
}

/**
 * Represents data for a Kanban column.
 *
 * @property {string} id - Unique identifier for the column.
 * @property {string} title - Title of the column.
 * @property {string} [colorDot] - Optional Tailwind class for a colored dot indicator.
 * @property {KanbanItem[]} items - List of items belonging to the column.
 */

export interface KanbanColumnData {
  id: string;
  title: string;
  colorDot?: string;
  items: KanbanItem[];
}

/**
 * Props for the KanbanBoard component.
 *
 * @property {KanbanColumnData[]} columns - Array of column data to render in the board.
 */
export interface KanbanBoardProps {
  columns: KanbanColumnData[];
}

export default function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div className="flex flex-row gap-6 overflow-x-auto ">
      {columns.map((column, index) => (
        <KanbanColumn
          key={index}
          id={column.id}
          title={column.title}
          colorDot={column.colorDot}
          count={column.items.length}
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
