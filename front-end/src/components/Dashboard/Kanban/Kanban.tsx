/**
 * Kanban Component
 *
 * - Provides a tabbed interface for switching between multiple Kanban boards.
 * - Accepts an array of board objects (each with `title` and `data`).
 * - Renders the selected board’s corresponding `KanbanBoard`.
 *
 * @author Quincy
 * @version 1.1.0
 * @exports Kanban
 * @constructor
 * @this {React.FC<KanbanProps>}
 * @param {KanbanProps} props - Component props.
 * @returns {JSX.Element} A tabbed Kanban board container.
 * @throws Will throw if no data is provided for the selected tab.
 * @see KanbanBoard
 */

import React, { useState } from "react";
import type { KanbanColumnData } from "@/components/Dashboard/Kanban/KanbanBoard";
import KanbanBoard from "@/components/Dashboard/Kanban/KanbanBoard";

/**
 * Props for the Kanban component.
 *
 * @property {{ title: string; data: KanbanColumnData[] }[]} boards - Array of board objects.
 */
export interface KanbanProps {
  boards: {
    title: string;
    data: KanbanColumnData[];
  }[];
}

export default function Kanban({ boards }: KanbanProps) {
  if (!boards.length) {
    throw new Error("No boards provided to Kanban component.");
  }

  const [selectedTab, setSelectedTab] = useState(boards[0].title);

  return (
    <div className=" flex flex-col py-2 px-4 rounded-xl gap-4">
      {/* Tabs */}
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

      {/* Selected board */}
      {boards.map(
        (board) =>
          board.title === selectedTab && (
            <KanbanBoard key={board.title} columns={board.data} />
          )
      )}
    </div>
  );
}
