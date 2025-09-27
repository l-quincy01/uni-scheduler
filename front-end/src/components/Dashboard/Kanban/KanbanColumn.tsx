/**
 * KanbanColumn Component
 *
 * - Renders a styled Kanban board column with a header and a list of items.
 * - Supports an optional colored dot indicator to distinguish columns visually.
 * - Displays a count of items when provided.
 * - Provides accessibility features with `aria-labelledby` and `role` attributes.
 *
 * @author Quincy Pitsi
 * @version 1.0.0
 * @exports KanbanColumn
 * @constructor
 * @this {React.FC<KanbanColumnProps>}
 * @param {KanbanColumnProps} props - Component props.
 * @returns {JSX.Element} A Kanban column section containing a header and list of children.
 * @throws Will throw if `children` is not a valid React node.
 * @see KanbanColumnProps
 * @todo
 */

import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";

/**
 * Props for the KanbanColumn component.
 *
 * @property {string} id - Unique identifier for the column, used for accessibility (`aria-labelledby`).
 * @property {string} title - Title displayed in the column header.
 * @property {string} [colorDot] - Optional Tailwind class for the color of the dot indicator.
 * @property {number} [count] - Optional count of items displayed next to the title.
 * @property {React.ReactNode} children - The list items or elements inside the column.
 */
type KanbanColumnProps = {
  id: string;
  title: string;
  colorDot?: string;
  count?: number;
  children: React.ReactNode;
};

export function KanbanColumn({
  id,
  title,
  colorDot,
  count,
  children,
}: KanbanColumnProps) {
  const { pathname } = useLocation();
  return (
    <div
      className="flex flex-col rounded-xl  bg-accent border border-neutral-200 dark:border-neutral-800 shadow-sm min-w-[15rem] max-w-[15rem] "
      role="region"
      aria-labelledby={id}
    >
      <header
        id={id}
        className="sticky top-0 z-10 flex items-center gap-2 w-full border-b  pl-4 pr-3 py-2  backdrop-blur rounded-t-xl"
      >
        <span
          className={`inline-block rounded-full ${colorDot} w-2 h-2`}
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold tracking-tight line-clamp-1">
          {title}
        </h3>
        {typeof count === "number" && (
          <span className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">
            {count} item{count !== 1 && "s"}
          </span>
        )}
        {pathname === "/" ? (
          <></>
        ) : (
          <Link to={`content/${id}`}>
            <Button
              variant="outline"
              className="w-fit h-fit py-1 px-1 cursor-pointer"
            >
              Practice
            </Button>
          </Link>
        )}
      </header>
      <ul
        className="flex flex-col gap-3 mt-3 px-3 pb-3 max-h-72 overflow-y-auto scroll-smooth"
        role="list"
      >
        {children}
      </ul>
    </div>
  );
}
